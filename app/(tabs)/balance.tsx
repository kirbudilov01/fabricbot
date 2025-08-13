'use client'

import { useState } from 'react'
import { Wallet, TrendingUp, Clock, Users, CreditCard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAppData } from '@/lib/store'

const topReferrals = [
  { id: '1', username: '@alex_designer', totalEarned: '45.50', deals: 12 },
  { id: '2', username: '@maria_dev', totalEarned: '32.00', deals: 8 },
  { id: '3', username: '@ivan_writer', totalEarned: '28.75', deals: 6 },
  { id: '4', username: '@kate_photo', totalEarned: '15.25', deals: 4 },
  { id: '5', username: '@dmitry_video', totalEarned: '12.00', deals: 3 },
]

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
]

const mockPayouts = [
  { id: '1', amount: '100.00', method: 'Telegram Wallet', status: 'paid' },
  { id: '2', amount: '50.00', method: 'Telegram Wallet', status: 'processing' },
]

export default function BalanceTab() {
  const router = useRouter()
  const { data } = useAppData()
  const [activeTab, setActiveTab] = useState('referrals')

  // Compute KPIs from store data
  const computeKPIs = () => {
    const creatorBalance = data.ledger.reduce((sum, entry) => {
      if (['deposit', 'release'].includes(entry.kind)) {
        return sum + parseFloat(entry.amountFBC)
      } else if (['withdraw', 'fee'].includes(entry.kind)) {
        return sum - parseFloat(entry.amountFBC)
      }
      return sum
    }, 0)

    const referralBalance = data.ledger.reduce((sum, entry) => {
      if (entry.kind === 'ref_bonus') {
        return sum + parseFloat(entry.amountFBC)
      } else if (entry.kind === 'withdraw') {
        return sum - parseFloat(entry.amountFBC)
      }
      return sum
    }, 0)

    const pendingAmount = data.deals
      .filter(deal => deal.status === 'pending')
      .reduce((sum, deal) => sum + parseFloat(deal.amountFBC), 0)

    const totalBalance = creatorBalance + referralBalance

    return {
      creatorBalance: creatorBalance.toFixed(2),
      referralBalance: referralBalance.toFixed(2),
      pendingAmount: pendingAmount.toFixed(2),
      totalBalance: totalBalance.toFixed(0)
    }
  }

  const kpis = computeKPIs()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'text-success-500'
      case 'processing':
        return 'text-warning-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20" data-id="tab-balance">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">MY BALANCE</h1>
          <p className="text-gray-600">Track your earnings and payouts</p>
        </div>

        {/* Total Balance */}
        <div className="card p-8 text-center mb-6">
          <p className="text-gray-600 mb-2">Your balance</p>
          <h2 className="text-4xl font-bold text-primary-500 mb-2">{kpis.totalBalance} FBC</h2>
          <p className="text-sm text-gray-500 italic">1 TON = 1 FBC</p>
        </div>

        {/* Balance Summary */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="card p-6" data-id="kpi-creator">
            <p className="text-gray-600 mb-2">Creator balance</p>
            <p className="text-2xl font-bold text-gray-900">{kpis.creatorBalance} FBC</p>
          </div>
          <div className="card p-6" data-id="kpi-referral">
            <p className="text-gray-600 mb-2">Referral balance</p>
            <p className="text-2xl font-bold text-gray-900">{kpis.referralBalance} FBC</p>
          </div>
        </div>

        {/* Pending */}
        <button 
          onClick={() => router.push('/pending-deals')}
          className="w-full card p-6 mb-6 text-center hover:shadow-md transition-shadow"
          data-id="balance-pending-card"
        >
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-warning-500 mr-3" />
            <div>
              <p className="text-gray-600">Pending</p>
              <p className="text-xl font-bold text-gray-900">{kpis.pendingAmount} FBC</p>
            </div>
          </div>
          <div className="bg-warning-50 text-warning-600 px-4 py-2 rounded-xl text-sm font-medium inline-block">
            awaiting confirmation
          </div>
        </button>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button className="btn-secondary flex items-center justify-center" data-id="btn-topup">
            <Wallet className="w-5 h-5 mr-2 text-success-500" />
            Top up balance
          </button>
          <button className="btn-primary flex items-center justify-center" data-id="btn-withdraw">
            <Wallet className="w-5 h-5 mr-2" />
            Withdraw
          </button>
        </div>

        {/* Tabs */}
        <div className="card p-1 mb-8">
          <div className="flex">
            {[
              { id: 'referrals', label: 'Top Referrals', icon: Users },
              { id: 'transactions', label: 'Transactions', icon: TrendingUp },
              { id: 'payouts', label: 'Payouts', icon: CreditCard },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="card p-6">
          {activeTab === 'referrals' && (
            <div className="space-y-4" data-id="list-referrals">
              {topReferrals.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-success-50 rounded-full flex items-center justify-center mr-4">
                      <Users className="w-4 h-4 text-success-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.username}</p>
                      <p className="text-sm text-gray-600">{item.deals} deals</p>
                    </div>
                  </div>
                  <p className="font-bold text-success-500">+{item.totalEarned} FBC</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6" data-id="list-transactions">
              {mockTransactions.map((item) => (
                <div key={item.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-success-50 rounded-full flex items-center justify-center mr-4 mt-1">
                        <TrendingUp className="w-4 h-4 text-success-500" />
                      </div>
                      <div>
                        <p className="text-gray-900 mb-1">
                          {item.type === 'payment_received' 
                            ? `Payment received ${item.amount} FBC - You got ${item.yourAmount} FBC, ${item.refUser} got ${item.refAmount} FBC`
                            : `You received ref bonus ${item.amount} FBC for client ${item.client} payment`
                          }
                        </p>
                        <p className="text-sm text-gray-600">{item.date} • {item.description}</p>
                      </div>
                    </div>
                    <button className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-lg">
                      Details
                    </button>
                  </div>
                  <div className="ml-12">
                    <span className={`bg-success-50 text-success-600 px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'payouts' && (
            <div className="space-y-4" data-id="list-payouts">
              {mockPayouts.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center mr-4">
                      <CreditCard className="w-4 h-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{item.amount} FBC</p>
                      <p className="text-sm text-gray-600">{item.method}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    item.status === 'paid' 
                      ? 'bg-success-50 text-success-600'
                      : 'bg-warning-50 text-warning-600'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}