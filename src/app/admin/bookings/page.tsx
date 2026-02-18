'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAllBookings, useUpdateBookingStatus } from '@/hooks/useAdmin';
import { adminEnhancedService } from '@/services/adminEnhanced.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Calendar, DollarSign, MapPin, User, Clock, Sparkles, CheckSquare, XSquare } from 'lucide-react';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { MobileTable } from '@/components/mobile/MobileTable';
import { useMobile } from '@/hooks/useMobile';

type JobInsightsResponse = {
  insights?: {
    avgMatchScore?: number;
    topCleaner?: string;
    commonIssues?: unknown[];
    riskLevel?: string;
  };
};

export default function AdminBookingsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminBookingsContent />
    </ProtectedRoute>
  );
}

function AdminBookingsContent() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();
  const { mobile } = useMobile();

  // Get job insights
  const { data: insightsData } = useQuery({
    queryKey: ['admin', 'jobs', 'insights'],
    queryFn: () => adminEnhancedService.getJobInsights() as Promise<JobInsightsResponse>,
  });

  // Bulk action mutation
  const { mutate: bulkAction, isPending: isBulkActionPending } = useMutation({
    mutationFn: ({ action, params }: { action: string; params?: any }) =>
      adminEnhancedService.bulkAction(Array.from(selectedBookings), action, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      setSelectedBookings(new Set());
    },
  });

  const { data: bookingsData, isLoading } = useAllBookings({
    search,
    status: statusFilter,
    page,
    per_page: 20,
  });

  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateBookingStatus();

  const bookings = bookingsData?.data?.bookings || [];
  const total = bookingsData?.data?.total || 0;

  const handleStatusChange = (bookingId: string, status: string) => {
    if (confirm(`Are you sure you want to change this booking's status to ${status}?`)) {
      updateStatus({ bookingId, status });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'error' | 'default' | 'info'> = {
      scheduled: 'default',
      confirmed: 'success',
      in_progress: 'warning',
      completed: 'success',
      cancelled: 'error',
      pending: 'warning',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  // Table columns for MobileTable
  const columns = [
    {
      key: 'id',
      header: 'ID',
      mobileHidden: true,
    },
    {
      key: 'client',
      header: 'Client',
      render: (booking: any) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{booking.client_name || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'cleaner',
      header: 'Cleaner',
      render: (booking: any) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span>{booking.cleaner_name || 'Unassigned'}</span>
        </div>
      ),
    },
    {
      key: 'service',
      header: 'Service',
      render: (booking: any) => (
        <span className="capitalize">{booking.service_type || 'N/A'}</span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (booking: any) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{booking.scheduled_date ? format(new Date(booking.scheduled_date), 'MMM d, yyyy') : 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'time',
      header: 'Time',
      render: (booking: any) => (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-gray-400" />
          <span>{booking.scheduled_time || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'address',
      header: 'Address',
      render: (booking: any) => (
        <div className="flex items-center gap-1 max-w-xs truncate">
          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{booking.address || 'N/A'}</span>
        </div>
      ),
      mobileHidden: true,
    },
    {
      key: 'price',
      header: 'Price',
      render: (booking: any) => (
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{formatCurrency(booking.total_price || 0)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (booking: any) => getStatusBadge(booking.status),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (booking: any) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedBooking(booking)}
            className="min-h-[44px] min-w-[44px]"
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Booking Management</h1>
              <p className="text-gray-600 mt-1">Oversee and manage all platform bookings</p>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = '/admin/dashboard')} className="min-h-[44px]">
              ← Back to Dashboard
            </Button>
          </div>

          {/* Job Insights */}
          {insightsData?.insights && (
            <Card className="mb-6 border-blue-200 bg-blue-50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Job Insights</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-blue-700">Avg Match Score</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {insightsData.insights.avgMatchScore?.toFixed(1) || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Top Cleaner</p>
                    <p className="text-lg font-semibold text-blue-900 truncate">
                      {insightsData.insights.topCleaner || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Common Issues</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {insightsData.insights.commonIssues?.length || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Risk Level</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {insightsData.insights.riskLevel || 'Low'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    fieldType="search"
                    placeholder="Search bookings..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="min-h-[44px]"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full h-11 px-3 py-2 border border-gray-300 rounded-lg text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedBookings.size > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => bulkAction({ action: 'cancel' })}
                    disabled={isBulkActionPending}
                    className="min-h-[44px]"
                  >
                    <XSquare className="h-4 w-4 mr-2" />
                    Cancel Selected ({selectedBookings.size})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedBookings(new Set())}
                    className="min-h-[44px]"
                  >
                    Clear Selection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bookings Table */}
          {isLoading ? (
            <Loading />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>
                  Bookings ({total})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MobileTable
                  data={bookings}
                  columns={columns}
                  keyExtractor={(booking) => booking.id}
                  emptyMessage="No bookings found"
                />
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {total > 20 && (
            <div className="mt-6 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="min-h-[44px]"
              >
                Previous
              </Button>
              <span className="flex items-center px-4 min-h-[44px]">
                Page {page} of {Math.ceil(total / 20)}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / 20)}
                className="min-h-[44px]"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
