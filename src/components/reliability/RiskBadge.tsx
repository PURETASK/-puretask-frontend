'use client';

import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

export type RiskType = 'late' | 'cancellation' | 'payment';

interface RiskBadgeProps {
  type: RiskType;
  className?: string;
}

const RISK_CONFIG: Record<
  RiskType,
  { label: string; tooltip: string; mitigation: string; className: string }
> = {
  late: {
    label: 'Late risk',
    tooltip: 'This cleaner has had recent late arrivals. Consider higher reliability tiers.',
    mitigation: 'Switch to Gold+ tier or reschedule',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  cancellation: {
    label: 'Cancel risk',
    tooltip: 'Higher cancellation rate than average. Book with backup options.',
    mitigation: 'Reschedule or contact support',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  payment: {
    label: 'Payment risk',
    tooltip: 'Payment or credit issue detected. Verify your payment method.',
    mitigation: 'Update payment method or add credits',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
};

export function RiskBadge({ type, className }: RiskBadgeProps) {
  const config = RISK_CONFIG[type];

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
              config.className,
              className
            )}
          >
            {config.label}
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="max-w-xs rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg"
            sideOffset={5}
          >
            <p>{config.tooltip}</p>
            <p className="mt-1 font-medium">Suggested: {config.mitigation}</p>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
