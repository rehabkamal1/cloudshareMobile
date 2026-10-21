import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Image as ImageIcon,
  FileText,
  Trash2,
  Send,
  Smartphone,
  CheckCircle2,
  Plus,
} from 'lucide-react-native';
import { FilePickerService } from '../../src/services/filePicker';
import { MobileTransferEngine } from '../../src/services/transferEngine';
import { SharedFileItem, formatBytes } from '@shareflow/shared';

export default function SendFilesScreen() {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<SharedFileItem[]>([]);
  const [targetPin, setTargetPin] = useState('');
  const engine = MobileTransferEngine.getInstance();
  const pairedDevice = engine.getPairedDevice();

  const handlePickMedia = async () => {
    const files = await FilePickerService.pickPhotosAndVideos();
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const handlePickDocs = async () => {
    const files = await FilePickerService.pickDocuments();
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const totalBytes = selectedFiles.reduce((acc, f) => acc + (f.size || 0), 0);

  const handlePairPin = () => {
    if (targetPin.trim().length >= 4) {
      try {
        engine.pairWithPin(targetPin.trim());
        Alert.alert('جاري الاقتران', 'تم إرسال طلب الاقتران، يرجى الموافقة على الجهاز الآخر.');
      } catch (err: any) {
        Alert.alert('خطأ', err.message);
      }
    }
  };

  const handleStartSend = async () => {
    if (selectedFiles.length === 0) {
      Alert.alert('تنبيه', 'يرجى اختيار ملف واحد على الأقل للإرسال');
      return;
    }

    try {
      await engine.sendFiles(selectedFiles);
      router.push('/transfer/active');
    } catch (err: any) {
      Alert.alert('تعذر بدء النقل', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Pairing Bar */}
        <View style={styles.pairCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={[
                styles.pairIconWrap,
                { backgroundColor: pairedDevice ? '#DDF3E8' : '#EAE5FF' },
              ]}
            >
              <Smartphone size={20} color={pairedDevice ? '#328768' : '#7667C9'} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pairTitle}>
                {pairedDevice ? `متصل بـ: ${pairedDevice.name}` : 'غير مقترن بجهاز'}
              </Text>
              <Text style={styles.pairSubtitle}>
                {pairedDevice
                  ? 'جاهز للإرسال بأقصى سرعة'
                  : 'أدخل رمز PIN الظاهر على شاشة الكمبيوتر أو الهاتف الآخر'}
              </Text>
            </View>
          </View>

          {!pairedDevice && (
            <View style={styles.pinRow}>
              <TextInput
                placeholder="رمز PIN (مثال: 481920)"
                value={targetPin}
                onChangeText={setTargetPin}
                style={styles.pinInput}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.pairBtn} onPress={handlePairPin}>
                <Text style={styles.pairBtnText}>اقتران</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Categories Selection */}
        <Text style={styles.sectionTitle}>اختر نوع الملفات</Text>
        <View style={styles.categoriesRow}>
          <TouchableOpacity style={styles.catCard} onPress={handlePickMedia}>
            <View style={[styles.catIconWrap, { backgroundColor: '#EAE5FF' }]}>
              <ImageIcon size={26} color="#7667C9" />
            </View>
            <Text style={styles.catTitle}>الصور والفيديوهات</Text>
            <Text style={styles.catDesc}>معرض الهاتف</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.catCard} onPress={handlePickDocs}>
            <View style={[styles.catIconWrap, { backgroundColor: '#DDEBFF' }]}>
              <FileText size={26} color="#1E40AF" />
            </View>
            <Text style={styles.catTitle}>المستندات والملفات</Text>
            <Text style={styles.catDesc}>PDF، Word، مضغوطة</Text>
          </TouchableOpacity>
        </View>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <View style={styles.selectedSection}>
            <View style={styles.selectedHeader}>
              <Text style={styles.sectionTitle}>الملفات المحددة ({selectedFiles.length})</Text>
              <Text style={styles.totalSizeText}>الإجمالي: {formatBytes(totalBytes)}</Text>
            </View>

            <View style={styles.filesList}>
              {selectedFiles.map((file) => (
                <View key={file.id} style={styles.fileRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    <FileText size={18} color="#7667C9" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.fileNameText} numberOfLines={1}>
                        {file.name}
                      </Text>
                      <Text style={styles.fileSizeText}>{formatBytes(file.size)}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => removeFile(file.id)}
                    style={styles.removeBtn}
                  >
                    <Trash2 size={16} color="#C45462" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Send Action Button */}
            <TouchableOpacity
              style={styles.sendActionBtn}
              onPress={handleStartSend}
            >
              <Send size={18} color="#FFFFFF" style={{ transform: [{ rotate: '-45deg' }] }} />
              <Text style={styles.sendActionBtnText}>إرسال الملفات الآن</Text>
            </TouchableOpacity>
          </View>
        )}

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
  pairCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E5F0',
    marginBottom: 20,
  },
  pairIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pairTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#29283A',
    textAlign: 'right',
  },
  pairSubtitle: {
    fontSize: 11,
    color: '#77758B',
    textAlign: 'right',
  },
  pinRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  pinInput: {
    flex: 1,
    backgroundColor: '#F8F7FC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: '#29283A',
    borderWidth: 1,
    borderColor: '#E8E5F0',
    textAlign: 'center',
  },
  pairBtn: {
    backgroundColor: '#7667C9',
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pairBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#29283A',
    marginBottom: 12,
    textAlign: 'right',
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  catCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8E5F0',
    alignItems: 'center',
  },
  catIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  catTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#29283A',
    marginBottom: 4,
    textAlign: 'center',
  },
  catDesc: {
    fontSize: 11,
    color: '#77758B',
    textAlign: 'center',
  },
  selectedSection: {
    marginTop: 8,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalSizeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B4BB0',
  },
  filesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E5F0',
    padding: 8,
    marginBottom: 20,
    maxHeight: 240,
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
  fileSizeText: {
    fontSize: 11,
    color: '#77758B',
    textAlign: 'right',
  },
  removeBtn: {
    padding: 6,
  },
  sendActionBtn: {
    backgroundColor: '#7667C9',
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#7667C9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 4,
  },
  sendActionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

