'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { ReliabilityBreakdown } from '@/types/reliability';

interface ReliabilityBreakdownBarsProps {
  breakdown: ReliabilityBreakdown;
  className?: string;
}

const LABELS: Record<keyof ReliabilityBreakdown, string> = {
  onTimePct: 'On-time',
  completionPct: 'Completion',
  cancellationPct: 'Low cancellation', // inverted: higher bar = lower cancel rate = better
  communicationPct: 'Communication',
  qualityPct: 'Quality',
};

export function ReliabilityBreakdownBars({ breakdown, className }: ReliabilityBreakdownBarsProps) {
  const items = (
    Object.entries(breakdown) as [keyof ReliabilityBreakdown, number][]
  ).map(([key, value]) => {
    // Cancellation: lower is better, so we invert for display (100 - value = "reliability")
    const displayValue = key === 'cancellationPct' ? 100 - value : value;
    return { key, label: LABELS[key], value: displayValue, isInverted: key === 'cancellationPct' };
  });

  return (
    <div className={cn('space-y-3', className)}>
      {items.map(({ key, label, value }) => (
        <div key={key} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium text-gray-900">
              {key === 'cancellationPct' ? `${100 - value}%` : `${value}%`}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                value >= 90 && 'bg-green-500',
                value >= 70 && value < 90 && 'bg-blue-500',
                value >= 50 && value < 70 && 'bg-amber-500',
                value < 50 && 'bg-red-500'
              )}
              style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
