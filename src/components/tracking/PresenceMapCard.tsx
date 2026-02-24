'use client';

import React from 'react';
import { MapPlaceholderSkeleton } from '@/components/ui/skeleton/MapPlaceholderSkeleton';
import { motion } from 'framer-motion';
import { motionTokens } from '@/components/motion/tokens';
import { MapPin, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PresenceMapCardProps {
  status?: 'on_route' | 'arrived' | 'working' | 'scheduled';
  address?: string;
  directionsUrl?: string;
  /** When true, render a real map (Phase 3); for now we use placeholder */
  useRealMap?: boolean;
  className?: string;
}

const statusLabels: Record<string, string> = {
  on_route: 'On the way',
  arrived: 'Arrived',
  working: 'Working',
  scheduled: 'Scheduled',
};

/**
 * Card that shows presence/tracking. Phase 3: can swap inner content for StyledMap + markers.
 */
export function PresenceMapCard({
  status = 'scheduled',
  address,
  directionsUrl,
  useRealMap = false,
  className,
}: PresenceMapCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.duration.base, ease: motionTokens.ease.out }}
      className={cn(
        'rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden',
        className
      )}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-white/10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
          {statusLabels[status] ?? status}
        </span>
        {directionsUrl && (
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open in Maps
          </a>
        )}
      </div>
      <div className="relative min-h-[200px]">
        {useRealMap ? (
          <div className="min-h-[200px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm text-gray-500">
            Map (Phase 3: connect provider)
          </div>
        ) : (
          <MapPlaceholderSkeleton className="min-h-[200px] w-full" />
        )}
      </div>
      {address && (
        <div className="flex items-center gap-2 p-3 text-xs text-gray-600 dark:text-gray-400">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{address}</span>
        </div>
      )}
    </motion.div>
  );
}
