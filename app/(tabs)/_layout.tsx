import { Tabs } from 'expo-router';
import { Home, Users, Wallet, Link2, Settings, Crown } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function TabLayout() {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          height: Platform.OS === 'ios' ? 88 : 64,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 12,
          ...(Platform.OS === 'web' && {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            paddingBottom: 'env(safe-area-inset-bottom, 8px)',
          }),
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 4,
        },
        tabBarActiveLabelStyle: {
          fontWeight: '700',
        },
        tabBarInactiveLabelStyle: {
          fontWeight: '500',
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
          tabBarTestID: 'tab-home',
        }}
      />
      <Tabs.Screen
        name="clan"
        options={{
          title: 'Clan',
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} strokeWidth={2} />
          ),
          tabBarTestID: 'tab-clan',
        }}
      />
      <Tabs.Screen
        name="balance"
        options={{
          title: 'Balance',
          tabBarIcon: ({ size, color }) => (
            <Wallet size={size} color={color} strokeWidth={2} />
          ),
          tabBarTestID: 'tab-balance',
        }}
      />
      <Tabs.Screen
        name="links"
        options={{
          title: 'Setup',
          tabBarIcon: ({ size, color }) => (
            <Link2 size={size} color={color} strokeWidth={2} />
          ),
          tabBarTestID: 'tab-links',
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <Crown size={size} color={color} strokeWidth={2} />
          ),
          tabBarTestID: 'tab-account',
        }}
      />
    </Tabs>
  );
}