'use client';

import { useRef, useEffect } from 'react';
import { setupSwipeGesture, SwipeHandlers } from '@/lib/mobile/gestures';

/**
 * React hook for swipe gestures
 */
export function useSwipeGesture(handlers: SwipeHandlers) {
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const cleanup = setupSwipeGesture(elementRef.current, handlers);
    return cleanup;
  }, [
    handlers.onSwipe,
    handlers.onSwipeLeft,
    handlers.onSwipeRight,
    handlers.onSwipeUp,
    handlers.onSwipeDown,
    handlers.threshold,
    handlers.velocityThreshold,
  ]);

  return elementRef;
}
