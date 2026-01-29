'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  disabled?: boolean;
  threshold?: number; // Distance in pixels to trigger refresh
}

/**
 * Pull-to-refresh component for mobile
 * Allows users to pull down to refresh content
 */
export function PullToRefresh({
  onRefresh,
  children,
  disabled = false,
  threshold = 80,
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if at top of scroll
      if (container.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return;

      currentY.current = e.touches[0].clientY;
      const distance = Math.max(0, currentY.current - startY.current);
      setPullDistance(distance);

      // Prevent default scrolling when pulling
      if (distance > 0) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;

      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }

      setIsPulling(false);
      setPullDistance(0);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, threshold, onRefresh, disabled, isRefreshing]);

  const pullProgress = Math.min(pullDistance / threshold, 1);
  const shouldShowIndicator = pullDistance > 0 || isRefreshing;

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto"
      style={{
        transform: shouldShowIndicator ? `translateY(${Math.min(pullDistance, threshold)}px)` : undefined,
        transition: isPulling ? 'none' : 'transform 0.3s ease-out',
      }}
    >
      {/* Pull indicator */}
      {shouldShowIndicator && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center"
          style={{
            height: `${threshold}px`,
            transform: `translateY(-${threshold}px)`,
          }}
        >
          <div
            className={cn(
              'flex items-center gap-2 text-blue-600',
              isRefreshing && 'animate-spin'
            )}
            style={{
              opacity: pullProgress,
            }}
          >
            <RefreshCw className="h-5 w-5" />
            {isRefreshing ? (
              <span className="text-sm font-medium">Refreshing...</span>
            ) : (
              <span className="text-sm font-medium">
                {pullProgress >= 1 ? 'Release to refresh' : 'Pull to refresh'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
