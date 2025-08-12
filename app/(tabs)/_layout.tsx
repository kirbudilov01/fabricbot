import { Tabs } from 'expo-router';
import { Crown, Users, Wallet, Link2, CircleUser as UserCircle, Search, Settings } from 'lucide-react-native';
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
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 64,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
          ...(Platform.OS === 'web' && {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
          }),
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
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
            <Search size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="clan"
        options={{
          title: 'Clan',
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="balance"
        options={{
          title: 'Balance',
          tabBarIcon: ({ size, color }) => (
            <Wallet size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="links"
        options={{
          title: 'Setup',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <Crown size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}