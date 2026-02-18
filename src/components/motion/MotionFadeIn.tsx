'use client';

import { motion } from 'framer-motion';

interface MotionFadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function MotionFadeIn({ children, className, delay = 0 }: MotionFadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
