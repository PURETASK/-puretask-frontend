'use client';

import { useState, useEffect } from 'react';
import { isMobile, isTablet, isDesktop, supportsTouch, getViewportWidth, getViewportHeight } from '@/lib/mobile/viewport';

/**
 * Hook for mobile viewport detection and responsive behavior
 */
export function useMobile() {
  const [mobile, setMobile] = useState(false);
  const [tablet, setTablet] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [touch, setTouch] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateViewport = () => {
      setMobile(isMobile());
      setTablet(isTablet());
      setDesktop(isDesktop());
      setTouch(supportsTouch());
      setWidth(getViewportWidth());
      setHeight(getViewportHeight());
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  return {
    mobile,
    tablet,
    desktop,
    touch,
    width,
    height,
  };
}
