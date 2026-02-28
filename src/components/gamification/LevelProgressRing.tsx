'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';
import { motionTokens } from '@/components/motion/tokens';
import { cn } from '@/lib/utils';

export interface LevelProgressRingProps {
  percentage: number;
  currentLevel: number;
  nextLevel?: number;
  size?: number;
  strokeWidth?: number;
  /** Animate ring draw and count-up on mount */
  animate?: boolean;
  className?: string;
}

export function LevelProgressRing({
  percentage,
  currentLevel,
  nextLevel = currentLevel + 1,
  size = 120,
  strokeWidth = 8,
  animate = true,
  className,
}: LevelProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const springProgress = useSpring(animate ? 0 : percentage, { stiffness: 60, damping: 20 });
  const [displayPct, setDisplayPct] = useState(animate ? 0 : Math.round(percentage));

  useEffect(() => {
    springProgress.set(percentage);
  }, [percentage, springProgress]);

  useEffect(() => {
    if (!animate) return;
    const unsub = springProgress.on('change', (v) => setDisplayPct(Math.round(v)));
    return () => unsub();
  }, [springProgress, animate]);

  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.95 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: motionTokens.duration.base, ease: motionTokens.ease.out }}
      className={cn('relative flex flex-col items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
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
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-blue-600"
          strokeDasharray={circumference}
          initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset: dashOffset }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.8, ease: motionTokens.ease.out }}
        />
      </svg>
      <div className="relative flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold text-gray-900 tabular-nums">{animate ? displayPct : Math.round(percentage)}%</span>
        <span className="text-xs text-gray-500">to Level {nextLevel}</span>
      </div>
    </motion.div>
  );
}
