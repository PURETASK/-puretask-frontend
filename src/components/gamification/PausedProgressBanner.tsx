'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface PausedProgressBannerProps {
  reason: string;
  recoverySteps?: string[];
  onSeeWhatCounts?: () => void;
  onContactSupport?: () => void;
  onViewDisputeHistory?: () => void;
  onViewMyStats?: () => void;
  className?: string;
}

export function PausedProgressBanner({
  reason,
  recoverySteps,
  onSeeWhatCounts,
  onContactSupport,
  onViewDisputeHistory,
  onViewMyStats,
  className,
}: PausedProgressBannerProps) {
  return (
    <Card className={cn('border-amber-200 bg-amber-50', className)}>
      <CardContent className="p-4">
        <p className="font-semibold text-amber-900">
          Progress paused because: {reason}
        </p>
        {recoverySteps && recoverySteps.length > 0 && (
          <ul className="mt-2 list-disc list-inside text-sm text-amber-800">
            {recoverySteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          {onSeeWhatCounts && (
            <Button variant="outline" size="sm" onClick={onSeeWhatCounts}>
              See What Counts
            </Button>
          )}
          {onContactSupport && (
            <Button variant="outline" size="sm" onClick={onContactSupport}>
              Contact Support
            </Button>
          )}
          {onViewDisputeHistory && (
            <Button variant="ghost" size="sm" onClick={onViewDisputeHistory}>
              View Dispute History
            </Button>
          )}
          {onViewMyStats && (
            <Button variant="secondary" size="sm" onClick={onViewMyStats}>
              View My Stats
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
