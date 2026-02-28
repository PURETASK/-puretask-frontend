'use client';

import React from 'react';
import { motion } from 'motion/react';
import { AnimatedCheckRow } from './AnimatedCheckRow';
import { motionTokens } from '@/components/motion/tokens';
import { cn } from '@/lib/utils';

export interface BookingConfirmationProps {
  title?: string;
  steps: string[];
  onDone?: () => void;
  doneLabel?: string;
  className?: string;
}

export function BookingConfirmation({
  title = "You're all set",
  steps,
  onDone,
  doneLabel = 'View booking',
  className,
}: BookingConfirmationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionTokens.duration.base, ease: motionTokens.ease.out }}
      className={cn('rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-8', className)}
    >
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionTokens.duration.base, ease: motionTokens.ease.out }}
        className="text-xl font-semibold text-gray-900 dark:text-white mb-6"
      >
        {title}
      </motion.h2>
      <div className="space-y-4">
        {steps.map((label, i) => (
          <AnimatedCheckRow key={label} label={label} index={i} />
        ))}
      </div>
      {onDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: steps.length * 0.15 + 0.2 }}
          className="mt-8"
        >
          <button
            type="button"
            onClick={onDone}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {doneLabel}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
