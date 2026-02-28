'use client';

import React, { useEffect, useState } from 'react';
import { useSpring, motion } from 'motion/react';
import { motionTokens } from '@/components/motion/tokens';
import { cn } from '@/lib/utils';

export interface CreditsCounterProps {
  value: number;
  suffix?: string;
  className?: string;
}

/**
 * Displays a number that counts up from 0 to value on mount (and when value changes).
 */
export function CreditsCounter({
  value,
  suffix = ' credits',
  className,
}: CreditsCounterProps) {
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsub = spring.on('change', (v) => setDisplay(Math.round(v)));
    return () => unsub();
  }, [spring]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.duration.fast, ease: motionTokens.ease.out }}
      className={cn('tabular-nums', className)}
    >
      {display}
      {suffix}
    </motion.span>
  );
}
