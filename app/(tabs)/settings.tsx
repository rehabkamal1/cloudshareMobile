import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Smartphone,
  FolderDown,
  ShieldCheck,
  Info,
  Trash2,
  ChevronLeft,
  Check,
} from 'lucide-react-native';
import { MobileStorageService, AppPreferences } from '../../src/services/storage';

export default function SettingsScreen() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<AppPreferences>({
    deviceName: 'هاتف أندرويد (CloudShare)',
    autoSaveToGallery: true,
    savePath: 'Downloads',
  });
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    MobileStorageService.getPreferences().then((data) => {
      setPrefs(data);
      setTempName(data.deviceName);
    });
  }, []);

  const handleSaveName = async () => {
    if (tempName.trim()) {
      await MobileStorageService.updatePreferences({ deviceName: tempName.trim() });
      setPrefs((prev) => ({ ...prev, deviceName: tempName.trim() }));
      setEditingName(false);
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      'مسح سجل التحويلات',
      'هل أنت متأكد من مسح جميع بيانات سجل النقل المخزنة في جهازك؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'مسح',
          style: 'destructive',
          onPress: async () => {
            await MobileStorageService.clearHistory();
            Alert.alert('تم', 'تم مسح السجل بنجاح.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>الإعدادات والخصوصية</Text>

        {/* Device Name Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrap}>
              <Smartphone size={20} color="#7667C9" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>اسم هذا الجهاز</Text>
              <Text style={styles.cardSubtitle}>الاسم الذي يظهر للأجهزة الأخرى عند طلب الاقتران</Text>
            </View>
          </View>

          {editingName ? (
            <View style={styles.editRow}>
              <TextInput
                value={tempName}
                onChangeText={setTempName}
                style={styles.nameInput}
                autoFocus
              />
              <TouchableOpacity style={styles.saveNameBtn} onPress={handleSaveName}>
                <Check size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.nameDisplayRow}
              onPress={() => setEditingName(true)}
            >
              <Text style={styles.deviceNameText}>{prefs.deviceName}</Text>
              <Text style={styles.changeText}>تغيير</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Storage / Folder Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrap}>
              <FolderDown size={20} color="#7667C9" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>مجلد حفظ الملفات المستلمة</Text>
              <Text style={styles.cardSubtitle}>مجلد التنزيلات الرسمي (Downloads) على الهاتف</Text>
            </View>
          </View>
        </View>

        {/* Links to Privacy and About */}
        <Text style={styles.sectionTitle}>الأمان والمعلومات</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/privacy')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={[styles.iconWrap, { backgroundColor: '#DDF3E8' }]}>
                <ShieldCheck size={20} color="#328768" />
              </View>
              <View>
                <Text style={styles.menuTitle}>سياسة الخصوصية والأذونات</Text>
                <Text style={styles.menuSubtitle}>شرح كيفية حماية خصوصيتك والأذونات المطلوبة</Text>
              </View>
            </View>
            <ChevronLeft size={20} color="#77758B" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => router.push('/about')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={[styles.iconWrap, { backgroundColor: '#DDEBFF' }]}>
                <Info size={20} color="#1E40AF" />
              </View>
              <View>
                <Text style={styles.menuTitle}>عن تطبيق CloudShare</Text>
                <Text style={styles.menuSubtitle}>الإصدار 1.0.0 (نسخة الإنتاج المستقرة)</Text>
              </View>
            </View>
            <ChevronLeft size={20} color="#77758B" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <Text style={styles.sectionTitle}>إدارة البيانات</Text>
        <TouchableOpacity style={styles.dangerCard} onPress={handleClearHistory}>
          <Trash2 size={20} color="#C45462" />
          <Text style={styles.dangerText}>مسح سجل التحويلات بالكامل</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7FC',
    paddingTop: Platform.OS === 'android' ? 32 : 0,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#29283A',
    marginBottom: 20,
    textAlign: 'right',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8E5F0',
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EAE5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#29283A',
    textAlign: 'right',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#77758B',
    textAlign: 'right',
  },
  nameDisplayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F7FC',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
  },
  deviceNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#29283A',
  },
  changeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7667C9',
  },
  editRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  nameInput: {
    flex: 1,
    backgroundColor: '#F8F7FC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: '#29283A',
    borderWidth: 1,
    borderColor: '#7667C9',
  },
  saveNameBtn: {
    backgroundColor: '#7667C9',
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#29283A',
    marginBottom: 12,
    textAlign: 'right',
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#29283A',
    textAlign: 'right',
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#77758B',
    marginTop: 2,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0EEFA',
    marginVertical: 12,
  },
  dangerCard: {
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  dangerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C45462',
  },
});

