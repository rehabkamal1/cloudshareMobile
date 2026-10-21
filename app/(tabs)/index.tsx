import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Modal,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Send,
  Download,
  Monitor,
  Link2,
  ShieldCheck,
  Smartphone,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  CheckCircle2,
  Zap,
} from 'lucide-react-native';
import { MobileTransferEngine } from '../../src/services/transferEngine';
import { MobileStorageService } from '../../src/services/storage';
import { TransferHistoryItem, SharedFileItem, formatBytes } from '@shareflow/shared';

export default function HomeScreen() {
  const router = useRouter();
  const [recentTransfers, setRecentTransfers] = useState<TransferHistoryItem[]>([]);
  const [incomingOffer, setIncomingOffer] = useState<{
    senderName: string;
    files: SharedFileItem[];
    totalBytes: number;
    accept: () => void;
    reject: () => void;
  } | null>(null);

  const engine = MobileTransferEngine.getInstance();

  useEffect(() => {
    // Load history
    MobileStorageService.getHistory().then((data) => {
      setRecentTransfers(data.slice(0, 5));
    });

    // Listen for incoming transfer requests
    engine.onIncomingOffer((offer, accept, reject) => {
      setIncomingOffer({
        ...offer,
        accept,
        reject,
      });
    });
  }, []);

  const handleAcceptIncoming = () => {
    if (incomingOffer) {
      incomingOffer.accept();
      setIncomingOffer(null);
      router.push('/transfer/active');
    }
  };

  const handleRejectIncoming = () => {
    if (incomingOffer) {
      incomingOffer.reject();
      setIncomingOffer(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View style={styles.brandRow}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoBadge}
              resizeMode="cover"
            />
            <View>
              <Text style={styles.brandTitle}>CloudShare</Text>
              <Text style={styles.brandSubtitle}>شارك ملفاتك بكل سهولة وبدون سحاب</Text>
            </View>
          </View>

          <View style={styles.privacyPill}>
            <ShieldCheck size={14} color="#7667C9" />
            <Text style={styles.privacyPillText}>محلي 100%</Text>
          </View>
        </View>

        {/* Hero Section with Lavender Gradient */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Zap size={13} color="#7667C9" />
            <Text style={styles.heroBadgeText}>نقل مباشر فائق السرعة</Text>
          </View>
          <Text style={styles.heroHeading}>شارك ملفاتك، بكل سهولة وبدون سحاب.</Text>
          <Text style={styles.heroDesc}>
            تبادل الصور والمستندات فورياً بين هاتفك والكمبيوتر أو الهواتف المجاورة بأعلى سرعة وأمان تام.
          </Text>
        </View>

        {/* Primary Actions Grid */}
        <Text style={styles.sectionTitle}>الإجراءات السريعة</Text>
        <View style={styles.grid}>
          {/* Send */}
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#FFFFFF' }]}
            activeOpacity={0.8}
            onPress={() => router.push('/send')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#EAE5FF' }]}>
              <Send size={24} color="#7667C9" style={{ transform: [{ rotate: '-45deg' }] }} />
            </View>
            <Text style={styles.actionTitle}>إرسال ملفات</Text>
            <Text style={styles.actionDesc}>صور ومستندات وفيديو لأجهزة قريبة</Text>
          </TouchableOpacity>

          {/* Receive */}
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#FFFFFF' }]}
            activeOpacity={0.8}
            onPress={() => router.push('/receive')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#DDF3E8' }]}>
              <Download size={24} color="#328768" />
            </View>
            <Text style={styles.actionTitle}>استلام ملفات</Text>
            <Text style={styles.actionDesc}>استقبال فوري عبر رمز QR أو PIN</Text>
          </TouchableOpacity>

          {/* Connect to PC */}
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#FFFFFF' }]}
            activeOpacity={0.8}
            onPress={() => router.push('/companion')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#DDEBFF' }]}>
              <Monitor size={24} color="#1E40AF" />
            </View>
            <Text style={styles.actionTitle}>ربط مع الكمبيوتر</Text>
            <Text style={styles.actionDesc}>تبادل مباشر مع متصفح الحاسوب</Text>
          </TouchableOpacity>

          {/* Share Link */}
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#FFFFFF' }]}
            activeOpacity={0.8}
            onPress={() => router.push('/links/create')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F9E7DB' }]}>
              <Link2 size={24} color="#D97706" />
            </View>
            <Text style={styles.actionTitle}>مشاركة عبر رابط</Text>
            <Text style={styles.actionDesc}>رابط سحابي مشفر ومؤقت عن بعد</Text>
          </TouchableOpacity>
        </View>

        {/* Nearby & Connected Devices */}
        <View style={styles.connectedCard}>
          <View style={styles.connectedHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.phoneIconWrap}>
                <Smartphone size={20} color="#7667C9" />
              </View>
              <View>
                <Text style={styles.connectedTitle}>هذا الجهاز: هاتف أندرويد</Text>
                <Text style={styles.connectedSubtitle}>جاهز للإرسال والاستقبال عبر Wi-Fi</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.scanBtn}
              onPress={() => router.push('/scan')}
            >
              <Text style={styles.scanBtnText}>مسح QR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transfers Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>العمليات الأخيرة</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/transfers')}>
            <Text style={styles.viewAllText}>عرض الكل</Text>
          </TouchableOpacity>
        </View>

        {recentTransfers.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>لا توجد عمليات نقل سابقة بعد.</Text>
            <Text style={styles.emptySubtext}>ابدأ بإرسال أو استلام أول ملف لك الآن!</Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {recentTransfers.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View
                    style={[
                      styles.directionIcon,
                      {
                        backgroundColor:
                          item.direction === 'outgoing' ? '#EAE5FF' : '#DDF3E8',
                      },
                    ]}
                  >
                    {item.direction === 'outgoing' ? (
                      <ArrowUpRight size={18} color="#7667C9" />
                    ) : (
                      <ArrowDownLeft size={18} color="#328768" />
                    )}
                  </View>
                  <View>
                    <Text style={styles.historyName} numberOfLines={1}>
                      {item.files[0]?.name || 'ملف'}
                    </Text>
                    <Text style={styles.historyDetails}>
                      {item.direction === 'outgoing' ? 'إرسال إلى' : 'استلام من'}:{' '}
                      {item.peerName} • {formatBytes(item.totalSize)}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-start' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={13} color="#328768" />
                    <Text style={styles.statusCompletedText}>مكتمل</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Incoming Transfer Request Modal */}
      {incomingOffer && (
        <Modal transparent animationType="fade" visible={!!incomingOffer}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalIconWrap}>
                <Smartphone size={32} color="#7667C9" />
              </View>
              <Text style={styles.modalTitle}>طلب استلام ملفات جديد</Text>
              <Text style={styles.modalSubtitle}>
                يرغب <Text style={{ fontWeight: '800' }}>{incomingOffer.senderName}</Text> في إرسال ملفات إليك
              </Text>

              <View style={styles.modalDetailsBox}>
                <Text style={styles.modalDetailText}>
                  عدد الملفات: {incomingOffer.files.length}
                </Text>
                <Text style={styles.modalDetailText}>
                  الحجم الإجمالي: {formatBytes(incomingOffer.totalBytes)}
                </Text>
              </View>

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#328768' }]}
                  onPress={handleAcceptIncoming}
                >
                  <Text style={styles.modalBtnTextWhite}>قبول واستلام</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#FEE2E2' }]}
                  onPress={handleRejectIncoming}
                >
                  <Text style={[styles.modalBtnText, { color: '#C45462' }]}>رفض</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7FC',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#7667C9',
    overflow: 'hidden',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#29283A',
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#77758B',
  },
  privacyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EAE5FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  privacyPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B4BB0',
  },
  heroCard: {
    borderRadius: 20,
    backgroundColor: '#EAE5FF',
    padding: 22,
    borderWidth: 1,
    borderColor: '#D8D1F7',
    marginBottom: 24,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginBottom: 10,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7667C9',
  },
  heroHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#29283A',
    marginBottom: 8,
    textAlign: 'right',
  },
  heroDesc: {
    fontSize: 13,
    color: '#77758B',
    lineHeight: 20,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#29283A',
    marginBottom: 14,
    textAlign: 'right',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: '48%',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E5F0',
    shadowColor: '#7667C9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#29283A',
    marginBottom: 4,
    textAlign: 'right',
  },
  actionDesc: {
    fontSize: 11,
    color: '#77758B',
    lineHeight: 16,
    textAlign: 'right',
  },
  connectedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E5F0',
    marginBottom: 24,
  },
  connectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phoneIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0EEFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#29283A',
    textAlign: 'right',
  },
  connectedSubtitle: {
    fontSize: 12,
    color: '#77758B',
    textAlign: 'right',
  },
  scanBtn: {
    backgroundColor: '#7667C9',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7667C9',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E5F0',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#29283A',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#77758B',
  },
  historyList: {
    gap: 10,
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E5F0',
  },
  directionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#29283A',
    maxWidth: 180,
    textAlign: 'right',
  },
  historyDetails: {
    fontSize: 11,
    color: '#77758B',
    marginTop: 2,
    textAlign: 'right',
  },
  statusCompletedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#328768',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(41, 40, 58, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#EAE5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#29283A',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#77758B',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalDetailsBox: {
    backgroundColor: '#F8F7FC',
    borderRadius: 14,
    padding: 14,
    width: '100%',
    marginBottom: 20,
    gap: 6,
  },
  modalDetailText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#29283A',
    textAlign: 'right',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalBtnTextWhite: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

