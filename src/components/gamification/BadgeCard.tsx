'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export interface BadgeCardProps {
  id: string;
  name: string;
  /** Emoji or icon code, e.g. "🏅" or "⏱️" */
  icon?: string;
  earned: boolean;
  earnedDate?: string;
  howToEarn?: string;
  /** Show as featured / pinned */
  featured?: boolean;
  onPin?: () => void;
  onShare?: () => void;
  /** Only core badges can be pinned */
  canPin?: boolean;
  className?: string;
}

export function BadgeCard({
  name,
  icon = '🏅',
  earned,
  earnedDate,
  howToEarn,
  featured,
  onPin,
  onShare,
  canPin = false,
  className,
}: BadgeCardProps) {
  return (
    <Card
      className={cn(
        'transition-shadow hover:shadow-md',
        !earned && 'opacity-75',
        featured && 'ring-2 ring-amber-400',
        className
      )}
    >
      <CardContent className="p-4 flex flex-col items-center text-center">
        <div
          className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2',
            earned ? 'bg-amber-100' : 'bg-gray-100'
          )}
        >
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900 text-sm">{name}</h3>
        {earned && earnedDate && (
          <p className="text-xs text-gray-500 mt-0.5">Earned {earnedDate}</p>
        )}
        {howToEarn && (
          <p className="text-xs text-gray-600 mt-2 line-clamp-2">{howToEarn}</p>
        )}
        <div className="flex gap-2 mt-3">
          {canPin && onPin && (
            <button
              type="button"
              onClick={onPin}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              Pin to profile
            </button>
          )}
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              className="text-xs font-medium text-gray-600 hover:text-gray-800"
            >
              Share
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
