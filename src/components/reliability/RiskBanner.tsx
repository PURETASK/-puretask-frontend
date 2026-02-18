'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';
import type { RiskType } from './RiskBadge';

const RISK_CONFIG: Record<
  RiskType,
  { label: string; message: string; action: string; className: string }
> = {
  late: {
    label: 'Late arrival risk',
    message: 'This cleaner has had recent late arrivals. Consider upgrading to a higher reliability tier.',
    action: 'Switch to Gold+ or Reschedule',
    className: 'border-amber-200 bg-amber-50 text-amber-900',
  },
  cancellation: {
    label: 'Cancellation risk',
    message: 'Higher than average cancellation rate. We recommend having a backup plan.',
    action: 'Reschedule or Contact Support',
    className: 'border-amber-200 bg-amber-50 text-amber-900',
  },
  payment: {
    label: 'Payment attention needed',
    message: 'Verify your payment method or add credits to avoid service interruption.',
    action: 'Update Payment or Add Credits',
    className: 'border-red-200 bg-red-50 text-red-900',
  },
};

interface RiskBannerProps {
  type: RiskType;
  onMitigationClick?: () => void;
  className?: string;
}

export function RiskBanner({ type, onMitigationClick, className }: RiskBannerProps) {
  const config = RISK_CONFIG[type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4',
        config.className,
        className
      )}
    >
      <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold">{config.label}</h4>
        <p className="mt-1 text-sm opacity-90">{config.message}</p>
        {onMitigationClick && (
          <button
            type="button"
            onClick={onMitigationClick}
            className="mt-3 text-sm font-medium underline hover:no-underline"
          >
            {config.action} →
          </button>
        )}
      </div>
    </div>
  );
}
