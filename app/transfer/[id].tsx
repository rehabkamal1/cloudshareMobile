import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Zap,
} from 'lucide-react-native';
import { MobileTransferEngine } from '../../src/services/transferEngine';
import { TransferProgress, formatBytes, formatSpeed, formatDuration } from '@shareflow/shared';

export default function TransferStatusScreen() {
  const router = useRouter();
  const engine = MobileTransferEngine.getInstance();
  const [progress, setProgress] = useState<TransferProgress | null>(engine.getActiveProgress());

  useEffect(() => {
    engine.onProgress((p) => {
      setProgress({ ...p });
    });
  }, []);

  const isCompleted = progress?.status === 'completed';
  const isFailed = progress?.status === 'failed';
  const isCancelled = progress?.status === 'cancelled';
  const isAwaiting = progress?.status === 'awaiting_approval';
  const isTransferring = progress?.status === 'transferring';

  const handleCancel = () => {
    engine.cancelTransfer();
  };

  const handleDone = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Status Icon */}
          <View style={styles.iconWrap}>
            {isTransferring && (
              <View style={[styles.badge, { backgroundColor: '#EAE5FF' }]}>
                {progress?.direction === 'outgoing' ? (
                  <ArrowUpRight size={36} color="#7667C9" />
                ) : (
                  <ArrowDownLeft size={36} color="#328768" />
                )}
              </View>
            )}

            {isAwaiting && (
              <View style={[styles.badge, { backgroundColor: '#DDEBFF' }]}>
                <Clock size={36} color="#1E40AF" />
              </View>
            )}

            {isCompleted && (
              <View style={[styles.badge, { backgroundColor: '#DDF3E8' }]}>
                <CheckCircle2 size={40} color="#328768" />
              </View>
            )}

            {(isFailed || isCancelled) && (
              <View style={[styles.badge, { backgroundColor: '#FEE2E2' }]}>
                {isCancelled ? (
                  <XCircle size={40} color="#C45462" />
                ) : (
                  <AlertCircle size={40} color="#C45462" />
                )}
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {isAwaiting && 'بانتظار موافقة الطرف الآخر...'}
            {isTransferring &&
              (progress?.direction === 'outgoing' ? 'جاري إرسال الملفات...' : 'جاري استلام الملفات...')}
            {isCompleted && 'تم النقل بنجاح!'}
            {isCancelled && 'تم إلغاء عملية النقل'}
            {isFailed && 'فشل نقل الملفات'}
          </Text>

          {/* Description */}
          <Text style={styles.subtitle}>
            {isTransferring && progress?.files[progress.currentFileIndex] && (
              <Text>
                الملف ({progress.currentFileIndex + 1} من {progress.files.length}):{' '}
                {progress.files[progress.currentFileIndex].name}
              </Text>
            )}
            {isCompleted && 'تم حفظ الملفات على جهازك بنجاح بأعلى سرعة شبكة.'}
            {isCancelled && 'تم إنهاء الجلسة بناءً على طلب أحد الطرفين.'}
            {isFailed && (progress?.errorMessage || 'حدث انقطاع في الاتصال أو عدم استجابة.')}
          </Text>

          {/* Progress Bar & Details */}
          {(isTransferring || isCompleted) && (
            <View style={styles.progressContainer}>
              <View style={styles.progressStats}>
                <Text style={styles.bytesText}>
                  {formatBytes(progress?.transferredBytes || 0)} / {formatBytes(progress?.totalBytes || 0)}
                </Text>
                <Text style={styles.percentageText}>{progress?.percentage || 0}%</Text>
              </View>

              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progress?.percentage || 0}%` },
                  ]}
                />
              </View>

              {isTransferring && (
                <View style={styles.metricsRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Zap size={14} color="#7667C9" />
                    <Text style={styles.metricText}>
                      السرعة: {formatSpeed(progress?.speedBps || 0)}
                    </Text>
                  </View>
                  <Text style={styles.metricText}>
                    المتبقي: {formatDuration(progress?.remainingSeconds || 0)}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Actions */}
          <View style={styles.actionsRow}>
            {isTransferring && (
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelBtnText}>إلغاء النقل</Text>
              </TouchableOpacity>
            )}

            {(isCompleted || isCancelled || isFailed) && (
              <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
                <Text style={styles.doneBtnText}>العودة للرئيسية</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7FC',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E5F0',
    shadowColor: '#7667C9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  iconWrap: {
    marginBottom: 16,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#29283A',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#77758B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 24,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bytesText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#29283A',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5B4BB0',
  },
  progressBarTrack: {
    height: 12,
    backgroundColor: '#F0EEFA',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7667C9',
    borderRadius: 999,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  metricText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#77758B',
  },
  actionsRow: {
    width: '100%',
  },
  cancelBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#C45462',
    fontSize: 15,
    fontWeight: '700',
  },
  doneBtn: {
    backgroundColor: '#7667C9',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

