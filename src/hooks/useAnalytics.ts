'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, trackEvent, AnalyticsEvent } from '@/lib/analytics';

/**
 * Hook to automatically track page views
 */
export function useAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);
}

/**
 * Hook to track events
 */
export function useTrackEvent() {
  return {
    track: (event: AnalyticsEvent) => trackEvent(event),
    trackConversion: (id: string, value?: number) => {
      trackEvent({
        action: 'conversion',
        category: 'engagement',
        label: id,
        value,
      });
    },
    trackJourney: (step: string, data?: Record<string, any>) => {
      trackEvent({
        action: 'journey_step',
        category: 'user_journey',
        label: step,
        ...data,
      });
    },
  };
}
