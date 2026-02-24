'use client';

import { motion } from 'framer-motion';
import { motionTokens } from './tokens';
import type { ReactNode } from 'react';

interface StaggerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Container that staggers children with a slight delay. Use for lists of cards/rows.
 */
export function Stagger({ children, className }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: motionTokens.stagger.staggerChildren,
            delayChildren: motionTokens.stagger.delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps each item in a Stagger list. Item fades in and slides up with blur reduction.
 */
export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={motionTokens.listItem}
      transition={{
        duration: motionTokens.duration.base,
        ease: motionTokens.ease.out,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
