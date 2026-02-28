'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Lock, FileText, Hash, Shield } from 'lucide-react';

export type TrustBannerVariant = 'credits-held' | 'id' | 'receipt' | 'verified';

interface TrustBannerProps {
  variant: TrustBannerVariant;
  /** Main text (e.g. "12 credits held for this job") */
  label: string;
  /** Optional secondary (e.g. "Released when you approve") */
  sub?: string;
  /** Optional link href */
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

const iconMap = {
  'credits-held': Lock,
  id: Hash,
  receipt: FileText,
  verified: Shield,
};

export function TrustBanner({ variant, label, sub, href, className, children }: TrustBannerProps) {
  const Icon = iconMap[variant];
  const isWarning = variant === 'credits-held';

  const content = (
    <>
      <Icon
        className={cn(
          'h-4 w-4 flex-shrink-0',
          isWarning ? 'text-amber-600' : 'text-gray-500'
        )}
        aria-hidden
      />
      <div className="min-w-0">
        <p className={cn(
          'text-sm font-medium',
          isWarning ? 'text-amber-900' : 'text-gray-700'
        )}>
          {label}
        </p>
        {sub && (
          <p className={cn(
            'text-xs mt-0.5',
            isWarning ? 'text-amber-800' : 'text-gray-500'
          )}>
            {sub}
          </p>
        )}
      </div>
      {children}
    </>
  );

  const baseClass = cn(
    'flex items-start gap-3 rounded-xl border px-4 py-3',
    isWarning
      ? 'border-amber-200 bg-amber-50/80'
      : 'border-gray-200 bg-gray-50/80',
    className
  );

  if (href) {
    return (
      <a href={href} className={cn(baseClass, 'hover:opacity-90 transition-opacity')}>
        {content}
      </a>
    );
  }

  return (
    <div className={baseClass}>
      {content}
    </div>
  );
}
