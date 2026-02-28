'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageShell } from '@/components/layout/PageShell';
import { BookingCard } from '@/components/features/dashboard/BookingCard';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { AnimatedCardMotion } from '@/components/motion/AnimatedCardMotion';
import { JobRowSkeleton } from '@/components/ui/skeleton/JobRowSkeleton';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';
import { EmptyBookings } from '@/components/ui/EmptyState';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useBookings } from '@/hooks/useBookings';
import { format } from 'date-fns';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { PullToRefresh } from '@/components/mobile/PullToRefresh';
import { useMobile } from '@/hooks/useMobile';

export default function MyBookingsPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <MyBookingsContent />
    </ProtectedRoute>
  );
}

function MyBookingsContent() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const { data, isLoading, error, refetch } = useBookings(filter === 'all' ? undefined : filter);
  const { handleError } = useErrorHandler();
  const { mobile } = useMobile();

  const bookings = data?.bookings || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-app">
        <Header />
        <main className="flex-1">
          <PageShell title="My Bookings" maxWidth="wide">
            <div className="space-y-3">
              <JobRowSkeleton />
              <JobRowSkeleton />
              <JobRowSkeleton />
            </div>
          </PageShell>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-app">
        <Header />
        <main className="flex-1">
          <PageShell title="My Bookings" maxWidth="wide">
            <ErrorDisplay
              error={error}
              onRetry={() => refetch()}
              variant="card"
              title="Failed to load bookings"
            />
          </PageShell>
        </main>
      </div>
    );
  }
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter((b: any) => {
        if (filter === 'upcoming') {
          return ['pending', 'accepted', 'scheduled', 'confirmed'].includes(b.status);
        }
        return b.status === filter;
      });

  const handleRefresh = async () => {
    await refetch();
  };

  const content = (
    <PageShell
        title="My bookings"
        subtitle="View and manage your upcoming and past cleans."
        back={{ href: '/client', label: 'Back to home' }}
        maxWidth="wide"
      >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Button variant="primary" onClick={() => router.push('/client/book')}>
          Book a cleaner
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((tab) => {
          const count = tab === 'all' ? bookings.length : bookings.filter((b: any) => {
            if (tab === 'upcoming') return ['pending', 'accepted', 'scheduled', 'confirmed'].includes(b.status);
            return b.status === tab;
          }).length;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                filter === tab
                  ? 'bg-[var(--brand-blue)] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-[var(--brand-blue)]/40 hover:text-[var(--brand-blue)]'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== 'all' && ` (${count})`}
            </button>
          );
        })}
      </div>

      {/* Bookings Grid */}
      {filteredBookings.length > 0 ? (
        <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings.map((booking: any) => (
            <StaggerItem key={booking.id}>
              <AnimatedCardMotion>
                <div onClick={() => router.push(`/client/bookings/${booking.id}`)} className="cursor-pointer">
                  <BookingCard
                    id={booking.id}
                    cleanerName={booking.cleaner?.full_name || booking.cleaner?.name || 'Cleaner'}
                    date={format(new Date(booking.scheduled_start_at), 'MMM d, yyyy')}
                    time={format(new Date(booking.scheduled_start_at), 'h:mm a')}
                    service={booking.service_type || 'Standard Cleaning'}
                    address={booking.address}
                    status={booking.status}
                    price={booking.credit_amount * 10}
                  />
                </div>
              </AnimatedCardMotion>
            </StaggerItem>
          ))}
        </Stagger>
      ) : filter === 'all' ? (
        <EmptyBookings />
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-600">No {filter} bookings right now.</p>
          <Button variant="outline" className="mt-4" onClick={() => setFilter('all')} style={{ borderColor: 'var(--brand-blue)', color: 'var(--brand-blue)' }}>
            View all bookings
          </Button>
        </div>
      )}
    </PageShell>
  );

  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      <main className="flex-1">
        {mobile ? (
          <PullToRefresh onRefresh={handleRefresh}>
            {content}
          </PullToRefresh>
        ) : (
          content
        )}
      </main>
      <Footer />
    </div>
  );
}

