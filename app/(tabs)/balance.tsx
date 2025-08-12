import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wallet, TrendingUp, Clock, ArrowUpRight, ArrowDownRight, CreditCard, ChartBar as BarChart3, X, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAppData } from '@/src/shared/lib/store';
import * as api from '@/src/shared/api/methods';

const topReferrals = [
  { id: '1', username: '@alex_designer', totalEarned: '45.50', deals: 12 },
  { id: '2', username: '@maria_dev', totalEarned: '32.00', deals: 8 },
  { id: '3', username: '@ivan_writer', totalEarned: '28.75', deals: 6 },
  { id: '4', username: '@kate_photo', totalEarned: '15.25', deals: 4 },
  { id: '5', username: '@dmitry_video', totalEarned: '12.00', deals: 3 },
];

const mockTransactions = [
  { 
    id: '1', 
    date: '2025-01-15', 
    type: 'payment_received', 
    amount: '50.00', 
    yourAmount: '25.00',
    refAmount: '15.00',
    refUser: '@alex_designer',
    description: 'Logo Design',
    status: 'completed' 
  },
  { 
    id: '2', 
    date: '2025-01-14', 
    type: 'ref_bonus', 
    amount: '15.00', 
    client: '@maria_client',
    description: 'Website Creation',
    status: 'completed' 
  },
  { 
    id: '3', 
    date: '2025-01-13', 
    type: 'payment_received', 
    amount: '100.00', 
    yourAmount: '50.00',
    refAmount: '10.00',
    refUser: '@ivan_writer',
    description: 'SMM Campaign',
    status: 'completed' 
  },
];

const mockPayouts = [
  { id: '1', amount: '100.00', method: 'Telegram Wallet', status: 'paid' },
  { id: '2', amount: '50.00', method: 'Telegram Wallet', status: 'processing' },
];

const pendingTransactions = [
  { id: '1', date: '2025-01-16', type: 'creator', amount: '15.00', status: 'created', description: 'Logo Design' },
  { id: '2', date: '2025-01-15', type: 'referral', amount: '10.00', status: 'in_work', description: 'Website Creation' },
  { id: '3', date: '2025-01-14', type: 'creator', amount: '5.00', status: 'paid', description: 'SMM Consultation' },
];

export default function BalanceTab() {
  const router = useRouter();
  const { data } = useAppData();
  const [activeTab, setActiveTab] = useState('referrals');
  const [pendingModal, setPendingModal] = useState(false);

  // Compute KPIs from store data
  const computeKPIs = () => {
    // Creator balance = sum of ['deposit','release'] - ['withdraw','fee']
    const creatorBalance = data.ledger.reduce((sum, entry) => {
      if (['deposit', 'release'].includes(entry.kind)) {
        return sum + parseFloat(entry.amountFBC);
      } else if (['withdraw', 'fee'].includes(entry.kind)) {
        return sum - parseFloat(entry.amountFBC);
      }
      return sum;
    }, 0);

    // Referral balance = sum of ['ref_bonus'] - ['withdraw']
    const referralBalance = data.ledger.reduce((sum, entry) => {
      if (entry.kind === 'ref_bonus') {
        return sum + parseFloat(entry.amountFBC);
      } else if (entry.kind === 'withdraw') {
        return sum - parseFloat(entry.amountFBC);
      }
      return sum;
    }, 0);

    // Pending = sum of store.deals with status 'pending'
    const pendingAmount = data.deals
      .filter(deal => deal.status === 'pending')
      .reduce((sum, deal) => sum + parseFloat(deal.amountFBC), 0);

    const totalBalance = creatorBalance + referralBalance;

    return {
      creatorBalance: creatorBalance.toFixed(2),
      referralBalance: referralBalance.toFixed(2),
      pendingAmount: pendingAmount.toFixed(2),
      totalBalance: totalBalance.toFixed(0)
    };
  };

  const kpis = computeKPIs();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
      case 'paid':
        return '#10B981';
      case 'in_work':
      case 'processing':
        return '#F59E0B';
      case 'created':
        return '#6B7280';
      default:
        return '#3B82F6';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      created: 'created',
      paid: 'paid',
      in_work: 'in work',
      completed: 'completed',
      processing: 'processing',
      released_author: 'released to author',
      ref_payout_done: 'ref payout done',
    };
    return statusMap[status] || status;
  };

  const renderReferralItem = ({ item }: { item: any }) => (
    <View style={styles.referralItem}>
      <View style={styles.referralLeft}>
        <View style={styles.referralIcon}>
          <Users size={16} color="#10B981" strokeWidth={2} />
        </View>
        <View style={styles.referralInfo}>
          <Text style={styles.referralUsername}>{item.username}</Text>
          <Text style={styles.referralDeals}>{item.deals} deals</Text>
        </View>
      </View>
      <Text style={styles.referralEarned}>+{item.totalEarned} FBC</Text>
    </View>
  );

  const renderTransaction = ({ item }: { item: any }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionContent}>
        <View style={styles.transactionLeft}>
          <View style={styles.transactionIcon}>
            <ArrowUpRight size={16} color="#10B981" strokeWidth={2} />
          </View>
          <View style={styles.transactionInfo}>
            {item.type === 'payment_received' ? (
              <Text style={styles.transactionDescription}>
                Payment received {item.amount} FBC - You got {item.yourAmount} FBC, {item.refUser} got {item.refAmount} FBC
              </Text>
            ) : (
              <Text style={styles.transactionDescription}>
                You received ref bonus {item.amount} FBC for client {item.client} payment
              </Text>
            )}
            <Text style={styles.transactionDate}>{item.date} • {item.description}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.detailsButton} disabled={true}>
          <Text style={styles.detailsButtonText}>Details</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
          {getStatusText(item.status)}
        </Text>
      </View>
    </View>
  );

  const renderPayout = ({ item }: { item: any }) => (
    <View style={styles.payoutItem}>
      <View style={styles.payoutLeft}>
        <View style={styles.payoutIcon}>
          <CreditCard size={16} color="#8B5CF6" strokeWidth={2} />
        </View>
        <View style={styles.payoutInfo}>
          <Text style={styles.payoutAmount}>{item.amount} FBC</Text>
          <Text style={styles.payoutMethod}>{item.method}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
          {getStatusText(item.status)}
        </Text>
      </View>
    </View>
  );

  const renderPendingTransaction = ({ item }: { item: any }) => (
    <View style={styles.pendingTransactionItem}>
      <View style={styles.pendingTransactionLeft}>
        <View style={[styles.transactionIcon, { backgroundColor: item.type === 'creator' ? '#EBF4FF' : '#F0FDF4' }]}>
          {item.type === 'creator' ? (
            <ArrowUpRight size={16} color="#3B82F6" strokeWidth={2} />
          ) : (
            <ArrowDownRight size={16} color="#10B981" strokeWidth={2} />
          )}
        </View>
        <View style={styles.pendingTransactionInfo}>
          <Text style={styles.pendingTransactionType}>{item.type}</Text>
          <Text style={styles.pendingTransactionDescription}>{item.description}</Text>
          <Text style={styles.pendingTransactionDate}>{item.date}</Text>
        </View>
      </View>
      <View style={styles.pendingTransactionRight}>
        <Text style={styles.pendingTransactionAmount}>{item.amount} FBC</Text>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} data-id="tab-balance">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Balance</Text>
          <Text style={styles.subtitle}>Track your earnings and payouts</Text>
        </View>

        {/* Total Balance */}
        <View style={styles.totalBalanceCard}>
          <Text style={styles.totalBalanceLabel}>Your Balance</Text>
          <Text style={styles.totalBalanceAmount}>{kpis.totalBalance} FBC</Text>
          <Text style={styles.totalBalanceNote}>1 TON = 1 FBC</Text>
        </View>

        {/* Balance Summary */}
        <View style={styles.balanceGrid}>
          <View style={styles.balanceCard} data-id="kpi-creator">
            <Text style={styles.balanceLabel}>Creator Balance</Text>
            <Text style={styles.balanceAmount}>{kpis.creatorBalance} FBC</Text>
          </View>
          <View style={styles.balanceCard} data-id="kpi-referral">
            <Text style={styles.balanceLabel}>Referral Balance</Text>
            <Text style={styles.balanceAmount}>{kpis.referralBalance} FBC</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.pendingCard}
          onPress={() => router.push('/pending-deals')}
          data-id="btn-open-pending"
        >
          <View style={styles.pendingCard} data-id="kpi-pending">
          <View style={styles.pendingLeft}>
            <Clock size={20} color="#F59E0B" strokeWidth={2} />
            <View style={styles.pendingInfo}>
              <Text style={styles.pendingLabel}>Pending</Text>
              <Text style={styles.pendingAmount}>{kpis.pendingAmount} FBC</Text>
            </View>
          </View>
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>awaiting confirmation</Text>
          </View>
          </View>
        </TouchableOpacity>

        {/* Top Up Button */}
        <TouchableOpacity style={styles.topUpButton} data-id="btn-top-up">
          <Wallet size={20} color="#10B981" strokeWidth={2} />
          <Text style={styles.topUpButtonText}>Top Up Balance</Text>
        </TouchableOpacity>

        {/* Withdraw Button */}
        <TouchableOpacity style={styles.withdrawButton} data-id="btn-open-withdraw">
          <Wallet size={20} color="#ffffff" strokeWidth={2} />
          <Text style={styles.withdrawButtonText}>Withdraw</Text>
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'referrals' && styles.activeTab]}
            onPress={() => setActiveTab('referrals')}
          >
            <Users size={18} color={activeTab === 'referrals' ? '#3B82F6' : '#6B7280'} strokeWidth={2} />
            <Text style={[styles.tabText, activeTab === 'referrals' && styles.activeTabText]}>
              Top Referrals
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
            onPress={() => setActiveTab('transactions')}
          >
            <TrendingUp size={18} color={activeTab === 'transactions' ? '#3B82F6' : '#6B7280'} strokeWidth={2} />
            <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>
              Transactions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'payouts' && styles.activeTab]}
            onPress={() => setActiveTab('payouts')}
          >
            <CreditCard size={18} color={activeTab === 'payouts' ? '#3B82F6' : '#6B7280'} strokeWidth={2} />
            <Text style={[styles.tabText, activeTab === 'payouts' && styles.activeTabText]}>
              Payouts
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'referrals' && (
            <View data-id="list-referrals">
              <FlatList
                data={topReferrals}
                renderItem={renderReferralItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}

          {activeTab === 'transactions' && (
            <View data-id="list-transactions">
              <FlatList
                data={mockTransactions}
                renderItem={renderTransaction}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}

          {activeTab === 'payouts' && (
            <View data-id="list-payouts">
              <FlatList
                data={mockPayouts}
                renderItem={renderPayout}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Pending Transactions Modal */}
      <Modal
        visible={pendingModal}
        animationType="slide"
        transparent={true}
        data-id="modal-pending-transactions"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pending Deals</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setPendingModal(false)}
              >
                <X size={24} color="#6b7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={pendingTransactions}
              renderItem={renderPendingTransaction}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  totalBalanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  totalBalanceLabel: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  totalBalanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 8,
  },
  totalBalanceNote: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  balanceGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  pendingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pendingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pendingInfo: {
    marginLeft: 12,
  },
  pendingLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  pendingAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pendingBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  topUpButton: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 18,
    marginBottom: 12,
    minHeight: 56,
    borderWidth: 2,
    borderColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  topUpButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 8,
  },
  withdrawButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 18,
    marginBottom: 24,
    minHeight: 56,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  withdrawButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minHeight: 44,
  },
  activeTab: {
    backgroundColor: '#EBF4FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#3B82F6',
  },
  tabContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  referralItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  referralLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  referralIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  referralInfo: {
    marginLeft: 12,
  },
  referralUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  referralDeals: {
    fontSize: 14,
    color: '#6b7280',
  },
  referralEarned: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  transactionItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
    lineHeight: 22,
  },
  transactionDate: {
    fontSize: 13,
    color: '#6b7280',
  },
  detailsButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
  detailsButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  payoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  payoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  payoutIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#F3E8FF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payoutInfo: {
    marginLeft: 12,
  },
  payoutAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  payoutMethod: {
    fontSize: 14,
    color: '#6b7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingTransactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  pendingTransactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pendingTransactionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  pendingTransactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  pendingTransactionDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 2,
  },
  pendingTransactionDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  pendingTransactionRight: {
    alignItems: 'flex-end',
  },
  pendingTransactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
});