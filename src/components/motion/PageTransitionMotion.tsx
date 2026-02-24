'use client';

import { motion } from 'framer-motion';
import { motionTokens } from './tokens';
import type { ReactNode } from 'react';

interface PageTransitionMotionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps page content with enter/exit animation (fade + vertical shift + blur).
 * Use on every top-level route or inside layout for consistent page transitions.
 */
export function PageTransitionMotion({ children, className }: PageTransitionMotionProps) {
  return (
    <motion.div
      initial={motionTokens.page.initial}
      animate={motionTokens.page.enter}
      exit={motionTokens.page.exit}
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
