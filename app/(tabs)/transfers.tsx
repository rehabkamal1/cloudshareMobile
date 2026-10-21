import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { ArrowUpRight, ArrowDownLeft, Trash2, CheckCircle2, Clock, Inbox } from 'lucide-react-native';
import { MobileStorageService } from '../../src/services/storage';
import { TransferHistoryItem, formatBytes } from '@shareflow/shared';

export default function TransfersScreen() {
  const [history, setHistory] = useState<TransferHistoryItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'outgoing' | 'incoming'>('all');

  const loadData = async () => {
    const list = await MobileStorageService.getHistory();
    setHistory(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClear = () => {
    Alert.alert(
      'مسح سجل التحويلات',
      'هل أنت متأكد من رغبتك في حذف سجل التحويلات بالكامل؟ لن تتأثر الملفات المحفوظة.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'مسح الآن',
          style: 'destructive',
          onPress: async () => {
            await MobileStorageService.clearHistory();
            setHistory([]);
          },
        },
      ]
    );
  };

  const filteredHistory = history.filter((item) => {
    if (filter === 'outgoing') return item.direction === 'outgoing';
    if (filter === 'incoming') return item.direction === 'incoming';
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>سجل التحويلات</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <Trash2 size={16} color="#C45462" />
            <Text style={styles.clearBtnText}>مسح السجل</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterPill, filter === 'all' && styles.filterPillActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterPillText, filter === 'all' && styles.filterPillTextActive]}>
            الكل ({history.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, filter === 'outgoing' && styles.filterPillActive]}
          onPress={() => setFilter('outgoing')}
        >
          <Text style={[styles.filterPillText, filter === 'outgoing' && styles.filterPillTextActive]}>
            المرسلة ({history.filter((i) => i.direction === 'outgoing').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, filter === 'incoming' && styles.filterPillActive]}
          onPress={() => setFilter('incoming')}
        >
          <Text style={[styles.filterPillText, filter === 'incoming' && styles.filterPillTextActive]}>
            المستلمة ({history.filter((i) => i.direction === 'incoming').length})
          </Text>
        </TouchableOpacity>
      </View>

      {filteredHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrap}>
            <Inbox size={40} color="#7667C9" />
          </View>
          <Text style={styles.emptyTitle}>لا توجد تحويلات في هذا القسم</Text>
          <Text style={styles.emptySubtitle}>
            ستظهر كل العمليات التي قمت بها محلياً مع تفاصيل الحجم والتاريخ هنا.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={[
                    styles.directionBadge,
                    { backgroundColor: item.direction === 'outgoing' ? '#EAE5FF' : '#DDF3E8' },
                  ]}
                >
                  {item.direction === 'outgoing' ? (
                    <ArrowUpRight size={20} color="#7667C9" />
                  ) : (
                    <ArrowDownLeft size={20} color="#328768" />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {item.files[0]?.name || 'ملف تم نقله'}
                    {item.filesCount > 1 && ` (+${item.filesCount - 1} ملفات)`}
                  </Text>
                  <Text style={styles.detailsText}>
                    {item.direction === 'outgoing' ? 'إلى' : 'من'}: {item.peerName} •{' '}
                    {formatBytes(item.totalSize)}
                  </Text>
                </View>
              </View>

              <View style={{ alignItems: 'flex-start' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={13} color="#328768" />
                  <Text style={styles.statusText}>مكتمل</Text>
                </View>
                <Text style={styles.timeText}>
                  {new Date(item.timestamp).toLocaleDateString('ar-EG', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7FC',
    paddingTop: Platform.OS === 'android' ? 32 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#29283A',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C45462',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5F0',
  },
  filterPillActive: {
    backgroundColor: '#7667C9',
    borderColor: '#7667C9',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#77758B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 10,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E5F0',
  },
  directionBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#29283A',
    maxWidth: 200,
    textAlign: 'right',
  },
  detailsText: {
    fontSize: 12,
    color: '#77758B',
    marginTop: 2,
    textAlign: 'right',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#328768',
  },
  timeText: {
    fontSize: 11,
    color: '#77758B',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: -40,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#EAE5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#29283A',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#77758B',
    textAlign: 'center',
    lineHeight: 20,
  },
});

