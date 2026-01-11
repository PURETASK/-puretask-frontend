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
import { Search, Calendar, DollarSign, MapPin, User, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';

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

  const { data: bookingsData, isLoading } = useAllBookings({
    search,
    status: statusFilter,
    page,
    per_page: 20,
  });

  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateBookingStatus();

  const bookings = bookingsData?.bookings || [];
  const total = bookingsData?.total || 0;

  const handleStatusChange = (bookingId: string, status: string) => {
    if (confirm(`Are you sure you want to change this booking's status to ${status}?`)) {
      updateStatus({ bookingId, status });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'destructive' | 'default' | 'primary'> = {
      scheduled: 'primary',
      confirmed: 'success',
      in_progress: 'warning',
      completed: 'success',
      cancelled: 'destructive',
      pending: 'warning',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
              <p className="text-gray-600 mt-1">Oversee and manage all platform bookings</p>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = '/admin/dashboard')}>
              ← Back to Dashboard
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-blue-600">
                  {bookings.filter((b: any) => ['scheduled', 'confirmed', 'in_progress'].includes(b.status)).length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter((b: any) => b.status === 'completed').length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">
                  {bookings.filter((b: any) => b.status === 'cancelled').length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by booking ID, client, or cleaner..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Bookings List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loading />
              </div>
            ) : bookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No bookings found</p>
                </CardContent>
              </Card>
            ) : (
              bookings.map((booking: any) => (
                <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Booking #{booking.id.slice(0, 8)}
                          </h3>
                          {getStatusBadge(booking.status)}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <User className="h-4 w-4" />
                              <span>
                                Client: <span className="font-medium text-gray-900">{booking.client?.full_name || 'Unknown'}</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <User className="h-4 w-4" />
                              <span>
                                Cleaner: <span className="font-medium text-gray-900">{booking.cleaner?.full_name || 'Unassigned'}</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span className="font-medium text-gray-900">{booking.address}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {format(new Date(booking.scheduled_start_at), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>
                                {format(new Date(booking.scheduled_start_at), 'h:mm a')} -{' '}
                                {format(new Date(booking.scheduled_end_at), 'h:mm a')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <DollarSign className="h-4 w-4" />
                              <span className="font-semibold text-gray-900">
                                {formatCurrency(booking.total_price || 0)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <Badge variant="default">{booking.service_type}</Badge>
                          {booking.payment_status && (
                            <Badge variant={booking.payment_status === 'paid' ? 'success' : 'warning'}>
                              {booking.payment_status}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          View Details
                        </Button>
                        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                          <div className="relative group">
                            <Button variant="ghost" size="sm">
                              Manage ▼
                            </Button>
                            <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                              <button
                                onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleStatusChange(booking.id, 'completed')}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                              >
                                Mark Completed
                              </button>
                              <button
                                onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Pagination */}
          {total > 20 && (
            <Card className="mt-6">
              <CardContent className="p-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page * 20 >= total}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <Card
            className="max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Booking Details</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-gray-900">
                  Booking #{selectedBooking.id.slice(0, 8)}
                </h3>
                {getStatusBadge(selectedBooking.status)}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Service Details</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-600">Service Type:</span>{' '}
                      <span className="font-medium">{selectedBooking.service_type}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Date:</span>{' '}
                      <span className="font-medium">
                        {format(new Date(selectedBooking.scheduled_start_at), 'MMM d, yyyy')}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Time:</span>{' '}
                      <span className="font-medium">
                        {format(new Date(selectedBooking.scheduled_start_at), 'h:mm a')} -{' '}
                        {format(new Date(selectedBooking.scheduled_end_at), 'h:mm a')}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Price:</span>{' '}
                      <span className="font-semibold">
                        {formatCurrency(selectedBooking.total_price || 0)}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Location</h4>
                  <div className="text-sm">
                    <p className="font-medium">{selectedBooking.address}</p>
                    {selectedBooking.address_line_2 && (
                      <p className="text-gray-600">{selectedBooking.address_line_2}</p>
                    )}
                    <p className="text-gray-600">
                      {selectedBooking.city}, {selectedBooking.state} {selectedBooking.zip_code}
                    </p>
                  </div>
                </div>
              </div>

              {selectedBooking.special_instructions && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Special Instructions</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedBooking.special_instructions}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="primary" onClick={() => setSelectedBooking(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}

