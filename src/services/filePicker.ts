import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { SharedFileItem } from '@shareflow/shared';

export class FilePickerService {
  static async pickPhotosAndVideos(): Promise<SharedFileItem[]> {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (result.canceled || !result.assets) {
        return [];
      }

      return result.assets.map((asset, idx) => ({
        id: `media_${Date.now()}_${idx}`,
        name: asset.fileName || `media_${Date.now()}_${idx}.${asset.type === 'video' ? 'mp4' : 'jpg'}`,
        size: asset.fileSize || 0,
        mimeType: asset.mimeType || (asset.type === 'video' ? 'video/mp4' : 'image/jpeg'),
        uri: asset.uri,
      }));
    } catch (err) {
      console.error('[FilePicker] Error picking photos/videos:', err);
      return [];
    }
  }

  static async pickDocuments(): Promise<SharedFileItem[]> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets) {
        return [];
      }

      return result.assets.map((doc, idx) => ({
        id: `doc_${Date.now()}_${idx}`,
        name: doc.name,
        size: doc.size || 0,
        mimeType: doc.mimeType || 'application/octet-stream',
        uri: doc.uri,
      }));
    } catch (err) {
      console.error('[FilePicker] Error picking documents:', err);
      return [];
    }
  }
}

