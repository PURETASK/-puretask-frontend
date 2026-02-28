'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageShell } from '@/components/layout/PageShell';
import Link from 'next/link';
import { CalendarPlus, Repeat, UserCheck, ChevronRight } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function ClientBookPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <ClientBookContent />
    </ProtectedRoute>
  );
}

function ClientBookContent() {
  usePageTitle('Book a clean');

  const options = [
    {
      href: '/search',
      title: 'One-time clean',
      description: 'Choose a date and time, pick a verified cleaner, and book.',
      icon: CalendarPlus,
      cta: 'Find a cleaner',
    },
    {
      href: '/client/recurring',
      title: 'Recurring cleans',
      description: 'Set up weekly or bi-weekly cleans with the same cleaner.',
      icon: Repeat,
      cta: 'Set up recurring',
    },
    {
      href: '/favorites',
      title: 'Book same cleaner again',
      description: 'You have favorite cleaners saved. Book them directly.',
      icon: UserCheck,
      cta: 'Choose from favorites',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      <main className="flex-1">
        <PageShell
          title="How do you want to book?"
          subtitle="Pick one option to get started."
          back={{ href: '/client', label: 'Back to home' }}
          maxWidth="content"
        >
          <div className="space-y-4">
            {options.map((opt) => {
              const Icon = opt.icon;
              return (
                <Link
                  key={opt.href}
                  href={opt.href}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 card-interactive"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-aqua))',
                      color: 'white',
                    }}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-[var(--brand-blue)] transition-colors">
                      {opt.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-0.5">{opt.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-blue)] flex-shrink-0">
                    {opt.cta}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </PageShell>
      </main>
      <Footer />
    </div>
  );
}
