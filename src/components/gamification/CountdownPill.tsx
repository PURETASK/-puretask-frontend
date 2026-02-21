'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CountdownPillProps {
  daysRemaining: number;
  label?: string;
  variant?: 'default' | 'warning' | 'urgent';
  className?: string;
}

export function CountdownPill({
  daysRemaining,
  label = 'left',
  variant = 'default',
  className,
}: CountdownPillProps) {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    warning: 'bg-amber-100 text-amber-800',
    urgent: 'bg-red-100 text-red-800',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} {label}
    </span>
  );
}
