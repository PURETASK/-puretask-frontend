'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { motionTokens } from '@/components/motion/tokens';
import { cn } from '@/lib/utils';

export interface AchievementToastProps {
  /** Title, e.g. "Reward earned!" or "Badge unlocked" */
  title: string;
  /** Item name, e.g. "Priority Visibility" or "On-Time Pro" */
  itemName: string;
  /** Optional emoji or icon */
  icon?: string;
  /** Optional short description */
  description?: string;
  variant?: 'reward' | 'badge';
  className?: string;
}

export function AchievementToast({
  title,
  itemName,
  icon,
  description,
  variant = 'reward',
  className,
}: AchievementToastProps) {
  const defaultIcon = variant === 'badge' ? '🏅' : '🎁';
  const displayIcon = icon ?? defaultIcon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 24, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: motionTokens.duration.base, ease: motionTokens.ease.out }}
      className={cn(
        'flex items-start gap-3 rounded-lg border bg-white p-4 shadow-lg',
        variant === 'badge' && 'border-amber-200',
        variant === 'reward' && 'border-blue-200',
        className
      )}
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.05 }}
        className="text-2xl flex-shrink-0"
      >
        {displayIcon}
      </motion.span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-700 mt-0.5">{itemName}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
