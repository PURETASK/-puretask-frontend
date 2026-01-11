import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export function Loading({ 
  size = 'md', 
  text,
  fullScreen = false,
  className 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 border-2',
    md: 'h-12 w-12 border-2',
    lg: 'h-16 w-16 border-3',
    xl: 'h-24 w-24 border-4',
  };

  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-blue-600 border-t-transparent',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-gray-600 font-medium">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

// Inline loading for buttons
export function ButtonLoading() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      <span>Loading...</span>
    </div>
  );
}

// Skeleton loaders
export function SkeletonLine({ className }: { className?: string }) {
  return (
    <div className={cn('h-4 bg-gray-200 rounded animate-pulse', className)} />
  );
}

export function SkeletonCard() {
  return (
    <div className="border border-gray-200 rounded-lg p-6 space-y-4">
      <SkeletonLine className="w-3/4 h-6" />
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-5/6" />
      <div className="flex gap-2 mt-4">
        <SkeletonLine className="w-20 h-8" />
        <SkeletonLine className="w-24 h-8" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <SkeletonLine className="flex-1" />
          <SkeletonLine className="flex-1" />
          <SkeletonLine className="flex-1" />
          <SkeletonLine className="w-20" />
        </div>
      ))}
    </div>
  );
}

