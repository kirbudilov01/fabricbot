// app/_layout.tsx
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

// ===== API =====
const API =
  (process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'https://fabricbot-backend1.vercel.app');

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
        ready?: () => void;
        expand?: () => void;
        initData?: string;
      };
    };
  }
}

// --- helpers ---
function getInitDataFromEnv(): string {
  if (typeof window === 'undefined') return '';
  // 1) Настоящий Mini App
  const tgInit = window?.Telegram?.WebApp?.initData || '';
  if (tgInit) return tgInit;
  // 2) Dev-режим: из query (?initData=...)
  const urlInit = new URLSearchParams(window.location.search).get('initData') || '';
  return urlInit;
}

export default function RootLayout() {
  useFrameworkReady();

  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error' | 'warning'; visible: boolean;}>({
    message: '', type: 'success', visible: false,
  });

  // для наглядности покажем статус авторизации
  const [authStatus, setAuthStatus] = useState<'idle' | 'ok' | 'error' | 'no-init'>('idle');
  const [authError, setAuthError] = useState<string | null>(null);

  const showError = (msg: string) => {
    setToast({ message: msg, type: 'error', visible: true });
  };
  const hideToast = () => setToast(prev => ({ ...prev, visible: false }));

  useEffect(() => {
    // 1) проверяем онбординг
    (async () => {
      try {
        const onboardingStatus = await AsyncStorage.getItem('hasOnboarded');
        setHasOnboarded(onboardingStatus === 'true');
      } catch {
        setHasOnboarded(false);
      }
    })();

    // 2) тосты
    setToastCallback((message, type) => setToast({ message, type, visible: true }));

    // 3) визуальный init Telegram
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.ready?.();
        window.Telegram.WebApp.expand?.();
      } catch {}
    }
  }, []);

  // === авто-логин ===
  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS !== 'web' || typeof window === 'undefined') return;

        const initData = getInitDataFromEnv();
        if (!initData) {
          setAuthStatus('no-init'); // не из TG и без ?initData
          return;
        }

        setAuthStatus('idle');
        const resp = await fetch(`${API}/api/auth/telegram`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData }),
        });
        const json = await resp.json().catch(() => ({} as any));
        if (!resp.ok || !json?.ok) {
          throw new Error(json?.error || `Auth failed (${resp.status})`);
        }
        setAuthStatus('ok');
        setAuthError(null);
        // тут можно сохранить json.user в контекст/стейт при желании
        // console.log('me:', json.user, 'last7:', json.last_joined);
      } catch (e: any) {
        setAuthStatus('error');
        setAuthError(e?.message || 'Ошибка авторизации');
        showError(e?.message || 'Ошибка авторизации');
      }
    })();
  }, []);

  const handleOnboardingComplete = () => setHasOnboarded(true);

  // loading пока проверяем онбординг
  if (hasOnboarded === null) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
      </SafeAreaView>
    );
  }

  // онбординг
  if (!hasOnboarded) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  const Banner = () => {
    if (authStatus === 'no-init') {
      return (
        <div style={{ background: '#fff3cd', color: '#664d03', padding: 8, textAlign: 'center' }}>
          Откройте приложение внутри Telegram или добавьте <code>?initData=...</code> в URL для теста в браузере.
        </div>
      );
    }
    if (authStatus === 'error') {
      return (
        <div style={{ background: '#f8d7da', color: '#842029', padding: 8, textAlign: 'center' }}>
          Ошибка авторизации: {authError}
        </div>
      );
    }
    if (authStatus === 'ok') {
      return (
        <div style={{ background: '#d1e7dd', color: '#0f5132', padding: 8, textAlign: 'center' }}>
          Авторизация успешна
        </div>
      );
    }
    return null;
  };

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
        {/* Статус авторизации для наглядности */}
        {Platform.OS === 'web' && <Banner />}

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        <ToastMessage message={toast.message} type={toast.type} visible={toast.visible} onHide={hideToast} />
      </View>
    </SafeAreaView>
  );
}
