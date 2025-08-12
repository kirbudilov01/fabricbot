import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus, Package, Link2, Clock, Search } from 'lucide-react-native';

interface EmptyStateProps {
  type: 'products' | 'links' | 'pending' | 'deals' | 'creators';
  onAction?: () => void;
  actionText?: string;
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
          iconColor: '#3B82F6',
          iconBg: '#EBF4FF',
        };
      case 'links':
        return {
          icon: Link2,
          title: 'No payment links',
          subtitle: 'Create custom referral links to share with others',
          actionText: actionText || 'Create payment link',
          iconColor: '#10B981',
          iconBg: '#F0FDF4',
        };
      case 'pending':
        return {
          icon: Clock,
          title: 'No pending deals',
          subtitle: 'All deals have been processed or there are no deals yet',
          actionText: null,
          iconColor: '#F59E0B',
          iconBg: '#FEF3C7',
        };
      case 'deals':
        return {
          icon: Package,
          title: 'No featured offers',
          subtitle: 'Check back later for new deals and promotions',
          actionText: null,
          iconColor: '#8B5CF6',
          iconBg: '#F3E8FF',
        };
      case 'creators':
        return {
          icon: Search,
          title: 'No creators found',
          subtitle: 'Try adjusting your search or check back later',
          actionText: null,
          iconColor: '#6B7280',
          iconBg: '#F9FAFB',
        };
      default:
        return {
          icon: Package,
          title: 'Nothing here yet',
          subtitle: 'Content will appear here when available',
          actionText: null,
          iconColor: '#6B7280',
          iconBg: '#F9FAFB',
        };
    }
  };

  const { icon: Icon, title, subtitle, actionText: defaultActionText, iconColor, iconBg } = getEmptyStateContent();
  const finalActionText = actionText || defaultActionText;

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <Icon size={32} color={iconColor} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {finalActionText && onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Plus size={20} color="#ffffff" strokeWidth={2} />
          <Text style={styles.actionButtonText}>{finalActionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    minHeight: 48,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
});