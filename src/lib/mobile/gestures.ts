/**
 * Mobile Gesture Utilities
 * Swipe detection and gesture handling
 */

export interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
}

export interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipe?: (direction: SwipeDirection) => void;
  threshold?: number; // Minimum distance in pixels (default: 50)
  velocityThreshold?: number; // Minimum velocity (default: 0.3)
}

/**
 * Setup swipe gesture detection on an element
 */
export function setupSwipeGesture(
  element: HTMLElement,
  handlers: SwipeHandlers
): () => void {
  const threshold = handlers.threshold || 50;
  const velocityThreshold = handlers.velocityThreshold || 0.3;
  
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let isTracking = false;

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startTime = Date.now();
    isTracking = true;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isTracking) return;
    e.preventDefault(); // Prevent scrolling during swipe
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isTracking) return;
    isTracking = false;

    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const endTime = Date.now();

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const deltaTime = endTime - startTime;

    const distanceX = Math.abs(deltaX);
    const distanceY = Math.abs(deltaY);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    // Determine primary direction
    if (distance < threshold || velocity < velocityThreshold) {
      return; // Not a valid swipe
    }

    const direction: SwipeDirection['direction'] =
      distanceX > distanceY
        ? deltaX > 0
          ? 'right'
          : 'left'
        : deltaY > 0
        ? 'down'
        : 'up';

    const swipeData: SwipeDirection = {
      direction,
      distance,
      velocity,
    };

    // Call general swipe handler
    if (handlers.onSwipe) {
      handlers.onSwipe(swipeData);
    }

    // Call specific direction handlers
    switch (direction) {
      case 'left':
        if (handlers.onSwipeLeft) handlers.onSwipeLeft();
        break;
      case 'right':
        if (handlers.onSwipeRight) handlers.onSwipeRight();
        break;
      case 'up':
        if (handlers.onSwipeUp) handlers.onSwipeUp();
        break;
      case 'down':
        if (handlers.onSwipeDown) handlers.onSwipeDown();
        break;
    }
  };

  element.addEventListener('touchstart', handleTouchStart, { passive: false });
  element.addEventListener('touchmove', handleTouchMove, { passive: false });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });

  // Cleanup function
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchmove', handleTouchMove);
    element.removeEventListener('touchend', handleTouchEnd);
  };
}

/**
 * React hook for swipe gestures
 * Note: This should be imported from hooks/useSwipeGesture.ts
 */
