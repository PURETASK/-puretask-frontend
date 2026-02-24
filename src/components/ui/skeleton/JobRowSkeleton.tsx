'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

export function JobRowSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5',
        className
      )}
    >
      <Skeleton animation="shimmer" variant="rectangular" className="h-10 w-10 rounded-xl shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton animation="shimmer" className="h-4 w-1/3 max-w-[120px]" />
        <Skeleton animation="shimmer" className="h-3 w-1/2 max-w-[180px]" />
      </div>
      <Skeleton animation="shimmer" className="h-7 w-24 rounded-full shrink-0" />
    </div>
  );
}
