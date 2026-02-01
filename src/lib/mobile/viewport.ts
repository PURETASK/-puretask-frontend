/**
 * Viewport Utilities
 * Helpers for mobile viewport and screen size detection
 */

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Check if device is tablet
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

/**
 * Check if device is desktop
 */
export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
}

/**
 * Get current viewport width
 */
export function getViewportWidth(): number {
  if (typeof window === 'undefined') return 0;
  return window.innerWidth;
}

/**
 * Get current viewport height
 */
export function getViewportHeight(): number {
  if (typeof window === 'undefined') return 0;
  return window.innerHeight;
}

/**
 * Check if device supports touch
 */
export function supportsTouch(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get device pixel ratio
 */
export function getDevicePixelRatio(): number {
  if (typeof window === 'undefined') return 1;
  return window.devicePixelRatio || 1;
}
