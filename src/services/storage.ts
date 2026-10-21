import * as FileSystem from 'expo-file-system';
import { TransferHistoryItem } from '@shareflow/shared';

const HISTORY_FILE = `${FileSystem.documentDirectory}shareflow_history.json`;
const PREFS_FILE = `${FileSystem.documentDirectory}shareflow_prefs.json`;

export interface AppPreferences {
  deviceName: string;
  autoSaveToGallery: boolean;
  savePath: string;
}

export class MobileStorageService {
  static async getHistory(): Promise<TransferHistoryItem[]> {
    try {
      const info = await FileSystem.getInfoAsync(HISTORY_FILE);
      if (!info.exists) return [];
      const content = await FileSystem.readAsStringAsync(HISTORY_FILE);
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  static async saveHistoryItem(item: TransferHistoryItem): Promise<void> {
    try {
      const current = await this.getHistory();
      const updated = [item, ...current].slice(0, 100);
      await FileSystem.writeAsStringAsync(HISTORY_FILE, JSON.stringify(updated));
    } catch (err) {
      console.error('[Storage] Error saving history:', err);
    }
  }

  static async clearHistory(): Promise<void> {
    try {
      await FileSystem.deleteAsync(HISTORY_FILE, { idempotent: true });
    } catch (err) {
      console.error('[Storage] Error clearing history:', err);
    }
  }

  static async getPreferences(): Promise<AppPreferences> {
    try {
      const info = await FileSystem.getInfoAsync(PREFS_FILE);
      if (!info.exists) {
        return {
          deviceName: 'هاتف أندرويد (CloudShare)',
          autoSaveToGallery: true,
          savePath: 'Downloads',
        };
      }
      const content = await FileSystem.readAsStringAsync(PREFS_FILE);
      return JSON.parse(content);
    } catch {
      return {
        deviceName: 'هاتف أندرويد (CloudShare)',
        autoSaveToGallery: true,
        savePath: 'Downloads',
      };
    }
  }

  static async updatePreferences(prefs: Partial<AppPreferences>): Promise<void> {
    try {
      const current = await this.getPreferences();
      const next = { ...current, ...prefs };
      await FileSystem.writeAsStringAsync(PREFS_FILE, JSON.stringify(next));
    } catch (err) {
      console.error('[Storage] Error updating preferences:', err);
    }
  }
}

