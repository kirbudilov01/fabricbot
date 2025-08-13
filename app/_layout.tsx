import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Platform, LogBox } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { setToastCallback } from '@/src/shared/lib/store';
import ToastMessage from '@/components/ToastMessage';
import OnboardingFlow from '@/components/OnboardingFlow';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ====== НАСТРОЙКИ API ======
const API = 'https://fabricbot-backend1.vercel.app';

// Silence logs in production
if (Platform.OS === 'web' && process.env.NODE_ENV === 'production') {
  LogBox.ignoreAllLogs(true);
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.info = () => {};
  console.debug = () => {};
}

// Telegram WebApp interface
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        initData?: string; // <- важно
      };
    };
  }
}

export default function RootLayout() {
  useFrameworkReady();

  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
    visible: boolean;
  }>({
    message: '',
    type: 'success',
    visible: false,
  });

  // === вспомогательный показ тостов
  const showError = (msg: string) =>
    setToast({ message: msg, type: 'error', visible: true });

  const hideToast = () => setToast(prev => ({ ...prev, visible: false }));

  useEffect(() => {
    // 1) проверяем, проходил ли онбординг
    const checkOnboardingStatus = async () => {
      try {
        const onboardingStatus = await AsyncStorage.getItem('hasOnboarded');
        setHasOnboarded(onboardingStatus === 'true');
      } catch {
        setHasOnboarded(false);
      }
    };
    checkOnboardingStatus();

    // 2) прокидываем глобальный колбэк для тостов
    setToastCallback((message, type) => {
      setToast({ message, type, visible: true });
    });

    // 3) инициализируем Telegram WebApp (визуал)
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      try {
        tg.ready?.();
        tg.expand?.();
      } catch {}
    }
  }, []);

  // === АВТО-ЛОГИН В БЭК ПРИ СТАРТЕ MINI APP ===
  useEffect(() => {
    (async () => {
      try {
        if (!(Platform.OS === 'web') || typeof window === 'undefined') return;
        const initData = window.Telegram?.WebApp?.initData || '';

        if (!initData) {
          // приложение открыто не внутри Telegram
          // Покажем подсказку, но не ломаем UI
          showError('Откройте приложение внутри Telegram (initData пустой).');
          return;
        }

        const resp = await fetch(`${API}/api/auth/telegram`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData }),
        });
        const json = await resp.json().catch(() => ({}));
        if (!resp.ok || !json?.ok) {
          throw new Error(json?.error || 'Auth failed');
        }

        // json.user — профиль, json.last_joined — последние 7
        // при желании можно сохранить их в глобальное состояние/контекст
        // console.log('me:', json.user);
        // console.log('last7:', json.last_joined);
      } catch (e: any) {
        showError(e?.message || 'Ошибка авторизации');
      }
    })();
  }, []);

  const handleOnboardingComplete = () => setHasOnboarded(true);

  // Show loading state while checking onboarding status
  if (hasOnboarded === null) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
      </SafeAreaView>
    );
  }

  // Show onboarding if not completed
  if (!hasOnboarded) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          height: Platform.OS === 'web' ? '100vh' : '100%',
          minHeight: Platform.OS === 'web' ? '100vh' : '100%',
          backgroundColor: '#F7F8FA',
        }}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        <ToastMessage
          message={toast.message}
          type={toast.type}
          visible={toast.visible}
          onHide={hideToast}
        />
      </View>
    </SafeAreaView>
  );
}
