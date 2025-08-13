'use client'

import { Plus, Package, Link2, Clock, Search } from 'lucide-react'

interface EmptyStateProps {
  type: 'products' | 'links' | 'pending' | 'deals' | 'creators'
  onAction?: () => void
  actionText?: string
}

export default function EmptyState({ type, onAction, actionText }: EmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'products':
        return {
          icon: Package,
          title: 'No products yet',
          subtitle: 'Create your first product to start selling',
          actionText: actionText || 'Add product',
          iconColor: 'text-primary-500',
          iconBg: 'bg-primary-50',
        }
      case 'links':
        return {
          icon: Link2,
          title: 'No payment links',
          subtitle: 'Create custom referral links to share with others',
          actionText: actionText || 'Create payment link',
          iconColor: 'text-success-500',
          iconBg: 'bg-success-50',
        }
      case 'pending':
        return {
          icon: Clock,
          title: 'No pending deals',
          subtitle: 'All deals have been processed or there are no deals yet',
          actionText: null,
          iconColor: 'text-warning-500',
          iconBg: 'bg-warning-50',
        }
      case 'deals':
        return {
          icon: Package,
          title: 'No featured offers',
          subtitle: 'Check back later for new deals and promotions',
          actionText: null,
          iconColor: 'text-purple-500',
          iconBg: 'bg-purple-50',
        }
      case 'creators':
        return {
          icon: Search,
          title: 'No creators found',
          subtitle: 'Try adjusting your search or check back later',
          actionText: null,
          iconColor: 'text-gray-500',
          iconBg: 'bg-gray-50',
        }
      default:
        return {
          icon: Package,
          title: 'Nothing here yet',
          subtitle: 'Content will appear here when available',
          actionText: null,
          iconColor: 'text-gray-500',
          iconBg: 'bg-gray-50',
        }
    }
  }

  const { icon: Icon, title, subtitle, actionText: defaultActionText, iconColor, iconBg } = getEmptyStateContent()
  const finalActionText = actionText || defaultActionText

  return (
    <div className="text-center py-12 px-6">
      <div className={`w-20 h-20 ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
        <Icon className={`w-8 h-8 ${iconColor}`} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{subtitle}</p>
      {finalActionText && onAction && (
        <button
          onClick={onAction}
          className="btn-primary inline-flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          {finalActionText}
        </button>
      )}
    </div>
  )
}