'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { ReliabilityScore } from '@/types/reliability';
import { Sparkles } from 'lucide-react';

interface ReliabilityWhyThisMatchProps {
  explainers: ReliabilityScore['explainers'];
  className?: string;
}

export function ReliabilityWhyThisMatch({ explainers, className }: ReliabilityWhyThisMatchProps) {
  if (!explainers?.length) return null;

  return (
    <div className={cn('rounded-lg border border-blue-200 bg-blue-50 p-4', className)}>
      <h4 className="mb-2 flex items-center gap-2 font-semibold text-blue-900">
        <Sparkles className="h-4 w-4" />
        Why this match
      </h4>
      <ul className="space-y-1.5 text-sm text-blue-800">
        {explainers.map((text, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-600">•</span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
