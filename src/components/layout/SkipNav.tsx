'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function SkipNav() {
  return (
    <a
      href="#main-content"
      className={cn(
        'sr-only focus:not-sr-only',
        'focus:absolute focus:top-4 focus:left-4 focus:z-50',
        'focus:px-4 focus:py-2',
        'focus:bg-blue-600 focus:text-white',
        'focus:rounded-lg focus:shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600'
      )}
    >
      Skip to main content
    </a>
  );
}
