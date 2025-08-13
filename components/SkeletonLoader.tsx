'use client'

import { useEffect, useRef } from 'react'

interface SkeletonLoaderProps {
  width?: number | string
  height?: number
  borderRadius?: number
  className?: string
}

export function SkeletonLoader({ width = '100%', height = 20, borderRadius = 8, className = '' }: SkeletonLoaderProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  )
}

export function OfferCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-80 card p-0 overflow-hidden">
      <SkeletonLoader width="100%" height={160} borderRadius={0} />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <SkeletonLoader width="70%" height={16} />
          <SkeletonLoader width={40} height={20} />
        </div>
        <SkeletonLoader width="90%" height={14} className="mb-2" />
        <SkeletonLoader width="60%" height={14} className="mb-4" />
        <div className="flex justify-between items-center mb-4">
          <SkeletonLoader width={60} height={12} />
          <SkeletonLoader width={50} height={16} />
        </div>
        <SkeletonLoader width="100%" height={36} />
      </div>
    </div>
  )
}

export function PersonCardSkeleton() {
  return (
    <div className="card p-6 flex items-center mb-4">
      <SkeletonLoader width={64} height={64} borderRadius={32} className="mr-4" />
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <SkeletonLoader width="60%" height={16} />
          <SkeletonLoader width={40} height={14} />
        </div>
        <SkeletonLoader width="40%" height={14} className="mb-2" />
        <SkeletonLoader width="90%" height={14} className="mb-2" />
        <SkeletonLoader width="70%" height={14} className="mb-3" />
        <div className="flex justify-between items-center">
          <SkeletonLoader width={60} height={12} />
          <div className="flex gap-2">
            <SkeletonLoader width={50} height={16} />
            <SkeletonLoader width={40} height={16} />
          </div>
        </div>
      </div>
      <SkeletonLoader width={20} height={20} borderRadius={10} className="ml-4" />
    </div>
  )
}

export function LinkItemSkeleton() {
  return (
    <div className="border-b border-gray-100 py-4 flex items-center justify-between last:border-b-0">
      <div className="flex-1 mr-4">
        <div className="flex justify-between items-center mb-2">
          <SkeletonLoader width="30%" height={14} />
          <SkeletonLoader width={60} height={12} />
        </div>
        <SkeletonLoader width="70%" height={13} className="mb-2" />
        <SkeletonLoader width="90%" height={11} />
      </div>
      <div className="flex items-center">
        <SkeletonLoader width={16} height={16} className="mr-2" />
        <SkeletonLoader width={16} height={16} />
      </div>
    </div>
  )
}

export function PendingDealSkeleton() {
  return (
    <div className="card p-6 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          <SkeletonLoader width={40} height={40} borderRadius={20} className="mr-4" />
          <div className="flex-1">
            <SkeletonLoader width="70%" height={16} className="mb-2" />
            <SkeletonLoader width="50%" height={18} className="mb-2" />
            <div className="flex items-center mb-2">
              <SkeletonLoader width={50} height={14} className="mr-4" />
              <SkeletonLoader width={60} height={14} />
            </div>
            <SkeletonLoader width="60%" height={14} />
          </div>
        </div>
        <div className="text-right">
          <SkeletonLoader width={60} height={24} className="mb-4" />
          <SkeletonLoader width={80} height={36} />
        </div>
      </div>
    </div>
  )
}