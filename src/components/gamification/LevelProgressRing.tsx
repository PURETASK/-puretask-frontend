'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface LevelProgressRingProps {
  /** Progress to next level, 0–100 */
  percentage: number;
  /** Current level number */
  currentLevel: number;
  /** Next level number (default currentLevel + 1) */
  nextLevel?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function LevelProgressRing({
  percentage,
  currentLevel,
  nextLevel = currentLevel + 1,
  size = 120,
  strokeWidth = 8,
  className,
}: LevelProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative flex flex-col items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90 absolute inset-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-blue-600 transition-all duration-500"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="relative flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-gray-900">{Math.round(percentage)}%</span>
        <span className="text-xs text-gray-500">to Level {nextLevel}</span>
      </div>
    </div>
  );
}
