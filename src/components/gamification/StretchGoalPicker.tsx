'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export interface StretchGoalOption {
  id: string;
  title: string;
  description?: string;
  progress?: number;
  target?: number;
}

export interface StretchGoalPickerProps {
  options: StretchGoalOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Minimum number to select (e.g. "choose at least 1") */
  minSelection?: number;
  title?: string;
  className?: string;
}

export function StretchGoalPicker({
  options,
  selectedId,
  onSelect,
  minSelection = 1,
  title = 'Stretch goals (choose at least one)',
  className,
}: StretchGoalPickerProps) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">
          Select one stretch goal to work toward for this level.
        </p>
        <div className="space-y-2">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelect(opt.id)}
                className={cn(
                  'w-full flex items-start gap-3 rounded-lg border-2 p-3 text-left transition-colors',
                  isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2',
                    isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'
                  )}
                >
                  {isSelected && <span className="text-white text-xs leading-none">✓</span>}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">{opt.title}</p>
                  {opt.description && (
                    <p className="text-sm text-gray-600 mt-0.5">{opt.description}</p>
                  )}
                  {typeof opt.progress === 'number' && typeof opt.target === 'number' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Progress: {opt.progress} / {opt.target}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
