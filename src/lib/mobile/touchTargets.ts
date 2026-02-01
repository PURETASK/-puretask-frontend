/**
 * Mobile Touch Target Utilities
 * Ensures all interactive elements meet minimum touch target sizes
 * 
 * iOS HIG: 44x44 points minimum
 * Material Design: 48x48 dp minimum
 * We use 44px as the minimum for cross-platform compatibility
 */

export const TOUCH_TARGET_MIN = 44; // pixels
export const TOUCH_TARGET_OPTIMAL = 48; // pixels

/**
 * Tailwind classes for touch targets
 */
export const touchTargetClasses = {
  min: 'min-h-[44px] min-w-[44px]',
  optimal: 'min-h-[48px] min-w-[48px]',
  padding: 'p-3', // Ensures 44px minimum with padding
};

/**
 * Check if element meets touch target requirements
 */
export function meetsTouchTarget(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width >= TOUCH_TARGET_MIN && rect.height >= TOUCH_TARGET_MIN;
}

/**
 * Get touch target size for an element
 */
export function getTouchTargetSize(element: HTMLElement): { width: number; height: number } {
  const rect = element.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}
