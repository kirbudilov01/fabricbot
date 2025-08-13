'use client'

import { useState } from 'react'
import { Link2, Settings, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAppData } from '@/lib/store'
import { LinkItemSkeleton } from '@/components/SkeletonLoader'
import EmptyState from '@/components/EmptyState'

export default function LinksPage() {
  const router = useRouter()
  const { data } = useAppData()
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-900">FabricBot</h1>
              <div className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-600 hover:text-gray-900">Discover</a>
                <a href="/clan" className="text-gray-600 hover:text-gray-900">Clan</a>
                <a href="/balance" className="text-gray-600 hover:text-gray-900">Balance</a>
                <a href="/links" className="text-primary-600 font-medium">Setup</a>
                <a href="/account" className="text-gray-600 hover:text-gray-900">Profile</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">MY PAGE & LINKS</h1>
          <p className="text-lg text-gray-600">Manage your profile and products</p>
        </div>

        {/* Main Actions */}
        <div className="space-y-6 mb-12">
          <button
            onClick={() => router.push('/personal-links')}
            className="w-full card p-8 flex items-center justify-between hover:shadow-md transition-shadow border-2 border-success-500"
          >
            <div className="flex items-center">
              <div className="w-14 h-14 bg-success-50 rounded-full flex items-center justify-center mr-6">
                <Link2 className="w-6 h-6 text-success-500" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Personal payment links</h3>
                <p className="text-gray-600">Create referral links and track payouts</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </button>

          <button
            onClick={() => router.push('/configure-page')}
            className="w-full card p-6 flex items-center justify-between hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mr-4">
                <Settings className="w-6 h-6 text-primary-500" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Configure My Page</h3>
                <p className="text-gray-500 text-sm">Edit profile, categories, and products</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Payment History Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Receipts + Referral Payouts</h2>
          
          {isLoadingHistory ? (
            <div className="card p-6">
              <LinkItemSkeleton />
              <LinkItemSkeleton />
              <LinkItemSkeleton />
            </div>
          ) : data.deals.length > 0 ? (
            <div className="card overflow-hidden">
              {data.deals.map((deal, index) => (
                <div key={deal.id} className={`p-6 ${index !== data.deals.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{deal.title || 'Deal'}</h3>
                      <p className="text-xl font-bold text-success-500 mb-1">{deal.amountFBC} FBC</p>
                      <p className="text-sm text-gray-600 mb-2">{deal.date}</p>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">Paid by @user</p>
                        {deal.refUsername && (
                          <p className="text-sm font-medium text-primary-500">Referral {deal.refUsername}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                        deal.status === 'released' 
                          ? 'bg-success-50 text-success-600' 
                          : 'bg-warning-50 text-warning-600'
                      }`}>
                        {deal.status === 'released' ? 'Payment received' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8">
              <EmptyState 
                type="links" 
                onAction={() => router.push('/personal-links')}
                actionText="Create payment link"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}