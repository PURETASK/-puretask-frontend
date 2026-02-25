'use client';

import { useEffect } from 'react';

const BASE_TITLE = 'PureTask';

/**
 * Set document title for the current page. Resets to BASE_TITLE on unmount.
 */
export function usePageTitle(title: string | null) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [title]);
}
