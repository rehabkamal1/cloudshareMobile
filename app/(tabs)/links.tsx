import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Link2, Plus, Clock, Lock, ShieldAlert, Share2, Copy, Check } from 'lucide-react-native';

export default function LinksScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>المشاركة عبر الروابط</Text>
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => router.push('/links/create')}
          >
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.createBtnText}>رابط جديد</Text>
          </TouchableOpacity>
        </View>

        {/* Info & Quota Card */}
        <View style={styles.quotaCard}>
          <View style={styles.quotaHeader}>
            <View style={styles.quotaIconWrap}>
              <Link2 size={22} color="#7667C9" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.quotaTitle}>روابط سحابية مؤقتة ومشفرة</Text>
              <Text style={styles.quotaSubtitle}>
                تتيح لك إرسال ملفات لأي شخص في العالم عبر رابط ينتهي تلقائياً بعد الوقت المحدد.
              </Text>
            </View>
          </View>

          <View style={styles.quotaStatsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>أقصى حجم للملف</Text>
              <Text style={styles.statValue}>500 م.بايت</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>الحصة اليومية</Text>
              <Text style={styles.statValue}>2 ج.بايت</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>التشفير</Text>
              <Text style={styles.statValue}>TLS / HTTPS</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>مزايا الروابط السحابية</Text>
        <View style={styles.featureCard}>
          <View style={styles.featureItem}>
            <Clock size={20} color="#7667C9" />
            <View style={{ flex: 1 }}>
              <Text style={styles.featureItemTitle}>حذف تلقائي بعد انتهاء الصلاحية</Text>
              <Text style={styles.featureItemDesc}>
                يتم مسح الملفات نهائياً من الخادم بعد (15 دقيقة، ساعة، 24 ساعة، أو 3 أيام).
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.featureItem}>
            <Lock size={20} color="#7667C9" />
            <View style={{ flex: 1 }}>
              <Text style={styles.featureItemTitle}>حماية بكلمة مرور خاصة</Text>
              <Text style={styles.featureItemDesc}>
                يمكنك قفل أي رابط برقم سري لا يستطيع أي شخص تحميل الملفات بدونه.
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.featureItem}>
            <ShieldAlert size={20} color="#7667C9" />
            <View style={{ flex: 1 }}>
              <Text style={styles.featureItemTitle}>إمكانية الإلغاء الفوري في أي لحظة</Text>
              <Text style={styles.featureItemDesc}>
                يمكنك حذف الرابط وإلغاء صلاحيته يدوياً قبل موعد انتهائه بنقرة واحدة.
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bigActionBtn}
          onPress={() => router.push('/links/create')}
        >
          <Text style={styles.bigActionBtnText}>إنشاء رابط مشاركة مشفر الآن</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#29283A',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#7667C9',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  quotaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8E5F0',
    marginBottom: 24,
  },
  quotaHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 18,
  },
  quotaIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EAE5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quotaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#29283A',
    textAlign: 'right',
    marginBottom: 4,
  },
  quotaSubtitle: {
    fontSize: 12,
    color: '#77758B',
    lineHeight: 18,
    textAlign: 'right',
  },
  quotaStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0EEFA',
    paddingTop: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8F7FC',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#77758B',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B4BB0',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#29283A',
    marginBottom: 14,
    textAlign: 'right',
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8E5F0',
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
  featureItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#29283A',
    marginBottom: 2,
    textAlign: 'right',
  },
  featureItemDesc: {
    fontSize: 12,
    color: '#77758B',
    lineHeight: 18,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0EEFA',
    marginVertical: 8,
  },
  bigActionBtn: {
    backgroundColor: '#7667C9',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#7667C9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 4,
  },
  bigActionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

