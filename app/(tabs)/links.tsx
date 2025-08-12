import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link2, Settings, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAppData } from '@/src/shared/lib/store';
import { LinkItemSkeleton } from '@/components/SkeletonLoader';
import EmptyState from '@/components/EmptyState';

export default function PageSetupTab() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { data } = useAppData();
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  return (
    <SafeAreaView style={styles.container} data-id="tab-links">
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + 24 }
        ]}
        scrollEventThrottle={16}
        bounces={false}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>MY PAGE & LINKS</Text>
          <Text style={styles.subtitle}>Manage your profile and products</Text>
        </View>

        {/* Main Actions */}
        <View style={styles.mainActionsSection}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/personal-links')}
            data-id="btn-personal-links"
          >
            <View style={styles.actionCardLeft}>
              <View style={[styles.actionCardIcon, { backgroundColor: '#F0FDF4' }]}>
                <Link2 size={24} color="#10B981" strokeWidth={2} />
              </View>
              <View style={styles.actionCardInfo}>
                <Text style={styles.actionCardTitle}>Personal payment links</Text>
                <Text style={styles.actionCardSubtitle}>Create referral links and track payouts</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, styles.secondaryActionCard]}
            onPress={() => router.push('/configure-page')}
            data-id="btn-configure-page"
          >
            <View style={styles.actionCardLeft}>
              <View style={[styles.actionCardIcon, { backgroundColor: '#EBF4FF' }]}>
                <Settings size={24} color="#3B82F6" strokeWidth={2} />
              </View>
              <View style={styles.actionCardInfo}>
                <Text style={styles.secondaryActionCardTitle}>Configure My Page</Text>
                <Text style={styles.secondaryActionCardSubtitle}>Edit profile, categories, and products</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
          </TouchableOpacity>

        </View>

        {/* Payment History Section */}
        <View style={styles.paymentHistorySection}>
          <Text style={styles.sectionTitle}>Payment Receipts + Referral Payouts</Text>
          
          {isLoadingHistory ? (
            <View style={styles.historyList} data-id="list-links">
              <LinkItemSkeleton />
              <LinkItemSkeleton />
              <LinkItemSkeleton />
            </View>
          ) : data.deals.length > 0 ? (
            <View style={styles.historyList} data-id="list-links">
              {data.deals.map((deal) => (
                <View key={deal.id} style={styles.historyItem}>
                  <View style={styles.historyContent}>
                    <View style={styles.historyLeft}>
                      <Text style={styles.historyTitle}>{deal.title || 'Deal'}</Text>
                      <Text style={styles.historyAmount}>{deal.amountFBC} FBC</Text>
                      <Text style={styles.historyDate}>{deal.date}</Text>
                      <View style={styles.historyUsers}>
                        <Text style={styles.historyPaidBy}>Paid by @user</Text>
                        {deal.refUsername && (
                          <Text style={styles.historyReferral}>Referral {deal.refUsername}</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.historyRight}>
                      <View style={[
                        styles.historyStatusChip,
                        { backgroundColor: deal.status === 'released' ? '#F0FDF4' : '#FEF3C7' }
                      ]}>
                        <Text style={[
                          styles.historyStatusText,
                          { color: deal.status === 'released' ? '#10B981' : '#D97706' }
                        ]}>
                          {deal.status === 'released' ? 'Payment received' : 'Pending'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyHistory} data-id="list-links">
              <EmptyState 
                type="links" 
                onAction={() => router.push('/personal-links')}
                actionText="Create payment link"
              />
            </View>
          )}
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
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  mainActionsSection: {
    marginBottom: 24,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  secondaryActionCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionCardInfo: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  actionCardSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 22,
  },
  secondaryActionCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  secondaryActionCardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  paymentHistorySection: {
    marginTop: 32,
  },
  historyList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  historyContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
  },
  historyLeft: {
    flex: 1,
    marginRight: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  historyUsers: {
    gap: 4,
  },
  historyPaidBy: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  historyReferral: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyStatusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  historyStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyHistory: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
});