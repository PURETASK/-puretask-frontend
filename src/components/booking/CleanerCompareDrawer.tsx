'use client';

import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/Sheet';
import { ReliabilityScoreCard } from '@/components/reliability/ReliabilityScoreCard';
import { ReliabilityBreakdownBars } from '@/components/reliability/ReliabilityBreakdownBars';
import { ReliabilityWhyThisMatch } from '@/components/reliability/ReliabilityWhyThisMatch';
import { formatCurrency } from '@/lib/utils';

interface CleanerOption {
  id: string;
  name: string;
  rating?: number;
  price_per_hour?: number;
  reliability?: {
    score: number;
    tier: string;
    breakdown: { onTimePct: number; completionPct: number; cancellationPct: number; communicationPct: number; qualityPct: number };
    explainers: string[];
    lastUpdatedISO: string;
  };
}

interface CleanerCompareDrawerProps {
  cleaners: CleanerOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CleanerCompareDrawer({
  cleaners,
  open,
  onOpenChange,
}: CleanerCompareDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        title="Compare cleaners"
        description="Reliability, price, and availability"
        side="right"
      >
        <div className="space-y-6">
          {cleaners.map((c) => (
            <div key={c.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-gray-900">{c.name}</h4>
                <span className="text-sm font-medium">{formatCurrency(c.price_per_hour ?? 0)}/hr</span>
              </div>
              {c.reliability && (
                <>
                  <ReliabilityScoreCard score={c.reliability as import('@/types/reliability').ReliabilityScore} compact />
                  <ReliabilityBreakdownBars breakdown={c.reliability.breakdown} />
                  {c.reliability.explainers?.length > 0 && (
                    <ReliabilityWhyThisMatch explainers={c.reliability.explainers} />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
