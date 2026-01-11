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
import { BarChart, DonutChart } from '@/components/ui/Charts';
import { format } from 'date-fns';

export default function CleanerDashboardPage() {
  return (
    <ProtectedRoute requiredRole="cleaner">
      <CleanerDashboardContent />
    </ProtectedRoute>
  );
}

function CleanerDashboardContent() {
  const { data: bookingsData, isLoading } = useBookings();
  const bookings = bookingsData?.bookings || [];

  if (isLoading) {
    return <Loading size="lg" text="Loading dashboard..." fullScreen />;
  }

  // Calculate stats
  const upcomingBookings = bookings.filter(
    (b: any) => b.status === 'scheduled' || b.status === 'confirmed'
  );
  const completedBookings = bookings.filter((b: any) => b.status === 'completed');
  const totalEarnings = completedBookings.reduce(
    (sum: number, b: any) => sum + (b.total_price || 0),
    0
  );
  const avgRating = 4.8; // This would come from API

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: '📅', color: 'text-blue-600' },
    { label: 'Upcoming', value: upcomingBookings.length, icon: '⏰', color: 'text-green-600' },
    {
      label: 'Total Earnings',
      value: `$${totalEarnings.toFixed(0)}`,
      icon: '💰',
      color: 'text-purple-600',
    },
    { label: 'Avg Rating', value: avgRating.toFixed(1), icon: '⭐', color: 'text-yellow-600' },
  ];

  // Service type distribution
  const serviceTypes = bookings.reduce((acc: any, b: any) => {
    acc[b.service_type] = (acc[b.service_type] || 0) + 1;
    return acc;
  }, {});

  const serviceChartData = Object.entries(serviceTypes).map(([type, count]) => ({
    label: type.replace('_', ' '),
    value: count as number,
  }));

  // Earnings by month
  const monthlyEarnings = completedBookings
    .reduce((acc: any[], b: any) => {
      const month = format(new Date(b.scheduled_start_at), 'MMM');
      const existing = acc.find((item) => item.label === month);
      if (existing) {
        existing.value += b.total_price;
      } else {
        acc.push({ label: month, value: b.total_price });
      }
      return acc;
    }, [])
    .slice(-6);

  // Activity feed
  const activities = bookings.slice(0, 5).map((b: any) => ({
    id: b.id,
    type: b.status === 'completed' ? 'booking_completed' : 'booking_created',
    title:
      b.status === 'completed'
        ? 'Job Completed'
        : b.status === 'scheduled'
        ? 'New Booking'
        : 'Booking Update',
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
              <h1 className="text-3xl font-bold text-gray-900">Cleaner Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your bookings and track your earnings.</p>
            </div>
            <Button variant="primary" onClick={() => (window.location.href = '/cleaner/schedule')}>
              📅 View Schedule
            </Button>
          </div>

          {/* Stats Overview */}
          <StatsOverview stats={stats} />

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mt-8">
            {/* Left Column - Bookings & Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Bookings */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Today's Schedule</h2>
                  <Button
                    variant="ghost"
                    onClick={() => (window.location.href = '/cleaner/bookings')}
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
                        cleanerName={booking.client?.full_name || 'Client'}
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
                    <div className="text-5xl mb-3">✨</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h3>
                    <p className="text-gray-600">No upcoming bookings for today.</p>
                  </div>
                )}
              </div>

              {/* Charts */}
              <div className="grid md:grid-cols-2 gap-6">
                {monthlyEarnings.length > 0 && (
                  <BarChart data={monthlyEarnings} title="Monthly Earnings" height={250} />
                )}
                {serviceChartData.length > 0 && (
                  <DonutChart
                    data={serviceChartData}
                    title="Service Types"
                    size={200}
                    centerText={bookings.length.toString()}
                    centerSubtext="Total Jobs"
                  />
                )}
              </div>
            </div>

            {/* Right Column - Activity Feed */}
            <div className="lg:col-span-1">
              <ActivityFeed activities={activities} maxItems={10} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
