import * as FileSystem from 'expo-file-system';
import {
  CHUNK_SIZE,
  DeviceInfo,
  SharedFileItem,
  TransferProgress,
  generatePinCode,
} from '@shareflow/shared';
import { MobileStorageService } from './storage';

export type MobileTransferCallback = (progress: TransferProgress) => void;
export type MobileIncomingOfferCallback = (
  offer: { senderName: string; files: SharedFileItem[]; totalBytes: number },
  accept: () => void,
  reject: () => void
) => void;

export class MobileTransferEngine {
  private static instance: MobileTransferEngine;
  private ws: WebSocket | null = null;
  private deviceId = 'android_' + Math.random().toString(36).substring(2, 9);
  private myPin = generatePinCode();
  private wsUrl = 'ws://192.168.1.100:4000/ws/signaling'; // Local LAN or default
  private isConnected = false;
  private pairedPeerId: string | null = null;
  private pairedDevice: DeviceInfo | null = null;

  private progressCallback: MobileTransferCallback | null = null;
  private incomingOfferCallback: MobileIncomingOfferCallback | null = null;
  private activeProgress: TransferProgress | null = null;

  // Receiving state
  private receivingFiles: SharedFileItem[] = [];
  private currentReceivingIndex = 0;
  private totalReceivingBytes = 0;
  private totalReceivedBytes = 0;
  private currentFileBase64 = '';
  private transferStartTime = 0;

  // Sending state
  private sendingFiles: SharedFileItem[] = [];
  private isCancelled = false;

  public static getInstance(): MobileTransferEngine {
    if (!MobileTransferEngine.instance) {
      MobileTransferEngine.instance = new MobileTransferEngine();
    }
    return MobileTransferEngine.instance;
  }

  private constructor() {
    this.connect();
  }

  public setHubUrl(url: string) {
    this.wsUrl = url;
    if (this.ws) {
      this.ws.close();
    }
    this.connect();
  }

  public getMyDetails(): { id: string; pin: string; name: string } {
    return {
      id: this.deviceId,
      pin: this.myPin,
      name: 'هاتف أندرويد (CloudShare)',
    };
  }

  public onProgress(cb: MobileTransferCallback) {
    this.progressCallback = cb;
  }

  public onIncomingOffer(cb: MobileIncomingOfferCallback) {
    this.incomingOfferCallback = cb;
  }

  public getActiveProgress(): TransferProgress | null {
    return this.activeProgress;
  }

  public getPairedDevice(): DeviceInfo | null {
    return this.pairedDevice;
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.ws?.send(
          JSON.stringify({
            type: 'register',
            payload: {
              id: this.deviceId,
              pin: this.myPin,
              deviceType: 'android',
              deviceName: 'هاتف أندرويد (CloudShare)',
            },
          })
        );
      };

      this.ws.onmessage = async (event) => {
        try {
          const msg = JSON.parse(event.data);
          await this.handleMessage(msg);
        } catch (e) {
          console.error('[Mobile Transfer] Parse error:', e);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        setTimeout(() => this.connect(), 5000);
      };

      this.ws.onerror = (err) => {
        console.warn('[Mobile Transfer] WebSocket notice (LAN hub offline or reconnecting):', err);
      };
    } catch (e) {
      console.warn('[Mobile Transfer] Connect error:', e);
    }
  }

  private async handleMessage(msg: any) {
    const { type, payload } = msg;

    switch (type) {
      case 'incoming_pair_request': {
        const { requesterId, requesterInfo } = payload;
        // Accept pairing
        this.pairedPeerId = requesterId;
        this.pairedDevice = requesterInfo;
        this.ws?.send(
          JSON.stringify({
            type: 'pair_accept',
            payload: { targetId: requesterId },
          })
        );
        break;
      }

      case 'pair_connected': {
        this.pairedPeerId = payload.peerId;
        this.pairedDevice = {
          id: payload.peerId,
          name: payload.deviceName,
          type: payload.deviceType,
        };
        break;
      }

      case 'transfer_offer': {
        const { transferId, files, totalBytes, senderName } = payload;
        this.receivingFiles = files;
        this.totalReceivingBytes = totalBytes;
        this.totalReceivedBytes = 0;
        this.currentReceivingIndex = 0;

        if (this.incomingOfferCallback) {
          this.incomingOfferCallback(
            { senderName, files, totalBytes },
            () => this.acceptTransfer(transferId),
            () => this.rejectTransfer(transferId)
          );
        } else {
          this.acceptTransfer(transferId);
        }
        break;
      }

      case 'transfer_response': {
        if (payload.accepted) {
          this.executeSendChunks();
        } else {
          this.updateProgress({
            status: 'failed',
            errorMessage: payload.reason || 'تم رفض النقل من قبل المستلم',
          });
        }
        break;
      }

      case 'chunk_data': {
        await this.handleIncomingChunk(payload);
        break;
      }

      case 'transfer_cancel': {
        this.updateProgress({
          status: 'cancelled',
          errorMessage: 'تم إلغاء النقل من الجهاز الآخر',
        });
        break;
      }

      case 'transfer_complete': {
        this.finishTransferSuccess();
        break;
      }
    }
  }

  public pairWithPin(pin: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('خادم الإشارات غير متصل حالياً، يرجى التأكد من تشغيل الشبكة');
    }

    this.ws.send(
      JSON.stringify({
        type: 'pair_request',
        payload: {
          targetPin: pin,
          requesterInfo: {
            id: this.deviceId,
            name: 'هاتف أندرويد',
            deviceType: 'android',
          },
        },
      })
    );
  }

  public acceptTransfer(transferId: string) {
    if (!this.pairedPeerId) return;

    this.ws?.send(
      JSON.stringify({
        type: 'transfer_response',
        payload: { targetId: this.pairedPeerId, transferId, accepted: true },
      })
    );

    this.transferStartTime = Date.now();
    this.currentFileBase64 = '';

    this.updateProgress({
      sessionId: transferId,
      status: 'transferring',
      direction: 'incoming',
      mode: 'local_companion',
      files: this.receivingFiles,
      currentFileIndex: 0,
      totalBytes: this.totalReceivingBytes,
      transferredBytes: 0,
      percentage: 0,
      speedBps: 0,
      remainingSeconds: 0,
    });
  }

  public rejectTransfer(transferId: string) {
    if (!this.pairedPeerId) return;
    this.ws?.send(
      JSON.stringify({
        type: 'transfer_response',
        payload: { targetId: this.pairedPeerId, transferId, accepted: false, reason: 'رفض المستلم الطلب' },
      })
    );
  }

  private async handleIncomingChunk(payload: {
    fileIndex: number;
    chunkIndex: number;
    base64Data: string;
    isLastChunk: boolean;
  }) {
    this.currentFileBase64 += payload.base64Data;
    // Base64 to approximate byte length
    const chunkBytes = Math.floor((payload.base64Data.length * 3) / 4);
    this.totalReceivedBytes += chunkBytes;

    const elapsed = Math.max(0.1, (Date.now() - this.transferStartTime) / 1000);
    const speed = this.totalReceivedBytes / elapsed;
    const remaining = Math.max(0, this.totalReceivingBytes - this.totalReceivedBytes);
    const remainingSecs = speed > 0 ? Math.ceil(remaining / speed) : 0;
    const pct = Math.min(100, Math.round((this.totalReceivedBytes / this.totalReceivingBytes) * 100));

    this.updateProgress({
      status: 'transferring',
      transferredBytes: this.totalReceivedBytes,
      percentage: pct,
      speedBps: Math.round(speed),
      remainingSeconds: remainingSecs,
      currentFileIndex: payload.fileIndex,
    });

    if (payload.isLastChunk) {
      // Save file to device
      const file = this.receivingFiles[payload.fileIndex];
      const targetPath = `${FileSystem.documentDirectory}${file?.name || 'transferred_file'}`;

      try {
        await FileSystem.writeAsStringAsync(targetPath, this.currentFileBase64, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } catch (err) {
        console.error('[Transfer] Error saving received file:', err);
      }

      this.currentFileBase64 = '';

      if (payload.fileIndex + 1 >= this.receivingFiles.length) {
        this.finishTransferSuccess();
      }
    }
  }

  public async sendFiles(files: SharedFileItem[]) {
    if (!this.pairedPeerId) {
      throw new Error('يرجى الاقتران بجهاز كمبيوتر أو هاتف آخر أولاً');
    }

    this.sendingFiles = files;
    this.isCancelled = false;
    const totalBytes = files.reduce((acc, f) => acc + (f.size || 0), 0);
    const transferId = 'tx_mob_' + Date.now();

    this.updateProgress({
      sessionId: transferId,
      status: 'awaiting_approval',
      direction: 'outgoing',
      mode: 'local_companion',
      files,
      currentFileIndex: 0,
      totalBytes,
      transferredBytes: 0,
      percentage: 0,
      speedBps: 0,
      remainingSeconds: 0,
    });

    this.ws?.send(
      JSON.stringify({
        type: 'transfer_offer',
        payload: {
          targetId: this.pairedPeerId,
          transferId,
          files,
          totalBytes,
          senderName: 'هاتف أندرويد',
        },
      })
    );
  }

  private async executeSendChunks() {
    if (!this.activeProgress || !this.pairedPeerId) return;

    this.updateProgress({ status: 'transferring' });
    this.transferStartTime = Date.now();
    let totalSent = 0;

    for (let fIdx = 0; fIdx < this.sendingFiles.length; fIdx++) {
      const file = this.sendingFiles[fIdx];
      if (this.isCancelled) return;

      try {
        // Read file in chunks or full base64 for small/medium files
        const fileContent = file.uri
          ? await FileSystem.readAsStringAsync(file.uri, { encoding: FileSystem.EncodingType.Base64 })
          : '';

        const chunkLen = 40000; // ~30KB chunks in base64
        let offset = 0;
        let cIdx = 0;

        while (offset < fileContent.length) {
          if (this.isCancelled) return;

          const slice = fileContent.slice(offset, offset + chunkLen);
          offset += chunkLen;
          const isLastChunk = offset >= fileContent.length;

          this.ws?.send(
            JSON.stringify({
              type: 'chunk_data',
              payload: {
                targetId: this.pairedPeerId,
                fileIndex: fIdx,
                chunkIndex: cIdx++,
                base64Data: slice,
                isLastChunk,
              },
            })
          );

          totalSent += Math.floor((slice.length * 3) / 4);
          const elapsed = Math.max(0.1, (Date.now() - this.transferStartTime) / 1000);
          const speed = totalSent / elapsed;
          const remBytes = Math.max(0, this.activeProgress.totalBytes - totalSent);
          const remSecs = speed > 0 ? Math.ceil(remBytes / speed) : 0;
          const pct = Math.min(100, Math.round((totalSent / this.activeProgress.totalBytes) * 100));

          this.updateProgress({
            transferredBytes: totalSent,
            percentage: pct,
            speedBps: Math.round(speed),
            remainingSeconds: remSecs,
            currentFileIndex: fIdx,
          });

          await new Promise((r) => setTimeout(r, 15));
        }
      } catch (err: any) {
        console.error('[Transfer] Read file chunk error:', err);
        this.updateProgress({
          status: 'failed',
          errorMessage: 'فشلت قراءة الملف من ذاكرة الهاتف: ' + err.message,
        });
        return;
      }
    }

    this.finishTransferSuccess();

    this.ws?.send(
      JSON.stringify({
        type: 'transfer_complete',
        payload: { targetId: this.pairedPeerId },
      })
    );
  }

  public cancelTransfer() {
    this.isCancelled = true;
    if (this.pairedPeerId) {
      this.ws?.send(
        JSON.stringify({
          type: 'transfer_cancel',
          payload: { targetId: this.pairedPeerId },
        })
      );
    }
    this.updateProgress({ status: 'cancelled' });
  }

  private finishTransferSuccess() {
    if (!this.activeProgress) return;

    this.updateProgress({
      status: 'completed',
      percentage: 100,
      transferredBytes: this.activeProgress.totalBytes,
    });

    // Save to local history
    MobileStorageService.saveHistoryItem({
      id: 'hist_' + Date.now(),
      sessionId: this.activeProgress.sessionId,
      direction: this.activeProgress.direction,
      mode: this.activeProgress.mode,
      peerName: this.pairedDevice?.name || 'جهاز مجاور',
      peerType: this.pairedDevice?.type || 'computer',
      filesCount: this.activeProgress.files.length,
      files: this.activeProgress.files.map((f) => ({ name: f.name, size: f.size, mimeType: f.mimeType })),
      totalSize: this.activeProgress.totalBytes,
      status: 'completed',
      timestamp: Date.now(),
      durationMs: Date.now() - this.transferStartTime,
    });
  }

  private updateProgress(partial: Partial<TransferProgress>) {
    if (!this.activeProgress) {
      this.activeProgress = {
        sessionId: 'tx_' + Date.now(),
        status: partial.status || 'idle',
        direction: 'outgoing',
        mode: 'local_companion',
        files: [],
        currentFileIndex: 0,
        totalBytes: 0,
        transferredBytes: 0,
        percentage: 0,
        speedBps: 0,
        remainingSeconds: 0,
        ...partial,
      };
    } else {
      this.activeProgress = { ...this.activeProgress, ...partial };
    }

    if (this.progressCallback) {
      this.progressCallback(this.activeProgress);
    }
  }
}

