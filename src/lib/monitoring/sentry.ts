/**
 * Sentry Error Tracking Setup
 * Initialize Sentry for production error tracking
 */

export function initSentry() {
  if (typeof window === 'undefined') return;

  // Only initialize in production
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    console.warn('Sentry DSN not found. Error tracking disabled.');
    return;
  }

  // Dynamic import to avoid bundling Sentry in development
  import('@sentry/nextjs').then((Sentry) => {
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1, // 10% of transactions
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay(),
      ],
    });
  }).catch((error) => {
    console.error('Failed to initialize Sentry:', error);
  });
}

/**
 * Capture exception manually
 */
export async function captureException(error: Error, context?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  try {
    const Sentry = await import('@sentry/nextjs');
    Sentry.captureException(error, { extra: context });
  } catch {
    // Sentry not available
  }
}

/**
 * Set user context
 */
export async function setSentryUser(userId: string, email?: string, role?: string) {
  if (typeof window === 'undefined') return;

  try {
    const Sentry = await import('@sentry/nextjs');
    Sentry.setUser({ id: userId, email, role });
  } catch {
    // Sentry not available
  }
}
