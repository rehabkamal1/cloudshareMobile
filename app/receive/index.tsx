import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { MobileTransferEngine } from '../../src/services/transferEngine';
import { Download, Wifi, Smartphone, CheckCircle2 } from 'lucide-react-native';
import { QRPairingPayload } from '@shareflow/shared';

export default function ReceiveFilesScreen() {
  const engine = MobileTransferEngine.getInstance();
  const details = engine.getMyDetails();
  const pairedDevice = engine.getPairedDevice();

  const qrPayload: QRPairingPayload = {
    v: '1.0',
    type: 'cloudshare_pair',
    id: details.id,
    name: details.name,
    deviceType: 'android',
    pin: details.pin,
    wsUrl: engine.getHubUrl(),
    token: details.id,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.headerIconWrap}>
            <Download size={28} color="#328768" />
          </View>
          <Text style={styles.title}>جاهز لاستقبال الملفات</Text>
          <Text style={styles.subtitle}>
            امسح رمز الـ QR من الجهاز المرسل أو اكتب رمز PIN أدناه لبدء الاستلام المباشر.
          </Text>

          {pairedDevice ? (
            <View style={styles.pairedBanner}>
              <CheckCircle2 size={22} color="#328768" />
              <View style={{ flex: 1 }}>
                <Text style={styles.pairedTitle}>متصل بـ: {pairedDevice.name}</Text>
                <Text style={styles.pairedSub}>أنت جاهز لاستقبال أي ملف يتم إرساله إليك الآن.</Text>
              </View>
            </View>
          ) : (
            <View style={styles.qrContainer}>
              <View style={styles.qrBox}>
                <QRCode
                  value={JSON.stringify(qrPayload)}
                  size={200}
                  color="#29283A"
                  backgroundColor="#FFFFFF"
                />
              </View>

              <Text style={styles.pinLabel}>رمز التحقق السريع (PIN):</Text>
              <View style={styles.pinBox}>
                <Text style={styles.pinValue}>{details.pin}</Text>
              </View>
            </View>
          )}

          <View style={styles.statusPill}>
            <Wifi size={16} color="#7667C9" />
            <Text style={styles.statusPillText}>متصل بنفس شبكة الواي فاي المحلية</Text>
          </View>
        </View>

        {/* Steps guide */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>كيف يعمل الاستقبال؟</Text>
          <Text style={styles.stepItem}>١. تأكد من اتصال الجهازين بنفس شبكة الواي فاي المنزلية.</Text>
          <Text style={styles.stepItem}>٢. في الجهاز الآخر، اضغط إرسال واختر هذا الهاتف أو امسح الرمز.</Text>
          <Text style={styles.stepItem}>٣. ستظهر لك نافذة تأكيد للموافقة قبل بدء تنزيل الملفات.</Text>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E5F0',
    marginBottom: 20,
    shadowColor: '#7667C9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  headerIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#DDF3E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#29283A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#77758B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  pairedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#DDF3E8',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 20,
  },
  pairedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#328768',
    textAlign: 'right',
  },
  pairedSub: {
    fontSize: 12,
    color: '#328768',
    marginTop: 2,
    textAlign: 'right',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrBox: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#EAE5FF',
    marginBottom: 18,
  },
  pinLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#77758B',
    marginBottom: 8,
  },
  pinBox: {
    backgroundColor: '#F0EEFA',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  pinValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#5B4BB0',
    letterSpacing: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EAE5FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B4BB0',
  },
  stepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E5F0',
  },
  stepsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#29283A',
    marginBottom: 10,
    textAlign: 'right',
  },
  stepItem: {
    fontSize: 13,
    color: '#77758B',
    lineHeight: 22,
    textAlign: 'right',
  },
});

