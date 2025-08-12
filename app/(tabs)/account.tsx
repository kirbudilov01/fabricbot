import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleUser as UserCircle, Wallet, Briefcase, CreditCard, Bell, Settings, MessageSquare, ExternalLink, CircleAlert as AlertCircle } from 'lucide-react-native';

export default function AccountTab() {
  const [notifications, setNotifications] = useState({
    deals: true,
    payouts: false,
  });

  return (
    <SafeAreaView style={styles.container} data-id="tab-account">
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        bounces={false}
        contentInsetAdjustmentBehavior="never"
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} data-id="account-name">Your Own</Text>
            <Text style={styles.profileUsername}>@your_username</Text>
            <Text style={styles.profileId}>ID: 123456789</Text>
          </View>
        </View>

        {/* Telegram Wallet */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <Wallet size={24} color="#0088cc" strokeWidth={2} />
            <Text style={styles.walletTitle}>Telegram Wallet</Text>
          </View>
          <View style={styles.walletStatus}>
            <View style={styles.statusIndicator}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText} data-id="wallet-address">not connected</Text>
            </View>
          </View>
          <Text style={styles.walletDescription}>
            Connection will be enabled at the next stage
          </Text>
          <TouchableOpacity style={styles.connectButton} data-id="btn-connect-wallet">
            <Text style={styles.connectButtonText}>Connect Wallet</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Cards */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={[styles.menuCard, styles.disabledCard]} disabled={true}>
            <View style={styles.menuCardLeft}>
              <View style={styles.menuIcon}>
                <Briefcase size={24} color="#9CA3AF" strokeWidth={2} />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.disabledMenuTitle}>Projects & History</Text>
                <Text style={styles.disabledMenuSubtitle}>List of deals and projects</Text>
              </View>
            </View>
            <ExternalLink size={20} color="#D1D5DB" strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuCard, styles.disabledCard]} disabled={true}>
            <View style={styles.menuCardLeft}>
              <View style={styles.menuIcon}>
                <CreditCard size={24} color="#9CA3AF" strokeWidth={2} />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.disabledMenuTitle}>Withdrawal Method</Text>
                <Text style={styles.disabledMenuSubtitle}>Payment details</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.disabledChangeButton} disabled={true}>
              <Text style={styles.disabledChangeButtonText}>Change</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <View style={[styles.notificationsCard, styles.disabledCard]}>
            <View style={styles.notificationsHeader}>
              <View style={styles.menuIcon}>
                <Bell size={24} color="#9CA3AF" strokeWidth={2} />
              </View>
              <Text style={styles.disabledMenuTitle}>Notifications</Text>
            </View>

            <View style={styles.notificationItem}>
              <Text style={styles.disabledNotificationText}>Deal Events</Text>
              <Switch
                value={notifications.deals}
                onValueChange={(value) => setNotifications({ ...notifications, deals: value })}
                trackColor={{ false: '#e5e7eb', true: '#D1D5DB' }}
                thumbColor={notifications.deals ? '#9CA3AF' : '#9ca3af'}
                disabled={true}
              />
            </View>

            <View style={styles.notificationItem}>
              <Text style={styles.disabledNotificationText}>Payouts</Text>
              <Switch
                value={notifications.payouts}
                onValueChange={(value) => setNotifications({ ...notifications, payouts: value })}
                trackColor={{ false: '#e5e7eb', true: '#D1D5DB' }}
                thumbColor={notifications.payouts ? '#9CA3AF' : '#9ca3af'}
                disabled={true}
              />
            </View>
          </View>
        </View>

        {/* Page Setup Button */}
        <TouchableOpacity style={[styles.pageSetupButton, styles.disabledButton]} disabled={true}>
          <Settings size={20} color="#9CA3AF" strokeWidth={2} />
          <Text style={styles.disabledPageSetupButtonText}>Page Setup</Text>
        </TouchableOpacity>

        {/* Partner Button */}
        <TouchableOpacity style={styles.partnerButton} data-id="btn-become-partner">
          <UserCircle size={20} color="#ffffff" strokeWidth={2} />
          <Text style={styles.partnerButtonText}>Become Our Partner</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerUsername}>@your_username</Text>
          <TouchableOpacity style={[styles.supportButton, styles.disabledButton]} disabled={true}>
            <MessageSquare size={18} color="#D1D5DB" strokeWidth={2} />
            <Text style={styles.disabledSupportButtonText}>Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 16,
    color: '#3B82F6',
    marginBottom: 2,
  },
  profileId: {
    fontSize: 14,
    color: '#6b7280',
  },
  walletCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginLeft: 12,
  },
  walletStatus: {
    marginBottom: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  walletDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  connectButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  connectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  menuSection: {
    marginBottom: 24,
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 76,
  },
  disabledCard: {
    backgroundColor: '#f9fafb',
    shadowOpacity: 0.02,
  },
  menuCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  disabledMenuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  disabledMenuSubtitle: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  changeButton: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    minHeight: 36,
    justifyContent: 'center',
  },
  disabledChangeButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    minHeight: 36,
    justifyContent: 'center',
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  disabledChangeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  notificationsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  notificationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    minHeight: 44,
  },
  notificationText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  disabledNotificationText: {
    fontSize: 16,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  pageSetupButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 18,
    marginBottom: 16,
    minHeight: 56,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#f3f4f6',
    shadowOpacity: 0,
    elevation: 0,
  },
  pageSetupButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  disabledPageSetupButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    marginLeft: 8,
  },
  partnerButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 18,
    marginBottom: 32,
    minHeight: 56,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  partnerButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 16,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    minHeight: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginLeft: 8,
  },
  disabledSupportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D1D5DB',
    marginLeft: 8,
  },
});