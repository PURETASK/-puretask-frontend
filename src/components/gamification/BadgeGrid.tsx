'use client';

import React from 'react';
import { BadgeCard } from './BadgeCard';
import type { BadgeCardProps } from './BadgeCard';
import { Stagger } from '@/components/motion/Stagger';
import { cn } from '@/lib/utils';

export interface BadgeGridProps {
  badges: BadgeCardProps[];
  columns?: 2 | 3 | 4;
  emptyMessage?: string;
  className?: string;
}

export function BadgeGrid({
  badges,
  columns = 4,
  emptyMessage = 'No badges yet.',
  className,
}: BadgeGridProps) {
  if (badges.length === 0) {
    return (
      <div
        className={cn(
          'rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500',
          className
        )}
      >
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <Stagger
      className={cn(
        'grid gap-4',
        columns === 2 && 'grid-cols-1 sm:grid-cols-2',
        columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
        className
      )}
    >
      {badges.map((badge) => (
        <BadgeCard key={badge.id} {...badge} />
      ))}
    </Stagger>
  );
}
