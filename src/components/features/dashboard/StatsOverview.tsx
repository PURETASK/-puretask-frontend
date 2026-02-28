'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  accent?: 'blue' | 'green' | 'purple' | 'amber';
  href?: string;
}

interface StatsOverviewProps {
  stats: StatItem[];
}

const accentBorder: Record<string, string> = {
  blue: 'border-l-4 border-l-[var(--brand-blue)]',
  green: 'border-l-4 border-l-[var(--brand-mint)]',
  purple: 'border-l-4 border-l-purple-500',
  amber: 'border-l-4 border-l-amber-500',
};

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const content = (
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{stat.value}</p>
            </div>
            <div className={cn('flex-shrink-0', stat.color || 'text-[var(--brand-blue)]')}>{stat.icon}</div>
          </div>
        );
        const cardClass = cn(
          'transition-all duration-200',
          stat.accent ? accentBorder[stat.accent] : undefined,
          stat.href && 'card-interactive cursor-pointer'
        );
        if (stat.href) {
          return (
            <Link key={idx} href={stat.href}>
              <Card className={cardClass}>
                <CardContent className="p-6">{content}</CardContent>
              </Card>
            </Link>
          );
        }
        return (
          <Card key={idx} className={cardClass}>
            <CardContent className="p-6">{content}</CardContent>
          </Card>
        );
      })}
    </div>
  );
}
