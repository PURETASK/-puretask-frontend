'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  /** Link to the other auth action (e.g. Sign up / Log in) */
  switchAction?: { label: string; href: string };
  className?: string;
}

export function AuthShell({ children, title, subtitle, switchAction, className }: AuthShellProps) {
  return (
    <div
      className={cn(
        'min-h-screen flex flex-col md:flex-row',
        className
      )}
      style={{
        background: 'linear-gradient(160deg, var(--brand-cloud) 0%, #e8f0fe 40%, #f0f4ff 100%)',
      }}
    >
      {/* Left panel - branding (desktop) */}
      <div className="hidden md:flex md:w-2/5 lg:w-2/5 flex-col justify-center px-10 lg:px-14 py-12">
        <Link href="/" className="inline-flex items-center gap-2 mb-12">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-aqua))' }}
          >
            <span className="text-white font-bold text-lg">PT</span>
          </div>
          <span className="text-xl font-bold text-gray-900">PureTask</span>
        </Link>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight max-w-sm">
          Clean homes, clear process.
        </h2>
        <p className="mt-4 text-gray-600 max-w-sm">
          Book verified cleaners. Payment is held until you approve. Every job has a timeline and evidence.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm">
            Verified cleaners
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm">
            Protected payments
          </span>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 md:px-8">
        <div className="w-full max-w-md">
          <div className="md:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-aqua))' }}
              >
                <span className="text-white font-bold text-lg">PT</span>
              </div>
              <span className="text-lg font-bold text-gray-900">PureTask</span>
            </Link>
          </div>
          <div
            className="rounded-2xl border border-gray-200/80 bg-white shadow-xl shadow-gray-200/50 overflow-hidden"
          >
            <div
              className="h-1 w-full"
              style={{ background: 'linear-gradient(90deg, var(--brand-blue), var(--brand-aqua))' }}
              aria-hidden
            />
            <div className="p-8">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
              {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
              {switchAction && (
                <p className="mt-4 text-sm text-gray-600">
                  <Link
                    href={switchAction.href}
                    className="font-semibold text-[var(--brand-blue)] hover:underline"
                  >
                    {switchAction.label}
                  </Link>
                </p>
              )}
              <div className="mt-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
