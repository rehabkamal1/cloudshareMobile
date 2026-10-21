import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import { ShieldCheck, Camera, HardDrive, Wifi, Trash2, Lock } from 'lucide-react-native';

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerCard}>
          <View style={styles.iconWrap}>
            <ShieldCheck size={32} color="#328768" />
          </View>
          <Text style={styles.title}>الخصوصية والأمان أولاً</Text>
          <Text style={styles.subtitle}>
            تطبيق CloudShare مبني من الأساس ليحمي خصوصية ملفاتك وبياناتك الشخصية دون أي تنازلات.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>الأذونات وكيفية استخدامها</Text>

        <View style={styles.permissionCard}>
          <View style={styles.permIcon}>
            <Camera size={22} color="#7667C9" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.permTitle}>إذن الكاميرا (Camera)</Text>
            <Text style={styles.permDesc}>
              يُطلب فقط عندما تضغط على "مسح رمز QR" للاقتران السريع بالحاسوب أو الهاتف. لا يتم التقاط أو تخزين أي صور أو تسجيلات فيديو على الإطلاق.
            </Text>
          </View>
        </View>

        <View style={styles.permissionCard}>
          <View style={[styles.permIcon, { backgroundColor: '#DDF3E8' }]}>
            <HardDrive size={22} color="#328768" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.permTitle}>إذن الملفات والمعرض (Media & Storage)</Text>
            <Text style={styles.permDesc}>
              لا نقوم بفحص معرضك أو قراءة ملفاتك في الخلفية أبداً. نصل فقط إلى الملفات التي تحددها بنفسك عبر نافذة النظام الرسمية لنقلها أو حفظ الملفات المستلمة.
            </Text>
          </View>
        </View>

        <View style={styles.permissionCard}>
          <View style={[styles.permIcon, { backgroundColor: '#DDEBFF' }]}>
            <Wifi size={22} color="#1E40AF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.permTitle}>إذن الشبكة المحلية (Local Network / Wi-Fi)</Text>
            <Text style={styles.permDesc}>
              يُستخدم لاكتشاف ونقل الملفات مباشرة بين الأجهزة المتصلة بنفس شبكة الواي فاي المنزلية، دون أن تمر ملفاتك بأي خادم خارجي.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>سياسة الروابط السحابية المؤقتة</Text>
        <View style={styles.infoCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Trash2 size={20} color="#C45462" />
            <Text style={styles.infoCardTitle}>الحذف التلقائي والفوري</Text>
          </View>
          <Text style={styles.infoCardDesc}>
            عند إنشاء رابط سحابي، تُحذف الملفات نهائياً من وحدة التخزين فور انتهاء الوقت المحدد أو عند قيامك بإلغاء الرابط يدوياً.
          </Text>
        </View>

        <View style={{ height: 40 }} />
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
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E5F0',
    marginBottom: 24,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#DDF3E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#29283A',
    marginBottom: 14,
    textAlign: 'right',
  },
  permissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    borderWidth: 1,
    borderColor: '#E8E5F0',
    marginBottom: 12,
  },
  permIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EAE5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#29283A',
    textAlign: 'right',
    marginBottom: 4,
  },
  permDesc: {
    fontSize: 12,
    color: '#77758B',
    lineHeight: 18,
    textAlign: 'right',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8E5F0',
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#29283A',
  },
  infoCardDesc: {
    fontSize: 12,
    color: '#77758B',
    lineHeight: 18,
    textAlign: 'right',
  },
});

