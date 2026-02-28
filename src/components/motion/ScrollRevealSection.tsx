'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { motionTokens } from '@/components/motion/tokens';
import { cn } from '@/lib/utils';

export interface ScrollRevealSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}

/**
 * Reveals children when they enter the viewport: fade in + slide up.
 */
export function ScrollRevealSection({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
}: ScrollRevealSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.15, once });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y }
      }
      transition={{
        duration: motionTokens.duration.slow,
        ease: motionTokens.ease.out,
        delay,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export interface ScrollRevealItemProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
  staggerDelay?: number;
}

export function ScrollRevealItem({
  children,
  className,
  index = 0,
  staggerDelay = 0.08,
}: ScrollRevealItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2, once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 16 }
      }
      transition={{
        duration: motionTokens.duration.base,
        ease: motionTokens.ease.out,
        delay: index * staggerDelay,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
