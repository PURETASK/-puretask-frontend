'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { LottieSuccess, LOTTIE_URLS } from '@/components/ui/LottieSuccess';
import { useBooking } from '@/hooks/useBookings';
import { useAddToCalendar } from '@/hooks/useClientEnhanced';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Calendar, Share2, CheckCircle, Clock, MessageCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const { data, isLoading, error } = useBooking(bookingId);
  const { mutate: addToCalendar, isPending: isAddingToCalendar } = useAddToCalendar();
  const { showToast } = useToast();

  if (isLoading) {
    return <Loading size="lg" text="Loading booking confirmation..." fullScreen />;
  }

  if (error || !data?.booking) {
    return (
      <div className="min-h-screen flex flex-col bg-app items-center justify-center px-4">
        <Header />
        <Card className="max-w-md rounded-2xl border-gray-200">
          <CardContent className="p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Booking not found</h2>
            <p className="text-gray-600 mb-4">We couldn&apos;t find this booking.</p>
            <Button variant="primary" onClick={() => router.push('/client')}>Go to home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const booking = data.booking;

  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div
            className="text-center mb-8 rounded-2xl border border-[var(--brand-mint)]/20 px-6 py-8"
            style={{ background: 'linear-gradient(135deg, rgba(40,199,111,0.08) 0%, rgba(0,212,255,0.04) 100%)' }}
          >
            <div className="flex justify-center mb-4">
              <LottieSuccess
                src={LOTTIE_URLS.booking}
                width={280}
                height={280}
                autoplay
                loop
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Booking confirmed</h1>
            <p className="text-gray-600">Your cleaning service has been scheduled. Payment is held until you approve the job.</p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addToCalendar(bookingId)}
                isLoading={isAddingToCalendar}
                className="gap-2 border-[var(--brand-blue)]/40 text-[var(--brand-blue)]"
              >
                <Calendar className="h-4 w-4" />
                Add to calendar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('Link copied to clipboard', 'success');
                }}
                className="gap-2 border-[var(--brand-blue)]/40 text-[var(--brand-blue)]"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          <Card className="mb-6 rounded-2xl border-gray-200 overflow-hidden">
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, var(--brand-blue), var(--brand-aqua))' }} aria-hidden />
            <CardHeader>
              <CardTitle>Booking details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Booking ID</label>
                  <p className="text-gray-900 font-mono text-sm">{booking.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--brand-cloud)', color: 'var(--brand-blue)' }}>
                      {booking.status === 'pending' ? 'Finding cleaner' : booking.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date & Time</label>
                  <p className="text-gray-900">
                    {format(new Date(booking.scheduled_start_at), 'EEEE, MMMM d, yyyy')}
                    <br />
                    {format(new Date(booking.scheduled_start_at), 'h:mm a')} - {format(new Date(booking.scheduled_end_at), 'h:mm a')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Service Type</label>
                  <p className="text-gray-900 capitalize">{booking.service_type?.replace('_', ' ') || 'Standard Cleaning'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900">{booking.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Amount</label>
                  <p className="text-gray-900 text-lg font-semibold">
                    {formatCurrency(booking.credit_amount * 10)} ({booking.credit_amount} credits)
                  </p>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Credits held for this booking</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {booking.credit_amount} credits are reserved. We keep a small buffer until the job is completed; any unused amount returns to your balance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Next Steps with Interactive Timeline */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {booking.status === 'pending' ? (
                  <>
                    <div className="flex items-start gap-3 p-3 rounded-xl border" style={{ backgroundColor: 'var(--brand-cloud)', borderColor: 'rgba(0,120,255,0.2)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'var(--brand-blue)' }}>
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">We're Finding the Perfect Cleaner</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Our system is matching you with qualified cleaners in your area. This usually takes a few minutes.
                        </p>
                        <p className="text-xs mt-2 font-medium" style={{ color: 'var(--brand-blue)' }}>
                          Estimated assignment time: 5-15 minutes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-gray-600 font-semibold">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">You'll Receive a Notification</h3>
                        <p className="text-gray-600 text-sm">
                          Once a cleaner accepts your booking, you'll receive an email and in-app notification with their details.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-gray-600 font-semibold">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Cleaner Will Arrive</h3>
                        <p className="text-gray-600 text-sm">
                          Your cleaner will arrive at the scheduled time. You can track their progress in real-time.
                        </p>
                      </div>
                    </div>
                  </>
                ) : booking.cleaner_id ? (
                  <>
                    <div className="flex items-start gap-3 p-3 rounded-xl border border-[var(--brand-mint)]/30" style={{ backgroundColor: 'rgba(40,199,111,0.08)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-[var(--brand-mint)]">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Cleaner Assigned!</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          A cleaner has been assigned to your booking. Check your booking details to see their profile and contact information.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 flex items-center gap-2"
                          onClick={() => router.push(`/messages?job=${bookingId}`)}
                        >
                          <MessageCircle className="h-4 w-4" />
                          Message Your Cleaner
                        </Button>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>

              {/* First-Time Client Tips */}
              {booking.status === 'pending' && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Tips for First-Time Clients
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Prepare your space by clearing clutter before the cleaner arrives</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Leave special instructions in the booking notes if needed</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>You can track your cleaner's arrival and progress in real-time</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>After completion, you'll be able to review and rate your cleaner</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              onClick={() => router.push(`/client/bookings/${booking.id}`)}
              className="flex-1"
            >
              View booking details
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/client')}
              className="flex-1 border-[var(--brand-blue)]/40 text-[var(--brand-blue)]"
            >
              Go to home
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/client/book')}
              className="flex-1"
            >
              Book another
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
