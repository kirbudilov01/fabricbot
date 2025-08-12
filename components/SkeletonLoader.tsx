import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function SkeletonLoader({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonLoaderProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: '#E5E7EB',
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function OfferCardSkeleton() {
  return (
    <View style={styles.offerCardSkeleton}>
      <SkeletonLoader width="100%" height={120} borderRadius={0} />
      <View style={styles.offerContentSkeleton}>
        <View style={styles.offerHeaderSkeleton}>
          <SkeletonLoader width="70%" height={16} borderRadius={8} />
          <SkeletonLoader width={40} height={20} borderRadius={8} />
        </View>
        <SkeletonLoader width="90%" height={14} borderRadius={8} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="60%" height={14} borderRadius={8} style={{ marginBottom: 16 }} />
        <View style={styles.offerFooterSkeleton}>
          <SkeletonLoader width={60} height={12} borderRadius={8} />
          <SkeletonLoader width={50} height={16} borderRadius={8} />
        </View>
        <SkeletonLoader width="100%" height={36} borderRadius={12} />
      </View>
    </View>
  );
}

export function PersonCardSkeleton() {
  return (
    <View style={styles.personCardSkeleton}>
      <SkeletonLoader width={56} height={56} borderRadius={28} style={{ marginRight: 16 }} />
      <View style={styles.personInfoSkeleton}>
        <View style={styles.personHeaderSkeleton}>
          <SkeletonLoader width="60%" height={16} borderRadius={8} />
          <SkeletonLoader width={40} height={14} borderRadius={8} />
        </View>
        <SkeletonLoader width="40%" height={14} borderRadius={8} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="90%" height={14} borderRadius={8} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="70%" height={14} borderRadius={8} style={{ marginBottom: 8 }} />
        <View style={styles.personStatsSkeletion}>
          <SkeletonLoader width={60} height={12} borderRadius={8} />
          <View style={styles.categoriesSkeletion}>
            <SkeletonLoader width={50} height={16} borderRadius={8} />
            <SkeletonLoader width={40} height={16} borderRadius={8} />
          </View>
        </View>
      </View>
      <SkeletonLoader width={20} height={20} borderRadius={10} />
    </View>
  );
}

export function LinkItemSkeleton() {
  return (
    <View style={styles.linkItemSkeleton}>
      <View style={styles.linkInfoSkeleton}>
        <View style={styles.linkHeaderSkeleton}>
          <SkeletonLoader width="30%" height={14} borderRadius={8} />
          <SkeletonLoader width={60} height={12} borderRadius={8} />
        </View>
        <SkeletonLoader width="70%" height={13} borderRadius={8} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="90%" height={11} borderRadius={8} />
      </View>
      <View style={styles.linkActionsSkeleton}>
        <SkeletonLoader width={16} height={16} borderRadius={8} style={{ marginRight: 8 }} />
        <SkeletonLoader width={16} height={16} borderRadius={8} />
      </View>
    </View>
  );
}

export function PendingDealSkeleton() {
  return (
    <View style={styles.pendingDealSkeleton}>
      <View style={styles.dealContentSkeleton}>
        <View style={styles.dealLeftSkeleton}>
          <SkeletonLoader width={40} height={40} borderRadius={20} style={{ marginRight: 16 }} />
          <View style={styles.dealInfoSkeleton}>
            <SkeletonLoader width="70%" height={16} borderRadius={8} style={{ marginBottom: 8 }} />
            <SkeletonLoader width="50%" height={18} borderRadius={8} style={{ marginBottom: 8 }} />
            <View style={styles.dealMetaSkeleton}>
              <SkeletonLoader width={50} height={14} borderRadius={8} style={{ marginRight: 16 }} />
              <SkeletonLoader width={60} height={14} borderRadius={8} />
            </View>
            <SkeletonLoader width="60%" height={14} borderRadius={8} />
          </View>
        </View>
        <View style={styles.dealRightSkeleton}>
          <SkeletonLoader width={60} height={24} borderRadius={12} style={{ marginBottom: 16 }} />
          <SkeletonLoader width={80} height={36} borderRadius={12} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  offerCardSkeleton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginRight: 16,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  offerContentSkeleton: {
    padding: 16,
  },
  offerHeaderSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  offerFooterSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  personCardSkeleton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  personInfoSkeleton: {
    flex: 1,
  },
  personHeaderSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  personStatsSkeletion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoriesSkeletion: {
    flexDirection: 'row',
    gap: 8,
  },
  linkItemSkeleton: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkInfoSkeleton: {
    flex: 1,
    marginRight: 16,
  },
  linkHeaderSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  linkActionsSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingDealSkeleton: {
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
  dealContentSkeleton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  dealLeftSkeleton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  dealInfoSkeleton: {
    flex: 1,
  },
  dealMetaSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dealRightSkeleton: {
    alignItems: 'flex-end',
  },
});