'use client';

import React from 'react';
import { motion } from 'motion/react';
import { motionTokens } from '@/components/motion/tokens';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AnimatedCheckRowProps {
  label: string;
  index: number;
  className?: string;
}

export function AnimatedCheckRow({ label, index, className }: AnimatedCheckRowProps) {
  const delay = index * 0.15;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: motionTokens.duration.base,
        delay,
        ease: motionTokens.ease.out,
      }}
      className={cn('flex items-center gap-3', className)}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 20,
          delay: delay + 0.05,
        }}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-white"
      >
        <Check className="h-4 w-4" strokeWidth={2.5} />
      </motion.div>
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
    </motion.div>
  );
}
