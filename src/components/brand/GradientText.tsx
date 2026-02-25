import React from 'react';
import { BRAND } from '@/lib/brand';

export function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="bg-clip-text text-transparent"
      style={{
        backgroundImage: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.aqua})`,
      }}
    >
      {children}
    </span>
  );
}
