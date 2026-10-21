import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nManager, Platform } from 'react-native';

export default function RootLayout() {
  useEffect(() => {
    // Ensure RTL is enabled for Arabic layout
    if (!I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
  }, []);

  return (
    <>
      <StatusBar style="dark" backgroundColor="#F8F7FC" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#29283A',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          contentStyle: {
            backgroundColor: '#F8F7FC',
          },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="send/index" options={{ title: 'إرسال ملفات' }} />
        <Stack.Screen name="receive/index" options={{ title: 'استلام ملفات' }} />
        <Stack.Screen name="companion/index" options={{ title: 'الربط مع الكمبيوتر' }} />
        <Stack.Screen name="scan/index" options={{ title: 'مسح رمز QR' }} />
        <Stack.Screen name="transfer/[id]" options={{ title: 'حالة النقل', headerBackVisible: false }} />
        <Stack.Screen name="links/create" options={{ title: 'مشاركة عبر رابط مشفر' }} />
        <Stack.Screen name="privacy/index" options={{ title: 'الخصوصية والأذونات' }} />
        <Stack.Screen name="about/index" options={{ title: 'عن CloudShare' }} />
      </Stack>
    </>
  );
}

