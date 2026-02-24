'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 space-y-3',
        className
      )}
    >
      <Skeleton animation="shimmer" className="h-4 w-1/3 max-w-[100px]" />
      <Skeleton animation="shimmer" className="h-8 w-2/3 max-w-[200px]" />
      <Skeleton animation="shimmer" className="h-24 w-full rounded-2xl" />
    </div>
  );
}
