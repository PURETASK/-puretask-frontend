'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
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
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8 px-6">
          <div className="max-w-7xl mx-auto space-y-3">
            <JobRowSkeleton />
            <JobRowSkeleton />
            <JobRowSkeleton />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <ErrorDisplay
              error={error}
              onRetry={() => refetch()}
              variant="card"
              title="Failed to load bookings"
            />
          </div>
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
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <Button variant="primary" onClick={() => router.push('/search')}>
          + Book a Cleaner
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === tab
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab !== 'all' && `(${bookings.filter((b: any) => {
              if (tab === 'upcoming') {
                return ['pending', 'accepted', 'scheduled', 'confirmed'].includes(b.status);
              }
              return b.status === tab;
            }).length})`}
          </button>
        ))}
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
      ) : (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'No Bookings Yet' : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Bookings`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? 'Ready to book your first cleaning service?'
              : `You don't have any ${filter} bookings at the moment.`}
          </p>
          {filter === 'all' && (
            <Button variant="primary" onClick={() => router.push('/search')}>
              Book Now
            </Button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
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
