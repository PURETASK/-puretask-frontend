/**
 * Analytics utilities
 * Supports Google Analytics and Plausible
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, any> }) => void;
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

/**
 * Track page view
 */
export function trackPageView(path: string, title?: string) {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
      page_path: path,
      page_title: title,
    });
  }

  // Plausible
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible('pageview', {
      props: { path, title },
    });
  }
}

/**
 * Track custom event
 */
export function trackEvent(event: AnalyticsEvent) {
  const { action, category, label, value, ...props } = event;

  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
      ...props,
    });
  }

  // Plausible
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(action, {
      props: {
        category,
        label,
        value,
        ...props,
      },
    });
  }
}

/**
 * Track conversion
 */
export function trackConversion(conversionId: string, value?: number) {
  trackEvent({
    action: 'conversion',
    category: 'engagement',
    label: conversionId,
    value,
  });
}

/**
 * Track user journey step
 */
export function trackJourneyStep(step: string, data?: Record<string, any>) {
  trackEvent({
    action: 'journey_step',
    category: 'user_journey',
    label: step,
    ...data,
  });
}
