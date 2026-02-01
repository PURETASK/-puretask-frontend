'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface LazyComponentProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  fallback?: React.ReactNode;
}

/**
 * Lazy load component - only renders when visible
 */
export function LazyComponent({
  children,
  className,
  threshold = 0.1,
  rootMargin = '50px',
  fallback,
}: LazyComponentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasBeenVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return (
    <div ref={ref} className={cn(className)}>
      {hasBeenVisible ? children : fallback || <div className="h-32 bg-gray-100 animate-pulse rounded" />}
    </div>
  );
}
