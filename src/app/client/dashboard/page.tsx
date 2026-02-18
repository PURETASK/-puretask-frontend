'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StatsOverview } from '@/components/features/dashboard/StatsOverview';
import { BookingCard } from '@/components/features/dashboard/BookingCard';
import { ActivityFeed } from '@/components/features/dashboard/ActivityFeed';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SkeletonList } from '@/components/ui/Skeleton';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';
import { EmptyBookings } from '@/components/ui/EmptyState';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useBookings } from '@/hooks/useBookings';
import { useDashboardInsights, useRecommendations } from '@/hooks/useClientEnhanced';
import { LineChart } from '@/components/ui/Charts';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { BookingDetailsDrawer } from '@/components/bookings/BookingDetailsDrawer';
import { Calendar, TrendingUp, Clock, Sparkles, CreditCard, FileText } from 'lucide-react';
import Link from 'next/link';

export default function ClientDashboardPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <ClientDashboardContent />
    </ProtectedRoute>
  );
}

function ClientDashboardContent() {
  const [drawerBooking, setDrawerBooking] = React.useState<any>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { data: bookingsData, isLoading } = useBookings();
  const { data: insightsData, isLoading: insightsLoading } = useDashboardInsights();
  const { data: recommendationsData, isLoading: recommendationsLoading } = useRecommendations();
  const bookings = bookingsData?.bookings || [];
  const insights = insightsData?.insights;
  const recommendations = recommendationsData?.recommendations;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <SkeletonList items={6} />
          </div>
        </main>
      </div>
    );
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
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's your overview.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/client/credits" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Credits
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/client/billing" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Billing
                </Link>
              </Button>
              <Button variant="primary" onClick={() => (window.location.href = '/search')}>
                + Book a Cleaner
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <StatsOverview stats={stats} />

          {/* Personalized Insights */}
          {insights && (
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {insights.bookingPatterns.length > 0 && (
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">Your Booking Pattern</h3>
                    </div>
                    <p className="text-sm text-blue-800">
                      You usually book on{' '}
                      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
                        insights.bookingPatterns[0]?.dayOfWeek || 0
                      ]}{' '}
                      around {insights.bookingPatterns[0]?.hour || 0}:00
                    </p>
                  </CardContent>
                </Card>
              )}

              {insights.favoriteCleaner && (
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-purple-900">Favorite Cleaner</h3>
                    </div>
                    <p className="text-sm text-purple-800">
                      {insights.favoriteCleaner.name} is available! You've booked them{' '}
                      {insights.favoriteCleaner.booking_count} times.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => (window.location.href = `/booking?cleaner=${insights.favoriteCleaner.cleaner_id}`)}
                    >
                      Book Again
                    </Button>
                  </CardContent>
                </Card>
              )}

              {insights.creditExpiration && (
                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <h3 className="font-semibold text-amber-900">Credit Expiring Soon</h3>
                    </div>
                    <p className="text-sm text-amber-800">
                      You have credits expiring on {format(new Date(insights.creditExpiration), 'MMM d, yyyy')}
                    </p>
                  </CardContent>
                </Card>
              )}

              {insights.lastBooking && (
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-green-900">Last Booking</h3>
                    </div>
                    <p className="text-sm text-green-800">
                      Your last booking was on{' '}
                      {format(new Date(insights.lastBooking.scheduled_start_at), 'MMM d, yyyy')}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => (window.location.href = '/booking')}
                    >
                      Book Again
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Cleaner Recommendations */}
          {recommendations && (recommendations.similarToFavorites.length > 0 || recommendations.topRated.length > 0) && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recommended Cleaners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {recommendations.similarToFavorites.slice(0, 2).map((cleaner: any) => (
                    <div
                      key={cleaner.id}
                      className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer"
                      onClick={() => (window.location.href = `/cleaner/${cleaner.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          {cleaner.name[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{cleaner.name}</p>
                          <p className="text-sm text-gray-600">
                            ⭐ {cleaner.rating} • {formatCurrency(cleaner.price_per_hour)}/hr
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
                        onViewDetails={() => {
                          setDrawerBooking(booking);
                          setDrawerOpen(true);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyBookings />
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

      <BookingDetailsDrawer
        booking={drawerBooking}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
