'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CountdownPill } from './CountdownPill';
import { cn } from '@/lib/utils';

export interface RewardCardProps {
  id: string;
  name: string;
  effect: string;
  appliesTo?: string;
  startDate?: string;
  endDate?: string;
  daysRemaining?: number;
  usageCount?: number;
  usageLimit?: number;
  onUseNow?: () => void;
  onSelect?: () => void;
  onViewHowItWorks?: () => void;
  onSeeEligibleJobs?: () => void;
  variant?: 'active' | 'earned' | 'locked';
  className?: string;
}

export function RewardCard({
  name,
  effect,
  appliesTo,
  startDate,
  endDate,
  daysRemaining,
  usageCount,
  usageLimit,
  onUseNow,
  onSelect,
  onViewHowItWorks,
  onSeeEligibleJobs,
  variant = 'active',
  className,
}: RewardCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-700 mt-1">{effect}</p>
        {appliesTo && (
          <p className="text-xs text-gray-500 mt-1">Applies to: {appliesTo}</p>
        )}
        {(startDate || endDate) && (
          <p className="text-xs text-gray-500 mt-1">
            {startDate && `From ${startDate}`}
            {endDate && ` until ${endDate}`}
          </p>
        )}
        {typeof daysRemaining === 'number' && daysRemaining >= 0 && (
          <CountdownPill daysRemaining={daysRemaining} className="mt-2" />
        )}
        {typeof usageCount === 'number' && typeof usageLimit === 'number' && (
          <p className="text-xs text-gray-500 mt-1">
            Uses: {usageCount} / {usageLimit}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          {onUseNow && variant === 'active' && (
            <Button variant="primary" size="sm" onClick={onUseNow}>
              Use Now
            </Button>
          )}
          {onSelect && (
            <Button variant="secondary" size="sm" onClick={onSelect}>
              Select This Reward
            </Button>
          )}
          {onViewHowItWorks && (
            <Button variant="ghost" size="sm" onClick={onViewHowItWorks}>
              View How It Works
            </Button>
          )}
          {onSeeEligibleJobs && (
            <Button variant="outline" size="sm" onClick={onSeeEligibleJobs}>
              See Eligible Jobs
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
