import { useEffect } from 'react';
import { useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Platform, LogBox } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { setToastCallback } from '@/src/shared/lib/store';
import ToastMessage from '@/components/ToastMessage';
import OnboardingFlow from '@/components/OnboardingFlow';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  useEffect(() => {
    // Check onboarding status
    const checkOnboardingStatus = async () => {
      try {
        const onboardingStatus = await AsyncStorage.getItem('hasOnboarded');
        setHasOnboarded(onboardingStatus === 'true');
      } catch (error) {
        console.error('Failed to check onboarding status:', error);
        setHasOnboarded(false);
      }
    };

    checkOnboardingStatus();

    setToastCallback((message, type) => {
      setToast({ message, type, visible: true });
    });

    // Initialize Telegram WebApp
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
    }
  }, []);

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleOnboardingComplete = () => {
    setHasOnboarded(true);
  };

  // Show loading state while checking onboarding status
  if (hasOnboarded === null) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* You can add a loading spinner here if needed */}
        </View>
      </SafeAreaView>
    );
  }

  // Show onboarding if not completed
  if (!hasOnboarded) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{
        flex: 1,
        height: Platform.OS === 'web' ? '100vh' : '100%',
        minHeight: Platform.OS === 'web' ? '100vh' : '100%',
        backgroundColor: '#F7F8FA'
      }}>
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
