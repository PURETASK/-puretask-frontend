'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animated?: boolean;
  /** 'pulse' = default opacity pulse; 'shimmer' = moving gradient */
  animation?: 'pulse' | 'shimmer';
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  lines,
  animated = true,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = cn(
    animation === 'shimmer' ? 'skeleton-shimmer rounded' : 'bg-gray-200 dark:bg-gray-700',
    animated && animation === 'pulse' && 'animate-pulse',
    className
  );

  if (variant === 'text' && lines) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              'h-4 rounded',
              i === lines - 1 ? 'w-3/4' : 'w-full'
            )}
            style={width && i === lines - 1 ? { width } : undefined}
          />
        ))}
      </div>
    );
  }

  if (variant === 'circular') {
    return (
      <div
        className={cn(baseClasses, 'rounded-full')}
        style={{ width: width || 40, height: height || 40 }}
      />
    );
  }

  return (
    <div
      className={cn(baseClasses, 'rounded')}
      style={{ width, height }}
    />
  );
}

// Pre-built skeleton components for common use cases
export function SkeletonCard() {
  return (
    <div className="p-6 border border-gray-200 rounded-lg">
      <Skeleton variant="text" lines={3} className="mb-4" />
      <Skeleton width="60%" height={20} className="mb-2" />
      <Skeleton width="40%" height={20} />
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} width="100%" height={20} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} width="100%" height={16} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ items = 5, animation = 'shimmer' }: { items?: number; animation?: 'pulse' | 'shimmer' }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton animation={animation} variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton animation={animation} width="60%" height={16} />
            <Skeleton animation={animation} width="40%" height={12} />
          </div>
        </div>
      ))}
    </div>
  );
}
