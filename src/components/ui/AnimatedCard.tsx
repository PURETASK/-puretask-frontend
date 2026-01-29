'use client';

import React from 'react';
import { Card, CardProps } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends CardProps {
  animation?: 'fade-in' | 'fade-in-up' | 'scale-in' | 'slide-in-right';
  delay?: number;
}

export function AnimatedCard({
  animation = 'fade-in-up',
  delay = 0,
  className,
  children,
  ...props
}: AnimatedCardProps) {
  const animationClass = `animate-${animation}`;
  const style = delay > 0 ? { animationDelay: `${delay}ms` } : undefined;

  return (
    <Card
      className={cn(animationClass, className)}
      style={style}
      {...props}
    >
      {children}
    </Card>
  );
}
