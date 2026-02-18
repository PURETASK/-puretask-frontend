'use client';

import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';
import type { ReliabilityScore } from '@/types/reliability';
import { Info } from 'lucide-react';

interface ReliabilityScoreCardProps {
  score: ReliabilityScore;
  compact?: boolean;
  showBreakdown?: boolean;
  className?: string;
}

const TIER_COLORS: Record<string, string> = {
  Excellent: 'bg-green-100 text-green-800 border-green-200',
  Good: 'bg-blue-100 text-blue-800 border-blue-200',
  Watch: 'bg-amber-100 text-amber-800 border-amber-200',
  Risk: 'bg-red-100 text-red-800 border-red-200',
};

export function ReliabilityScoreCard({
  score,
  compact = false,
  showBreakdown = false,
  className,
}: ReliabilityScoreCardProps) {
  const tierColor = TIER_COLORS[score.tier] || TIER_COLORS.Good;

  return (
    <div
      className={cn(
        'rounded-lg border bg-white p-4',
        compact ? 'border-gray-200' : 'border-gray-200 shadow-sm',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-gray-900">{score.score}</span>
            <span className="text-sm text-gray-500">/ 100</span>
            <Tooltip.Provider delayDuration={200}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    className="rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    aria-label="How reliability is calculated"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="max-w-xs rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg"
                    sideOffset={5}
                  >
                    Based on on-time %, completion rate, cancellation rate (lower is better),
                    communication, and quality scores. Updated from verified job data.
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
          <span
            className={cn(
              'mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium',
              tierColor
            )}
          >
            {score.tier}
          </span>
        </div>
        <div className="text-right text-xs text-gray-500">
          Updated {new Date(score.lastUpdatedISO).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
