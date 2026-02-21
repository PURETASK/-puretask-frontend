'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { StatsCard } from '@/components/features/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Users, DollarSign, TrendingUp, Plus } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { title: 'Total Bookings', value: '248', icon: Calendar, trend: { value: 12, isPositive: true } },
    { title: 'Active Cleaners', value: '45', icon: Users, trend: { value: 8, isPositive: true } },
    { title: 'Revenue', value: '$12,450', icon: DollarSign, trend: { value: 23, isPositive: true } },
    { title: 'Growth', value: '+18%', icon: TrendingUp, trend: { value: 5, isPositive: true } },
  ];

  const recentBookings = [
    { id: 1, client: 'Sarah Johnson', cleaner: 'Maria Garcia', date: 'Today, 2:00 PM', status: 'confirmed' },
    { id: 2, client: 'Mike Chen', cleaner: 'Lisa Brown', date: 'Today, 4:30 PM', status: 'in-progress' },
    { id: 3, client: 'Emma Wilson', cleaner: 'John Smith', date: 'Tomorrow, 10:00 AM', status: 'pending' },
    { id: 4, client: 'David Lee', cleaner: 'Ana Martinez', date: 'Tomorrow, 3:00 PM', status: 'confirmed' },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: 'success',
      'in-progress': 'info',
      pending: 'warning',
      completed: 'default',
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Breadcrumbs items={[{ label: 'Dashboard' }]} className="mt-2" />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{booking.client}</p>
                    <p className="text-sm text-gray-500">Cleaner: {booking.cleaner}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-600">{booking.date}</p>
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/client/bookings"><Button variant="outline">View All Bookings</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}


