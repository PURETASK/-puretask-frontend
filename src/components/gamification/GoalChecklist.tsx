'use client';

import React from 'react';
import { GoalCard } from './GoalCard';
import { cn } from '@/lib/utils';

export interface GoalChecklistItem {
  id: string;
  title: string;
  progress: number;
  target: number;
  countsWhen?: string;
  rewardPreview?: string;
  detailHref: string;
  actionHref?: string;
  onSelectReward?: () => void;
  hasChoiceReward?: boolean;
  /** core | stretch | maintenance */
  type?: 'core' | 'stretch' | 'maintenance';
  completed?: boolean;
}

export interface GoalChecklistProps {
  /** List of goals to show (e.g. core goals for current level) */
  goals: GoalChecklistItem[];
  /** Compact checklist style (checkmarks + title) instead of full GoalCards */
  variant?: 'cards' | 'compact';
  /** Optional title above the list */
  title?: string;
  className?: string;
}

export function GoalChecklist({
  goals,
  variant = 'cards',
  title,
  className,
}: GoalChecklistProps) {
  if (goals.length === 0) {
    return (
      <div className={cn('rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500', className)}>
        <p className="text-sm">No goals in this section.</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      )}
      {variant === 'compact' ? (
        <ul className="space-y-2">
          {goals.map((g) => (
            <li key={g.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
              <span
                className={cn(
                  'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm',
                  (g.completed ?? g.progress >= g.target) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                )}
              >
                {(g.completed ?? g.progress >= g.target) ? '✓' : `${g.progress}/${g.target}`}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900">{g.title}</p>
                {g.countsWhen && (
                  <p className="text-xs text-gray-500 truncate">{g.countsWhen}</p>
                )}
              </div>
              <a
                href={g.detailHref}
                className="flex-shrink-0 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View
              </a>
            </li>
          ))}
        </ul>
      ) : (
        goals.map((g) => (
          <GoalCard
            key={g.id}
            id={g.id}
            title={g.title}
            progress={g.progress}
            target={g.target}
            countsWhen={g.countsWhen}
            rewardPreview={g.rewardPreview}
            detailHref={g.detailHref}
            actionHref={g.actionHref}
            onSelectReward={g.onSelectReward}
            hasChoiceReward={g.hasChoiceReward}
          />
        ))
      )}
    </div>
  );
}
