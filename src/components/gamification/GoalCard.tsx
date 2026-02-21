'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface GoalCardProps {
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
  className?: string;
}

export function GoalCard({
  id,
  title,
  progress,
  target,
  countsWhen,
  rewardPreview,
  detailHref,
  actionHref,
  onSelectReward,
  hasChoiceReward,
  className,
}: GoalCardProps) {
  const pct = target > 0 ? Math.min((progress / target) * 100, 100) : 0;
  return (
    <Card className={cn('', className)}>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <Progress value={progress} max={target} showLabel size="sm" className="mb-2" />
        {countsWhen && (
          <p className="text-xs text-gray-500 mb-2">Counts when: {countsWhen}</p>
        )}
        {rewardPreview && (
          <p className="text-xs text-blue-600 mb-3">{rewardPreview}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Link
            href={detailHref}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View Details
          </Link>
          {actionHref && (
            <Link
              href={actionHref}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Take Action
            </Link>
          )}
          {hasChoiceReward && onSelectReward && (
            <Button variant="secondary" size="sm" onClick={onSelectReward}>
              Select Reward
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
