'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StatsOverview } from '@/components/features/dashboard/StatsOverview';
import { ActivityFeed } from '@/components/features/dashboard/ActivityFeed';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LineChart, BarChart, DonutChart } from '@/components/ui/Charts';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAdminStats, useDailyStats, useRevenueAnalytics } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const [revenuePeriod, setRevenuePeriod] = useState<'week' | 'month' | 'year'>('month');

  const { data: statsData, isLoading: loadingStats } = useAdminStats();
  const { data: dailyStatsData } = useDailyStats(30);
  const { data: revenueData } = useRevenueAnalytics(revenuePeriod);

  if (loadingStats) {
    return <Loading size="lg" text="Loading admin dashboard..." fullScreen />;
  }

  const stats = statsData?.stats || {};

  // Transform stats for StatsOverview component
  const overviewStats = [
    {
      label: 'Total Users',
      value: stats.total_users || 0,
      icon: '👥',
      color: 'text-blue-600',
      trend: '+12%',
    },
    {
      label: 'Active Bookings',
      value: stats.active_bookings || 0,
      icon: '📅',
      color: 'text-green-600',
      trend: '+8%',
    },
    {
      label: 'Total Revenue',
      value: `$${(stats.total_revenue || 0).toLocaleString()}`,
      icon: '💰',
      color: 'text-purple-600',
      trend: '+23%',
    },
    {
      label: 'Pending Issues',
      value: stats.reported_issues || 0,
      icon: '⚠️',
      color: 'text-red-600',
      trend: '-5%',
    },
  ];

  // User distribution chart
  const userDistribution = [
    { label: 'Clients', value: stats.total_clients || 0, color: '#3B82F6' },
    { label: 'Cleaners', value: stats.total_cleaners || 0, color: '#10B981' },
  ];

  // Booking status distribution
  const bookingDistribution = [
    { label: 'Completed', value: stats.completed_bookings || 0, color: '#10B981' },
    { label: 'Active', value: stats.active_bookings || 0, color: '#3B82F6' },
    { label: 'Cancelled', value: stats.cancelled_bookings || 0, color: '#EF4444' },
  ];

  // Daily bookings chart data
  const dailyBookingsChart =
    dailyStatsData?.daily_stats?.slice(-14).map((day: any) => ({
      label: new Date(day.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      value: day.bookings_count || 0,
    })) || [];

  // Revenue chart data
  const revenueChart =
    revenueData?.revenue?.map((item: any) => ({
      label: item.label,
      value: item.amount || 0,
    })) || [];

  // Recent activity (mock data - would come from API)
  const recentActivity = [
    {
      id: '1',
      type: 'booking_created' as const,
      title: 'New Booking Created',
      description: 'John Doe booked a standard cleaning',
      timestamp: new Date().toISOString(),
      meta: { amount: 120, status: 'pending' },
    },
    {
      id: '2',
      type: 'payment_received' as const,
      title: 'Payment Received',
      description: 'Payment processed for booking #1234',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      meta: { amount: 150 },
    },
    {
      id: '3',
      type: 'profile_updated' as const,
      title: 'New Cleaner Registered',
      description: 'Jane Smith completed registration',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  // Quick actions
  const quickActions = [
    {
      label: 'Pending Verifications',
      count: stats.pending_verifications || 0,
      icon: CheckCircle,
      color: 'bg-blue-50 text-blue-600',
      link: '/admin/verifications',
    },
    {
      label: 'Reported Issues',
      count: stats.reported_issues || 0,
      icon: AlertCircle,
      color: 'bg-red-50 text-red-600',
      link: '/admin/issues',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">
                System overview and management controls
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => (window.location.href = '/admin/users')}
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button
                variant="primary"
                onClick={() => (window.location.href = '/admin/bookings')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Bookings
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <StatsOverview stats={overviewStats} />

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {quickActions.map((action) => (
              <Card
                key={action.label}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => (window.location.href = action.link)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color}`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">{action.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{action.count}</p>
                    </div>
                    <Badge variant={action.count > 0 ? 'warning' : 'success'}>
                      {action.count > 0 ? 'Action Needed' : 'All Clear'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mt-6">
            {/* Charts Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Revenue Trends</CardTitle>
                    <div className="flex gap-2">
                      {(['week', 'month', 'year'] as const).map((period) => (
                        <Button
                          key={period}
                          variant={revenuePeriod === period ? 'primary' : 'ghost'}
                          size="sm"
                          onClick={() => setRevenuePeriod(period)}
                        >
                          {period.charAt(0).toUpperCase() + period.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {revenueChart.length > 0 ? (
                    <LineChart data={revenueChart} height={250} />
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      No revenue data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Daily Bookings Chart */}
              {dailyBookingsChart.length > 0 && (
                <BarChart
                  data={dailyBookingsChart}
                  title="Daily Bookings (Last 14 Days)"
                  height={250}
                />
              )}

              {/* Distribution Charts */}
              <div className="grid md:grid-cols-2 gap-6">
                <DonutChart
                  data={userDistribution}
                  title="User Distribution"
                  size={200}
                  centerText={stats.total_users?.toString() || '0'}
                  centerSubtext="Total Users"
                />
                <DonutChart
                  data={bookingDistribution}
                  title="Booking Status"
                  size={200}
                  centerText={stats.total_bookings?.toString() || '0'}
                  centerSubtext="Total Bookings"
                />
              </div>
            </div>

            {/* Activity Feed */}
            <div className="lg:col-span-1">
              <ActivityFeed activities={recentActivity} title="Recent System Activity" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
