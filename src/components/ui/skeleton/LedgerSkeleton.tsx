'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

export function LedgerSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5',
        className
      )}
    >
      <Skeleton animation="shimmer" variant="circular" className="h-8 w-8 shrink-0" />
      <Skeleton animation="shimmer" className="h-3 flex-1 max-w-[60px]" />
      <span className="text-gray-400">—</span>
      <Skeleton animation="shimmer" variant="circular" className="h-8 w-8 shrink-0" />
      <Skeleton animation="shimmer" className="h-3 flex-1 max-w-[80px]" />
      <span className="text-gray-400">—</span>
      <Skeleton animation="shimmer" variant="circular" className="h-8 w-8 shrink-0" />
      <Skeleton animation="shimmer" className="h-3 flex-1 max-w-[60px]" />
    </div>
  );
}
