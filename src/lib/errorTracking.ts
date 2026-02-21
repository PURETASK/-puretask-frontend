/**
 * Error tracking utilities
 * Integrates with Sentry or other error tracking services
 */

export interface ErrorContext {
  userId?: string;
  userRole?: string;
  path?: string;
  [key: string]: any;
}

/**
 * Initialize error tracking (call this in app initialization)
 */
export function initErrorTracking() {
  if (typeof window === 'undefined') return;

  // Sentry initialization would go here
  // import * as Sentry from '@sentry/nextjs';
  // Sentry.init({...});

  // For now, we'll use console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Error tracking initialized (development mode)');
  }
}

/**
 * Capture exception
 */
export function captureException(error: Error, context?: ErrorContext) {
  if (typeof window === 'undefined') return;

  // Sentry.captureException(error, { extra: context });
  
  // Fallback to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Exception captured:', error, context);
  }
}

/**
 * Capture message
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext) {
  if (typeof window === 'undefined') return;

  // Sentry.captureMessage(message, { level, extra: context });
  
  // Fallback to console in development
  if (process.env.NODE_ENV === 'development') {
    const method = level === 'warning' ? 'warn' : level;
    (console as unknown as Record<string, (...args: unknown[]) => void>)[method]('Message captured:', message, context);
  }
}

/**
 * Set user context
 */
export function setUserContext(userId: string, userRole?: string, email?: string) {
  if (typeof window === 'undefined') return;

  // Sentry.setUser({ id: userId, role: userRole, email });
  
  if (process.env.NODE_ENV === 'development') {
    console.log('User context set:', { userId, userRole, email });
  }
}

/**
 * Clear user context (on logout)
 */
export function clearUserContext() {
  if (typeof window === 'undefined') return;

  // Sentry.setUser(null);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('User context cleared');
  }
}
