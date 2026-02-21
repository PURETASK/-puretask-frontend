'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SkeletonList } from '@/components/ui/Skeleton';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useBooking, useCancelBooking } from '@/hooks/useBookings';
import { useLiveJobStatus, useAddToCalendar } from '@/hooks/useClientEnhanced';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Calendar, Share2, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function BookingDetailsPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <BookingDetailsContent />
    </ProtectedRoute>
  );
}

function BookingDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const { data, isLoading, error } = useBooking(bookingId);
  const { data: liveStatusData, isLoading: liveStatusLoading } = useLiveJobStatus(
    bookingId,
    !!data?.booking && ['pending', 'accepted', 'scheduled', 'in_progress'].includes(data.booking.status)
  );
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();
  const { mutate: addToCalendar, isPending: isAddingToCalendar } = useAddToCalendar();
  const { showToast } = useToast();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

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

  if (error || !data?.booking) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <ErrorDisplay
              error={error || new Error('Booking not found')}
              onRetry={() => window.location.reload()}
              variant="card"
              title="Booking Not Found"
            />
          </div>
        </main>
      </div>
    );
  }

  const booking = data.booking as typeof data.booking & { cleaner?: { name?: string; rating?: number; reviews_count?: number } };
  const canCancel = ['pending', 'accepted', 'scheduled'].includes(booking.status);

  const handleCancel = () => {
    if (showCancelConfirm) {
      cancelBooking({ bookingId, reason: 'Client requested cancellation' });
      setShowCancelConfirm(false);
    } else {
      setShowCancelConfirm(true);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Finding Cleaner',
      accepted: 'Confirmed',
      scheduled: 'Scheduled',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
              <p className="text-gray-600 mt-1">Booking ID: {booking.id}</p>
            </div>
            <Button variant="ghost" onClick={() => router.push('/client/bookings')}>
              ← Back to Bookings
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Enhanced Status Card with Live Updates */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Status</CardTitle>
                      {liveStatusLoading && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <span className="animate-pulse">●</span> Live updates active
                        </p>
                      )}
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      liveStatusData?.job?.current_status || booking.status
                    )}`}>
                      {getStatusLabel(liveStatusData?.job?.current_status || booking.status)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Enhanced Status Timeline with Events */}
                  <div className="space-y-4">
                    {['pending', 'accepted', 'in_progress', 'completed'].map((status, index) => {
                      const currentStatus = liveStatusData?.job?.current_status || booking.status;
                      const isActive = ['pending', 'accepted', 'in_progress', 'completed'].indexOf(currentStatus) >= index;
                      const isCurrent = currentStatus === status;
                      const events = liveStatusData?.job?.events || [];
                      const statusEvents = events.filter((e: any) => e.new_state === status);

                      return (
                        <div key={status} className="flex items-start gap-4">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {isActive ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <span className="text-xs font-semibold">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1 pt-1">
                            <div className="flex items-center gap-2">
                              <p className={`font-medium ${isCurrent ? 'text-blue-600' : isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                                {getStatusLabel(status)}
                              </p>
                              {isCurrent && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  Current
                                </span>
                              )}
                            </div>
                            {statusEvents.length > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                {format(new Date((statusEvents[0] as { created_at?: string }).created_at ?? ''), 'MMM d, h:mm a')}
                              </p>
                            )}
                            {isCurrent && (
                              <p className="text-sm text-gray-600 mt-1">
                                {status === 'pending' && 'We\'re finding the perfect cleaner for you...'}
                                {status === 'accepted' && 'Your cleaner has been assigned and confirmed.'}
                                {status === 'in_progress' && 'Your cleaner is currently working.'}
                                {status === 'completed' && 'Your cleaning service has been completed.'}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-6 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        addToCalendar(bookingId);
                      }}
                      isLoading={isAddingToCalendar}
                      className="flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Add to Calendar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowShareModal(true)}
                      className="flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    {booking.cleaner_id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/messages?job=${bookingId}`)}
                        className="flex items-center gap-2"
                      >
                        Message Cleaner
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Booking Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Service Type</label>
                      <p className="text-gray-900 capitalize">{booking.service_type?.replace('_', ' ') || 'Standard Cleaning'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date</label>
                      <p className="text-gray-900">{format(new Date(booking.scheduled_start_at), 'EEEE, MMMM d, yyyy')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Time</label>
                      <p className="text-gray-900">
                        {format(new Date(booking.scheduled_start_at), 'h:mm a')} - {format(new Date(booking.scheduled_end_at), 'h:mm a')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Duration</label>
                      <p className="text-gray-900">
                        {Math.round((new Date(booking.scheduled_end_at).getTime() - new Date(booking.scheduled_start_at).getTime()) / (1000 * 60 * 60))} hours
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-gray-900">{booking.address}</p>
                    </div>
                    {booking.client_notes && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-500">Special Instructions</label>
                        <p className="text-gray-900">{booking.client_notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Cleaner Information (if assigned) */}
              {booking.cleaner_id && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Cleaner</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                        {booking.cleaner?.name?.[0] || 'C'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{booking.cleaner?.name || 'Cleaner'}</h3>
                        <p className="text-sm text-gray-600">
                          ⭐ {booking.cleaner?.rating || 'N/A'} ({booking.cleaner?.reviews_count || 0} reviews)
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => router.push(`/messages?jobId=${booking.id}`)}>
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              {canCancel && (
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {showCancelConfirm ? (
                      <div className="space-y-4">
                        <p className="text-gray-700">Are you sure you want to cancel this booking?</p>
                        <div className="flex gap-3">
                          <Button variant="danger" onClick={handleCancel} isLoading={isCancelling}>
                            Yes, Cancel Booking
                          </Button>
                          <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>
                            No, Keep Booking
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button variant="danger" onClick={handleCancel}>
                        Cancel Booking
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Service Cost</span>
                      <span className="font-medium">{formatCurrency(booking.credit_amount * 10)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Credits Used</span>
                      <span className="font-medium">{booking.credit_amount} credits</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-blue-600">{formatCurrency(booking.credit_amount * 10)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
