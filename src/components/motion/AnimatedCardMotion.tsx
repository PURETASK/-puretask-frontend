'use client';

import { motion } from 'motion/react';
import { motionTokens } from './tokens';
import type { ReactNode } from 'react';

interface AnimatedCardMotionProps {
  children: ReactNode;
  className?: string;
  /** Disable hover/press (e.g. when card is not clickable) */
  interactive?: boolean;
}

/**
 * Wraps a card (or any clickable surface) with hover lift and press.
 * Use around job cards, cleaner cards, payment cards. Does not add Card styling.
 */
export function AnimatedCardMotion({
  children,
  className,
  interactive = true,
}: AnimatedCardMotionProps) {
  return (
    <motion.div
      whileHover={interactive ? motionTokens.hover.lift : undefined}
      whileTap={interactive ? motionTokens.hover.press : undefined}
      transition={motionTokens.spring.soft}
      className={className}
    >
      {children}
    </motion.div>
  );
}
