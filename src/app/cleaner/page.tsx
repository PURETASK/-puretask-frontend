'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import {
  Calendar,
  Inbox,
  Briefcase,
  Wallet,
  Settings,
  ChevronRight,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useBookings } from '@/hooks/useBookings';
import { useAvailableJobs } from '@/hooks/useCleanerJobs';
import { format } from 'date-fns';

export default function CleanerHubPage() {
  return (
    <ProtectedRoute requiredRole="cleaner">
      <CleanerHubContent />
    </ProtectedRoute>
  );
}

function CleanerHubContent() {
  usePageTitle('Cleaner Home');
  const { data: bookingsData } = useBookings();
  const { data: availableJobs } = useAvailableJobs();

  const bookings = bookingsData?.bookings || [];
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayJobs = bookings.filter(
    (b: any) =>
      (b.status === 'scheduled' || b.status === 'confirmed') &&
      b.scheduled_start_at &&
      format(new Date(b.scheduled_start_at), 'yyyy-MM-dd') === today
  );
  const pendingRequests = Array.isArray(availableJobs) ? availableJobs.length : 0;

  const cards = [
    {
      href: '/cleaner/today',
      title: "Today's jobs",
      description: todayJobs.length
        ? `${todayJobs.length} job${todayJobs.length !== 1 ? 's' : ''} today. Start workflow, check in, upload photos.`
        : "No jobs scheduled for today. Check new requests or your calendar.",
      icon: Calendar,
      accent: 'blue',
      badge: todayJobs.length > 0 ? todayJobs.length : undefined,
    },
    {
      href: '/cleaner/jobs/requests',
      title: 'New requests',
      description: 'Available jobs you can accept. Filter by date, service, or pay.',
      icon: Inbox,
      accent: 'green',
      badge: pendingRequests > 0 ? pendingRequests : undefined,
    },
    {
      href: '/cleaner/dashboard',
      title: 'My jobs & dashboard',
      description: 'Full list of jobs, stats, earnings trend, and activity.',
      icon: Briefcase,
      accent: 'purple',
    },
    {
      href: '/cleaner/earnings',
      title: 'Earnings',
      description: 'See what you’ve earned, payout history, and wallet.',
      icon: Wallet,
      accent: 'amber',
    },
    {
      href: '/cleaner/availability',
      title: 'Set availability',
      description: 'When you’re available to work. Update your calendar and blocks.',
      icon: Settings,
      accent: 'gray',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Cleaner home
            </h1>
            <p className="text-gray-600 mt-1">
              Today’s jobs, new requests, earnings, and availability — all in one place.
            </p>
          </div>

          {todayJobs.length > 0 && (
            <Link
              href="/cleaner/today"
              className="mb-8 block rounded-2xl border border-[var(--brand-mint)]/30 p-5 transition-all duration-200 card-interactive"
              style={{
                background: 'linear-gradient(135deg, rgba(40,199,111,0.08) 0%, rgba(40,199,111,0.03) 100%)',
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--brand-mint)]/20 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-[var(--brand-mint)]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-mint)]">
                      {todayJobs.length} job{todayJobs.length !== 1 ? 's' : ''} today
                    </p>
                    <p className="font-semibold text-gray-900 mt-0.5">
                      {todayJobs[0].service_type?.replace('_', ' ') || 'Cleaning'} ·{' '}
                      {format(new Date(todayJobs[0].scheduled_start_at), 'h:mm a')}
                    </p>
                    <p className="text-sm text-gray-600 truncate max-w-xs">{todayJobs[0].address}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
              </div>
            </Link>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 card-interactive relative"
                >
                  {card.badge != null && (
                    <span className="absolute top-4 right-4 flex h-7 min-w-[28px] items-center justify-center rounded-full bg-[var(--brand-blue)] px-2 text-xs font-bold text-white">
                      {card.badge}
                    </span>
                  )}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={
                      card.accent === 'blue'
                        ? { background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-aqua))', color: 'white' }
                        : card.accent === 'green'
                          ? { backgroundColor: 'var(--brand-mint)', color: 'white' }
                          : card.accent === 'purple'
                            ? { backgroundColor: '#8B5CF6', color: 'white' }
                            : card.accent === 'amber'
                              ? { backgroundColor: '#F59E0B', color: 'white' }
                              : { backgroundColor: '#6B7280', color: 'white' }
                    }
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-[var(--brand-blue)] transition-colors pr-8">
                    {card.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 flex-1">{card.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-blue)] mt-3">
                    Open
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/cleaner/progress"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              Progress & rewards
            </Link>
            <Link
              href="/cleaner/calendar"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Calendar
            </Link>
            <Link
              href="/cleaner/reviews"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              My reviews
            </Link>
            <Link
              href="/cleaner/profile"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Profile
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
