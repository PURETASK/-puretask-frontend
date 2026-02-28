'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { motionTokens } from '@/components/motion/tokens';

/**
 * Wraps page content with enter animation on route change (fade + slide + blur).
 * Use in root layout so every navigation gets a consistent transition.
 */
export function ClientPageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname ?? 'default'}
      initial={motionTokens.page.initial}
      animate={motionTokens.page.enter}
      transition={{
        duration: motionTokens.duration.base,
        ease: motionTokens.ease.out,
      }}
      className="min-h-full"
    >
      {children}
    </motion.div>
  );
}
