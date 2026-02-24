'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

export function MapPlaceholderSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 overflow-hidden',
        className
      )}
    >
      <Skeleton animation="shimmer" className="w-full h-full min-h-[200px] rounded-2xl" />
      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
        <Skeleton animation="shimmer" className="h-6 w-20 rounded-full" />
        <Skeleton animation="shimmer" className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}
