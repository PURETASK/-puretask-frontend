'use client';

import { usePathname } from 'next/navigation';
import { PageTransitionMotion } from '@/components/motion/PageTransitionMotion';

/**
 * Wraps all page content with consistent enter animation (fade + slide + blur).
 * Re-mounts on route change so each page gets the transition.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <PageTransitionMotion key={pathname}>
      {children}
    </PageTransitionMotion>
  );
}
