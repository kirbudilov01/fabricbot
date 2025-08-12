import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, User, Users, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAppData } from '@/src/shared/lib/store';
import * as api from '@/src/shared/api/methods';
import { PendingDealSkeleton } from '@/components/SkeletonLoader';
import EmptyState from '@/components/EmptyState';
import { useState } from 'react';

export default function PendingDealsScreen() {
  const router = useRouter();
  const { data, updateDeal, addLedgerEntry } = useAppData();
  const [isLoading, setIsLoading] = useState(false);
  
  const pendingDeals = data.deals.filter(deal => deal.status === 'pending');

  const handleConfirm = (deal: any) => {
    api.confirmDeal(deal.id)
      .then((confirmedDeal) => {
        // Update local store
        updateDeal(deal.id, { status: 'released' });
        
        // Add ledger entries
        addLedgerEntry({
          kind: 'release',
          amountFBC: deal.amountFBC,
          date: new Date().toISOString().split('T')[0]
        });
        
        // If there's a referral, add ref bonus (assuming 10% of deal amount)
        if (deal.refUsername) {
          const refBonus = (parseFloat(deal.amountFBC) * 0.1).toFixed(2);
          addLedgerEntry({
            kind: 'ref_bonus',
            amountFBC: refBonus,
            date: new Date().toISOString().split('T')[0]
          });
        }
      })
      .catch(() => {
        // Toast will be shown by API client error handling
      });
  };

  const renderDealItem = ({ item }: { item: any }) => (
    <View style={styles.dealItem}>
      <View style={styles.dealContent}>
        <View style={styles.dealLeft}>
          <View style={styles.dealIcon}>
            {item.role === 'creator' ? (
              <User size={20} color="#3B82F6" strokeWidth={2} />
            ) : (
              <Users size={20} color="#10B981" strokeWidth={2} />
            )}
          </View>
          <View style={styles.dealInfo}>
            <Text style={styles.dealTitle}>{item.title || 'Deal'}</Text>
            <Text style={styles.dealAmount}>{item.amountFBC} FBC</Text>
            <View style={styles.dealMeta}>
              <Text style={styles.dealRole}>{item.role === 'creator' ? 'Creator' : 'Referral'}</Text>
              <Text style={styles.dealDate}>{item.date}</Text>
            </View>
            {item.refUsername && (
              <Text style={styles.dealRef}>Ref: {item.refUsername}</Text>
            )}
          </View>
        </View>
        <View style={styles.dealRight}>
          <View style={styles.statusChip}>
            <Clock size={14} color="#F59E0B" strokeWidth={2} />
            <Text style={styles.statusText}>Pending</Text>
          </View>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => handleConfirm(item)}
            data-id="btn-confirm"
          >
            <CheckCircle size={16} color="#ffffff" strokeWidth={2} />
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1f2937" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pending Deals</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <View data-id="list-pending">
            <PendingDealSkeleton />
            <PendingDealSkeleton />
            <PendingDealSkeleton />
          </View>
        ) : pendingDeals.length > 0 ? (
          <View data-id="list-pending">
            <FlatList
              data={pendingDeals}
              renderItem={renderDealItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <View style={styles.emptyState} data-id="list-pending">
            <EmptyState type="pending" />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  headerSpacer: {
    width: 44,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  dealItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  dealContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  dealLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  dealIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dealInfo: {
    flex: 1,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  dealAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 8,
  },
  dealMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dealRole: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginRight: 12,
  },
  dealDate: {
    fontSize: 14,
    color: '#9ca3af',
  },
  dealRef: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  dealRight: {
    alignItems: 'flex-end',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
    marginLeft: 4,
  },
  confirmButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    minHeight: 36,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 6,
  },
  rejectButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    minHeight: 36,
    marginTop: 8,
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
});