'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface MetricExplainerModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Plain-English explanation of how the metric is calculated */
  description: string;
  /** Optional "What counts" bullets */
  whatCounts?: string[];
  /** Optional "What doesn't count" bullets */
  whatDoesntCount?: string[];
  className?: string;
}

export function MetricExplainerModal({
  open,
  onClose,
  title,
  description,
  whatCounts,
  whatDoesntCount,
  className,
}: MetricExplainerModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="metric-explainer-title"
    >
      <div
        className={cn('bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto', className)}
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 shadow-none">
          <CardContent className="p-6">
            <h2 id="metric-explainer-title" className="text-lg font-semibold text-gray-900 mb-3">
              {title}
            </h2>
            <p className="text-sm text-gray-600 mb-4">{description}</p>
            {whatCounts && whatCounts.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">What counts</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {whatCounts.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {whatDoesntCount && whatDoesntCount.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">What doesn’t count</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {whatDoesntCount.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <Button variant="primary" onClick={onClose}>
              Got it
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
