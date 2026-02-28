'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageShellProps {
  /** Page title (h1) */
  title: string;
  /** Optional short subtitle or context (e.g. "Booking ID: xyz") */
  subtitle?: string;
  /** Back link (e.g. { href: '/client/bookings', label: 'Back to Bookings' }) */
  back?: { href: string; label: string };
  /** Max width: 'content' (4xl) or 'wide' (7xl) */
  maxWidth?: 'content' | 'wide';
  children: React.ReactNode;
  className?: string;
}

export function PageShell({
  title,
  subtitle,
  back,
  maxWidth = 'wide',
  children,
  className,
}: PageShellProps) {
  return (
    <div className={cn('py-8 px-4 md:px-6', className)}>
      <div className={cn(
        'mx-auto',
        maxWidth === 'content' ? 'max-w-4xl' : 'max-w-7xl'
      )}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            {back && (
              <Link
                href={back.href}
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 mb-2 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                {back.label}
              </Link>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 mt-1 text-sm">{subtitle}</p>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
