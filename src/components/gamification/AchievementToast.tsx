'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface AchievementToastProps {
  /** Title, e.g. "Reward earned!" or "Badge unlocked" */
  title: string;
  /** Item name, e.g. "Priority Visibility" or "On-Time Pro" */
  itemName: string;
  /** Optional emoji or icon */
  icon?: string;
  /** Optional short description */
  description?: string;
  variant?: 'reward' | 'badge';
  className?: string;
}

/**
 * Presentational component for an achievement (reward or badge) toast.
 * Use with your toast context: showToast(<AchievementToast ... />) or
 * pass title/itemName to showToast and render this in your Toast component for type "achievement".
 */
export function AchievementToast({
  title,
  itemName,
  icon,
  description,
  variant = 'reward',
  className,
}: AchievementToastProps) {
  const defaultIcon = variant === 'badge' ? '🏅' : '🎁';
  const displayIcon = icon ?? defaultIcon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border bg-white p-4 shadow-lg',
        variant === 'badge' && 'border-amber-200',
        variant === 'reward' && 'border-blue-200',
        className
      )}
    >
      <span className="text-2xl flex-shrink-0">{displayIcon}</span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-700 mt-0.5">{itemName}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
