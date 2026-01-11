'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StatsOverview } from '@/components/features/dashboard/StatsOverview';
import { BookingCard } from '@/components/features/dashboard/BookingCard';
import { ActivityFeed } from '@/components/features/dashboard/ActivityFeed';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useBookings } from '@/hooks/useBookings';
import { LineChart } from '@/components/ui/Charts';
import { format } from 'date-fns';

export default function ClientDashboardPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <ClientDashboardContent />
    </ProtectedRoute>
  );
}

function ClientDashboardContent() {
  const { data: bookingsData, isLoading } = useBookings();
  const bookings = bookingsData?.bookings || [];

  if (isLoading) {
    return <Loading size="lg" text="Loading dashboard..." fullScreen />;
  }

  // Calculate stats from real data
  const upcomingBookings = bookings.filter(
    (b: any) => b.status === 'scheduled' || b.status === 'confirmed'
  );
  const completedBookings = bookings.filter((b: any) => b.status === 'completed');
  const totalSpent = completedBookings.reduce(
    (sum: number, b: any) => sum + (b.total_price || 0),
    0
  );

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: '📅', color: 'text-blue-600' },
    { label: 'Upcoming', value: upcomingBookings.length, icon: '⏰', color: 'text-green-600' },
    { label: 'Total Spent', value: `$${totalSpent.toFixed(0)}`, icon: '💵', color: 'text-purple-600' },
    { label: 'Completed', value: completedBookings.length, icon: '✅', color: 'text-yellow-600' },
  ];

  // Chart data for booking trends
  const chartData = bookings
    .slice(0, 7)
    .reverse()
    .map((b: any) => ({
      label: format(new Date(b.scheduled_start_at), 'MMM d'),
      value: b.total_price || 0,
    }));

  // Activity feed data
  const activities = bookings.slice(0, 5).map((b: any) => ({
    id: b.id,
    type: b.status === 'completed' ? 'booking_completed' : 'booking_created',
    title:
      b.status === 'completed'
        ? 'Booking Completed'
        : 'Booking Created',
    description: `${b.service_type} cleaning at ${b.address}`,
    timestamp: b.created_at,
    meta: {
      amount: b.total_price,
      status: b.status,
    },
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's your overview.</p>
            </div>
            <Button variant="primary" onClick={() => (window.location.href = '/search')}>
              + Book a Cleaner
            </Button>
          </div>

          {/* Stats Overview */}
          <StatsOverview stats={stats} />

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mt-8">
            {/* Upcoming Bookings */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Upcoming Bookings</h2>
                  <Button
                    variant="ghost"
                    onClick={() => (window.location.href = '/client/bookings')}
                  >
                    View All
                  </Button>
                </div>
                {upcomingBookings.length > 0 ? (
                  <div className="grid gap-4">
                    {upcomingBookings.slice(0, 3).map((booking: any) => (
                      <BookingCard
                        key={booking.id}
                        id={booking.id}
                        cleanerName={booking.cleaner?.full_name || 'Cleaner'}
                        date={format(new Date(booking.scheduled_start_at), 'MMM d, yyyy')}
                        time={format(new Date(booking.scheduled_start_at), 'h:mm a')}
                        service={booking.service_type}
                        address={booking.address}
                        status={booking.status}
                        price={booking.total_price}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                    <div className="text-5xl mb-3">📅</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Upcoming Bookings
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Ready to book your next cleaning service?
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => (window.location.href = '/search')}
                    >
                      Book Now
                    </Button>
                  </div>
                )}
              </div>

              {/* Booking Trends Chart */}
              {chartData.length > 0 && (
                <LineChart data={chartData} title="Booking Spending Trends" height={250} />
              )}
            </div>

            {/* Activity Feed */}
            <div className="lg:col-span-1">
              <ActivityFeed activities={activities} maxItems={8} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
