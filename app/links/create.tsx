import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Share,
  Alert,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {
  Link2,
  Clock,
  Lock,
  Upload,
  Copy,
  Share2,
  Check,
  Trash2,
  FileText,
} from 'lucide-react-native';
import { FilePickerService } from '../../src/services/filePicker';
import { SharedFileItem, formatBytes } from '@shareflow/shared';

export default function CreateShareLinkScreen() {
  const [files, setFiles] = useState<SharedFileItem[]>([]);
  const [expiry, setExpiry] = useState<number>(60);
  const [password, setPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const handlePickFiles = async () => {
    const picked = await FilePickerService.pickDocuments();
    if (picked.length > 0) {
      setFiles((prev) => [...prev, ...picked]);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0);

  const handleUploadAndCreate = async () => {
    if (files.length === 0) {
      Alert.alert('تنبيه', 'يرجى اختيار ملف واحد على الأقل للرفع');
      return;
    }

    try {
      setIsUploading(true);

      // Simulate API call to backend /api/shares or real call
      const dummyToken = Math.random().toString(36).substring(2, 10);
      const shareUrl = `https://cloudshare.app/#download/${dummyToken}`;

      setTimeout(() => {
        setIsUploading(false);
        setGeneratedLink(shareUrl);
      }, 1500);
    } catch (err: any) {
      setIsUploading(false);
      Alert.alert('خطأ', err.message);
    }
  };

  const handleNativeShare = async () => {
    if (generatedLink) {
      await Share.share({
        message: `حمل الملفات بأمان عبر CloudShare:\n${generatedLink}`,
        url: generatedLink,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {generatedLink ? (
          <View style={styles.card}>
            <View style={styles.successBadge}>
              <Check size={32} color="#328768" />
            </View>
            <Text style={styles.cardTitle}>رابط المشاركة جاهز!</Text>
            <Text style={styles.cardSubtitle}>
              تم تجهيز الرابط المشفر بنجاح. يمكن لأي شخص فتحه لتحميل الملفات قبل انتهاء الوقت.
            </Text>

            <View style={styles.qrBox}>
              <QRCode value={generatedLink} size={180} color="#29283A" backgroundColor="#FFFFFF" />
            </View>

            <View style={styles.linkDisplayBox}>
              <Text style={styles.linkText} numberOfLines={1}>
                {generatedLink}
              </Text>
            </View>

            <View style={styles.buttonStack}>
              <TouchableOpacity style={styles.primaryBtn} onPress={handleNativeShare}>
                <Share2 size={18} color="#FFFFFF" />
                <Text style={styles.primaryBtnText}>مشاركة عبر التطبيقات</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => {
                  setGeneratedLink(null);
                  setFiles([]);
                }}
              >
                <Text style={styles.secondaryBtnText}>إنشاء رابط جديد</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {/* Pick Button */}
            <TouchableOpacity style={styles.pickCard} onPress={handlePickFiles}>
              <View style={styles.uploadIconWrap}>
                <Upload size={28} color="#7667C9" />
              </View>
              <Text style={styles.pickTitle}>اضغط لاختيار الملفات للرفع</Text>
              <Text style={styles.pickSubtitle}>
                مستندات، صور، فيديوهات • حد أقصى 500 م.بايت
              </Text>
            </TouchableOpacity>

            {/* Selected Files */}
            {files.length > 0 && (
              <View style={styles.filesSection}>
                <Text style={styles.sectionTitle}>
                  الملفات المحددة ({files.length}) — {formatBytes(totalSize)}
                </Text>
                <View style={styles.filesBox}>
                  {files.map((file) => (
                    <View key={file.id} style={styles.fileRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                        <FileText size={18} color="#7667C9" />
                        <Text style={styles.fileNameText} numberOfLines={1}>
                          {file.name}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => removeFile(file.id)}>
                        <Trash2 size={16} color="#C45462" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Config Options */}
            <View style={styles.optionsCard}>
              <Text style={styles.optionHeader}>
                <Clock size={16} color="#7667C9" /> مدة صلاحية الرابط:
              </Text>
              <View style={styles.expiryRow}>
                {[
                  { label: '15 د', val: 15 },
                  { label: 'ساعة', val: 60 },
                  { label: '24 ساعة', val: 1440 },
                  { label: '3 أيام', val: 4320 },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.val}
                    style={[
                      styles.expiryPill,
                      expiry === item.val && styles.expiryPillActive,
                    ]}
                    onPress={() => setExpiry(item.val)}
                  >
                    <Text
                      style={[
                        styles.expiryPillText,
                        expiry === item.val && styles.expiryPillTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.optionHeader, { marginTop: 16 }]}>
                <Lock size={16} color="#7667C9" /> حماية بكلمة مرور (اختياري):
              </Text>
              <TextInput
                placeholder="اتركها فارغة لتحميل مباشر بدون قفل"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.passwordInput}
              />
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.primaryBtn, { opacity: files.length > 0 && !isUploading ? 1 : 0.6 }]}
              onPress={handleUploadAndCreate}
              disabled={files.length === 0 || isUploading}
            >
              <Text style={styles.primaryBtnText}>
                {isUploading ? 'جاري الرفع والمعالجة...' : 'توليد الرابط الآمن الآن'}
              </Text>
            </TouchableOpacity>
          </>
        )}
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
  pickCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D8D1F7',
    marginBottom: 20,
  },
  uploadIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#EAE5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  pickTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#29283A',
    marginBottom: 4,
  },
  pickSubtitle: {
    fontSize: 12,
    color: '#77758B',
  },
  filesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#29283A',
    marginBottom: 10,
    textAlign: 'right',
  },
  filesBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E5F0',
    padding: 6,
  },
  fileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEFA',
  },
  fileNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#29283A',
    textAlign: 'right',
  },
  optionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8E5F0',
    marginBottom: 24,
  },
  optionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#29283A',
    marginBottom: 10,
    textAlign: 'right',
  },
  expiryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  expiryPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F8F7FC',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E5F0',
  },
  expiryPillActive: {
    backgroundColor: '#7667C9',
    borderColor: '#7667C9',
  },
  expiryPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#77758B',
  },
  expiryPillTextActive: {
    color: '#FFFFFF',
  },
  passwordInput: {
    backgroundColor: '#F8F7FC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E8E5F0',
    textAlign: 'right',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E5F0',
  },
  successBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#DDF3E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#29283A',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#77758B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  qrBox: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E5F0',
    marginBottom: 16,
  },
  linkDisplayBox: {
    backgroundColor: '#F8F7FC',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
  },
  linkText: {
    fontSize: 13,
    color: '#5B4BB0',
    fontWeight: '700',
    textAlign: 'center',
  },
  buttonStack: {
    width: '100%',
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: '#7667C9',
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: '#F0EEFA',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#5B4BB0',
    fontSize: 14,
    fontWeight: '700',
  },
});

