import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform, Image } from 'react-native';
import { Heart, Code2, Sparkles, ExternalLink } from 'lucide-react-native';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoBadge}
            resizeMode="cover"
          />
          <Text style={styles.appName}>CloudShare</Text>
          <Text style={styles.version}>الإصدار 1.0.0 (نسخة الإنتاج الرسمية)</Text>

          <View style={styles.badgeRow}>
            <View style={styles.pill}>
              <Sparkles size={14} color="#7667C9" />
              <Text style={styles.pillText}>بدون إعلانات مزعجة</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: '#DDF3E8' }]}>
              <Text style={[styles.pillText, { color: '#328768' }]}>نقل محلي فائق السرعة</Text>
            </View>
          </View>

          <Text style={styles.description}>
            تم تصميم وتطوير تطبيق CloudShare ليكون البديل العصري، الهادئ، والأكثر أماناً لمشاركة الملفات بين أجهزة أندرويد والكمبيوتر، مع احترام كامل لخصوصية المستخدم وخلو تام من الإعلانات المزعجة أو الأذونات غير الضرورية.
          </Text>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>فريق التطوير:</Text>
            <Text style={styles.infoVal}>فريق CloudShare الهندسي</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>التقنيات المستخدمة:</Text>
            <Text style={styles.infoVal}>React Native • Expo • TypeScript • WebRTC</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>الترخيص:</Text>
            <Text style={styles.infoVal}>MIT License — مفتوح ومحمي</Text>
          </View>
        </View>

        <View style={styles.footerNote}>
          <Heart size={16} color="#C45462" />
          <Text style={styles.footerText}>صُنع بكل فخر باللغة العربية لدعم وتسهيل تجربة المستخدم العربي</Text>
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
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E5F0',
    width: '100%',
    marginBottom: 20,
  },
  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 26,
    backgroundColor: '#7667C9',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#7667C9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#29283A',
    marginBottom: 4,
  },
  version: {
    fontSize: 13,
    color: '#77758B',
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EAE5FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B4BB0',
  },
  description: {
    fontSize: 13,
    color: '#77758B',
    textAlign: 'center',
    lineHeight: 22,
  },
  infoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8E5F0',
    width: '100%',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#77758B',
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#29283A',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0EEFA',
    marginVertical: 6,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#77758B',
    textAlign: 'center',
  },
});

