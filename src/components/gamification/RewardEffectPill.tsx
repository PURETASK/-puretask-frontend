'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface RewardEffectPillProps {
  /** Short effect label, e.g. "Visibility +15%" or "Early exposure +10 min" */
  label: string;
  variant?: 'default' | 'success' | 'highlight';
  className?: string;
}

export function RewardEffectPill({ label, variant = 'default', className }: RewardEffectPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'success' && 'bg-green-100 text-green-800',
        variant === 'highlight' && 'bg-amber-100 text-amber-800',
        variant === 'default' && 'bg-blue-100 text-blue-800',
        className
      )}
    >
      {label}
    </span>
  );
}
