'use client';

import React, { useState } from 'react';
import Script from 'next/script';

export const LOTTIE_URLS = {
  success: 'https://lottie.host/25439f8d-fa10-49e5-a6f0-8d977f320468/3jG1F9Rhyd.lottie',
  booking: 'https://lottie.host/6cf56853-17b2-4f3b-b73c-96f43de9e8e8/mBdI4j6nXv.lottie',
  fiveStarReview: 'https://lottie.host/9b2c5082-b490-424e-95b1-53f2421ccd54/dcNV7V35uv.lottie',
} as const;

const SCRIPT_URL = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.11/dist/dotlottie-wc.js';

export interface LottieSuccessProps {
  src?: string;
  width?: number;
  height?: number;
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-wc': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          autoplay?: boolean;
          loop?: boolean;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

export function LottieSuccess({
  src = LOTTIE_URLS.success,
  width = 300,
  height = 300,
  autoplay = true,
  loop = true,
  className = '',
}: LottieSuccessProps) {
  const [isReady, setIsReady] = useState(false);

  return (
    <>
      <Script
        src={SCRIPT_URL}
        type="module"
        onLoad={() => setIsReady(true)}
        strategy="afterInteractive"
      />
      {isReady && React.createElement('dotlottie-wc', {
        src,
        autoplay,
        loop,
        style: { width, height },
        className,
      })}
    </>
  );
}
