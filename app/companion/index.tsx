import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Monitor, QrCode, KeyRound, CheckCircle2, Wifi, WifiOff, Settings2, Check } from 'lucide-react-native';
import { MobileTransferEngine } from '../../src/services/transferEngine';

export default function CompanionScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const engine = MobileTransferEngine.getInstance();
  const [hubConnected, setHubConnected] = useState(engine.isHubConnected());
  const [hubUrl, setHubUrlState] = useState(engine.getHubUrl());
  const [showServerModal, setShowServerModal] = useState(false);
  const [customIp, setCustomIp] = useState('');
  const pairedDevice = engine.getPairedDevice();

  useEffect(() => {
    const unsub = engine.onConnectionStatusChange((connected) => {
      setHubConnected(connected);
      setHubUrlState(engine.getHubUrl());
    });
    return unsub;
  }, []);

  const handlePair = async () => {
    if (pin.trim().length >= 4) {
      setIsConnecting(true);
      try {
        await engine.pairWithPin(pin.trim());
        Alert.alert('جاري الاتصال', 'تم إرسال طلب الربط مع متصفح الكمبيوتر، يرجى الموافقة على شاشة اللابتوب.');
      } catch (err: any) {
        Alert.alert('تنبيه الاقتران', err.message);
      } finally {
        setIsConnecting(false);
      }
    }
  };

  const handleSaveServerIp = () => {
    if (customIp.trim()) {
      engine.setHubUrl(customIp.trim());
      setShowServerModal(false);
      Alert.alert('تم حفظ العنوان', 'جاري فحص الاتصال بالعنوان الجديد...');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          <View style={styles.iconWrap}>
            <Monitor size={32} color="#1E40AF" />
          </View>
          <Text style={styles.heroTitle}>الربط المباشر مع الكمبيوتر</Text>
          <Text style={styles.heroSubtitle}>
            افتح متصفح الكمبيوتر وانتقل إلى موقع CloudShare لتبادل الملفات بأقصى سرعة وبدون كابل USB.
          </Text>
        </View>

        {/* Hub Connection Status Card */}
        <View style={styles.hubStatusCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: hubConnected ? '#328768' : '#DC2626' },
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.hubStatusTitle}>
                {hubConnected ? 'خادم الإشارات متصل 🟢' : 'خادم الإشارات غير متصل 🔴'}
              </Text>
              <Text style={styles.hubStatusSub} numberOfLines={1}>
                {hubUrl}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editHubBtn}
            onPress={() => setShowServerModal(!showServerModal)}
          >
            <Settings2 size={16} color="#7667C9" />
            <Text style={styles.editHubBtnText}>
              {showServerModal ? 'إغلاق' : 'تعديل IP'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Server IP Edit Drawer */}
        {showServerModal && (
          <View style={styles.serverConfigCard}>
            <Text style={styles.serverConfigTitle}>عنوان IP اللابتوب في الشبكة:</Text>
            <Text style={styles.serverConfigDesc}>
              اكتب عنوان IP اللابتوب الظاهر في سطر الأوامر بعد تشغيل (npm run dev:api):
            </Text>
            <View style={styles.serverInputRow}>
              <TextInput
                placeholder="مثال: 192.168.1.15"
                value={customIp}
                onChangeText={setCustomIp}
                keyboardType="numbers-and-punctuation"
                style={styles.serverInput}
                autoFocus
              />
              <TouchableOpacity style={styles.saveServerBtn} onPress={handleSaveServerIp}>
                <Check size={18} color="#FFFFFF" />
                <Text style={styles.saveServerBtnText}>تطبيق</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {pairedDevice ? (
          <View style={styles.successCard}>
            <CheckCircle2 size={32} color="#328768" style={{ marginBottom: 12 }} />
            <Text style={styles.successTitle}>متصل بالكمبيوتر بنجاح!</Text>
            <Text style={styles.successDesc}>
              أنت الآن مقترن بـ ({pairedDevice.name}). يمكنك إرسال واستلام أي ملفات فوراً.
            </Text>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push('/send')}
            >
              <Text style={styles.actionBtnText}>إرسال ملفات إلى الكمبيوتر الآن</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.methodsSection}>
            {/* Method 1: Scan QR */}
            <TouchableOpacity
              style={styles.methodCard}
              onPress={() => router.push('/scan')}
            >
              <View style={[styles.methodIcon, { backgroundColor: '#EAE5FF' }]}>
                <QrCode size={26} color="#7667C9" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.methodTitle}>مسح رمز الـ QR من شاشة الكمبيوتر</Text>
                <Text style={styles.methodDesc}>الطريقة الأسرع: وجّه كاميرا الهاتف نحو شاشة الحاسوب</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>أو</Text>
              <View style={styles.orLine} />
            </View>

            {/* Method 2: Enter PIN */}
            <View style={styles.pinCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <View style={[styles.methodIcon, { backgroundColor: '#DDEBFF' }]}>
                  <KeyRound size={24} color="#1E40AF" />
                </View>
                <View>
                  <Text style={styles.methodTitle}>كتابة رمز PIN يدوياً</Text>
                  <Text style={styles.methodDesc}>اكتب الرمز المكون من 6 أرقام الظاهر على شاشة المتصفح</Text>
                </View>
              </View>

              <View style={styles.pinInputRow}>
                <TextInput
                  placeholder="مثال: 582910"
                  value={pin}
                  onChangeText={setPin}
                  keyboardType="numeric"
                  style={styles.pinInput}
                  maxLength={6}
                />
                <TouchableOpacity
                  style={[
                    styles.pinSubmitBtn,
                    { opacity: pin.trim().length >= 4 && !isConnecting ? 1 : 0.6 },
                  ]}
                  onPress={handlePair}
                  disabled={pin.trim().length < 4 || isConnecting}
                >
                  {isConnecting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.pinSubmitBtnText}>تأكيد الربط</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>خطوات الاستخدام السريع:</Text>
          <Text style={styles.instructionStep}>١. افتح المتصفح على حاسوبك وتأكد من اتصالك بنفس شبكة Wi-Fi.</Text>
          <Text style={styles.instructionStep}>٢. اختر "استلام من الهاتف" على شاشة الحاسوب لعرض الرمز.</Text>
          <Text style={styles.instructionStep}>٣. امسح الرمز بواسطة هذا الهاتف أو اكتب كود الـ PIN أعلاه.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7FC',
  },
  container: {
    padding: 20,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E5F0',
    marginBottom: 20,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#DDEBFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#29283A',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#77758B',
    textAlign: 'center',
    lineHeight: 20,
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDF3E8',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#328768',
    marginBottom: 6,
  },
  successDesc: {
    fontSize: 13,
    color: '#77758B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  actionBtn: {
    backgroundColor: '#7667C9',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  methodsSection: {
    marginBottom: 20,
  },
  methodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#E8E5F0',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#29283A',
    textAlign: 'right',
  },
  methodDesc: {
    fontSize: 11,
    color: '#77758B',
    marginTop: 2,
    textAlign: 'right',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 12,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E5F0',
  },
  orText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#77758B',
  },
  pinCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E5F0',
  },
  pinInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  pinInput: {
    flex: 1,
    backgroundColor: '#F8F7FC',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#29283A',
    borderWidth: 1,
    borderColor: '#E8E5F0',
    textAlign: 'center',
    letterSpacing: 2,
  },
  pinSubmitBtn: {
    backgroundColor: '#7667C9',
    paddingHorizontal: 20,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  instructionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E5F0',
  },
  instructionsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#29283A',
    marginBottom: 8,
    textAlign: 'right',
  },
  instructionStep: {
    fontSize: 12,
    color: '#77758B',
    lineHeight: 20,
    textAlign: 'right',
  },
  hubStatusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E8E5F0',
    marginBottom: 16,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  hubStatusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#29283A',
  },
  hubStatusSub: {
    fontSize: 11,
    color: '#77758B',
    marginTop: 2,
    textAlign: 'right',
  },
  editHubBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F3F0FF',
  },
  editHubBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7667C9',
  },
  serverConfigCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D4CEFF',
    marginBottom: 16,
  },
  serverConfigTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#29283A',
    marginBottom: 4,
    textAlign: 'right',
  },
  serverConfigDesc: {
    fontSize: 11,
    color: '#77758B',
    lineHeight: 16,
    marginBottom: 10,
    textAlign: 'right',
  },
  serverInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  serverInput: {
    flex: 1,
    backgroundColor: '#F8F7FC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E8E5F0',
    fontSize: 14,
    color: '#29283A',
    textAlign: 'center',
  },
  saveServerBtn: {
    backgroundColor: '#7667C9',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
  },
  saveServerBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});

