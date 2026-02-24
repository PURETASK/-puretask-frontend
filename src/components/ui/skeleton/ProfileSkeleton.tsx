'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

export function ProfileSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex gap-4 p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5',
        className
      )}
    >
      <Skeleton animation="shimmer" variant="rectangular" className="h-14 w-14 rounded-2xl shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton animation="shimmer" className="h-4 w-1/4 max-w-[80px]" />
        <Skeleton animation="shimmer" className="h-3 w-1/2 max-w-[140px]" />
        <div className="flex gap-2 pt-1">
          <Skeleton animation="shimmer" className="h-6 w-20 rounded-full" />
          <Skeleton animation="shimmer" className="h-6 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}
