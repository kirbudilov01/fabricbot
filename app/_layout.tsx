import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { setToastCallback } from '@/src/shared/lib/store';
import ToastMessage from '@/components/ToastMessage';
import { useState } from 'react';

export default function RootLayout() {
  useFrameworkReady();
  
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
    setToastCallback((message, type) => {
      setToast({ message, type, visible: true });
    });
  }, []);

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  return (
    <>
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
    </>
  );
}
