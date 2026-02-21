'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface LevelBadgeProps {
  level: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LEVEL_COLORS: Record<number, string> = {
  1: 'bg-gray-100 text-gray-800 border-gray-300',
  2: 'bg-slate-100 text-slate-800 border-slate-300',
  3: 'bg-blue-100 text-blue-800 border-blue-300',
  4: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  5: 'bg-violet-100 text-violet-800 border-violet-300',
  6: 'bg-purple-100 text-purple-800 border-purple-300',
  7: 'bg-amber-100 text-amber-800 border-amber-300',
  8: 'bg-orange-100 text-orange-800 border-orange-300',
  9: 'bg-rose-100 text-rose-800 border-rose-300',
  10: 'bg-emerald-100 text-emerald-800 border-emerald-300',
};

export function LevelBadge({ level, label, size = 'md', className }: LevelBadgeProps) {
  const color = LEVEL_COLORS[Math.min(Math.max(level, 1), 10)] ?? LEVEL_COLORS[1];
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-semibold border',
        color,
        sizes[size],
        className
      )}
    >
      Level {level}
      {label ? ` — ${label}` : ''}
    </span>
  );
}
