import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Camera, X, Check, Shield } from 'lucide-react-native';
import { MobileTransferEngine } from '../../src/services/transferEngine';
import { QRPairingPayload } from '@shareflow/shared';

export default function QRScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const engine = MobileTransferEngine.getInstance();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const payload: QRPairingPayload = JSON.parse(data);
      if ((payload.type === 'cloudshare_pair' || payload.type === 'shareflow_pair') && payload.pin) {
        if (payload.wsUrl) {
          engine.setHubUrl(payload.wsUrl);
        }
        await engine.pairWithPin(payload.pin);
        Alert.alert(
          'تم المسح بنجاح!',
          `تم التعرف على الجهاز (${payload.name}). جاري إتمام الاقتران...`,
          [{ text: 'حسناً', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('تنبيه', 'رمز الـ QR غير متوافق مع تطبيق CloudShare', [
          { text: 'حسناً', onPress: () => setScanned(false) },
        ]);
      }
    } catch (err: any) {
      Alert.alert('خطأ في الاقتران', err?.message || 'تعذر إتمام الاقتران بالرمز', [
        { text: 'إعادة المحاولة', onPress: () => setScanned(false) },
      ]);
    }
  };

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <Camera size={48} color="#7667C9" style={{ marginBottom: 16 }} />
          <Text style={styles.permissionTitle}>إذن الكاميرا مطلوب لمسح الرمز</Text>
          <Text style={styles.permissionDesc}>
            يستخدم CloudShare الكاميرا فقط لمسح رمز الـ QR للاقتران السريع بالأجهزة دون حفظ أي صور.
          </Text>
          <TouchableOpacity style={styles.grantBtn} onPress={requestPermission}>
            <Text style={styles.grantBtnText}>منح إذن الكاميرا</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <SafeAreaView style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.topTitle}>مسح كود الاقتران</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.scannerFrameContainer}>
            <View style={styles.scannerTarget}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
            <Text style={styles.hintText}>وجّه الكاميرا نحو رمز QR الظاهر على الشاشة الأخرى</Text>
          </View>

          <View style={styles.bottomBar}>
            <View style={styles.privacyBadge}>
              <Shield size={16} color="#FFFFFF" />
              <Text style={styles.privacyBadgeText}>تشفير محلي مباشر • أمان تام</Text>
            </View>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  scannerFrameContainer: {
    alignItems: 'center',
  },
  scannerTarget: {
    width: 250,
    height: 250,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#7667C9',
  },
  cornerTL: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 16 },
  cornerTR: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 16 },
  cornerBL: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 16 },
  cornerBR: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 16 },
  hintText: {
    color: '#FFFFFF',
    fontSize: 13,
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  bottomBar: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(118, 103, 201, 0.8)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  privacyBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#F8F7FC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E5F0',
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#29283A',
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionDesc: {
    fontSize: 13,
    color: '#77758B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  grantBtn: {
    backgroundColor: '#7667C9',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
  },
  grantBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

