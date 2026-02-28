'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageShell } from '@/components/layout/PageShell';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useBookings } from '@/hooks/useBookings';
import { format } from 'date-fns';
import { MapPin, Clock, Play, ChevronRight, CalendarX } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import Link from 'next/link';

export default function CleanerTodayPage() {
  return (
    <ProtectedRoute requiredRole="cleaner">
      <CleanerTodayContent />
    </ProtectedRoute>
  );
}

function CleanerTodayContent() {
  const router = useRouter();
  usePageTitle("Today's jobs");
  const { data: bookingsData, isLoading } = useBookings();
  const bookings = bookingsData?.bookings || [];
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayJobs = bookings
    .filter(
      (b: any) =>
        (b.status === 'scheduled' || b.status === 'confirmed') &&
        b.scheduled_start_at &&
        format(new Date(b.scheduled_start_at), 'yyyy-MM-dd') === today
    )
    .sort(
      (a: any, b: any) =>
        new Date(a.scheduled_start_at).getTime() - new Date(b.scheduled_start_at).getTime()
    );

  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      <main className="flex-1">
        <PageShell
          title="Today's jobs"
          subtitle={todayJobs.length ? `${todayJobs.length} job${todayJobs.length !== 1 ? 's' : ''} scheduled for ${format(new Date(), 'MMMM d')}` : `No jobs scheduled for ${format(new Date(), 'MMMM d')}`}
          back={{ href: '/cleaner', label: 'Back to home' }}
          maxWidth="content"
        >
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-32 rounded-xl bg-gray-100 animate-pulse" />
              <div className="h-32 rounded-xl bg-gray-100 animate-pulse" />
            </div>
          ) : todayJobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <CalendarX className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs today</h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  You don’t have any jobs scheduled for today. Check new requests or your calendar.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button variant="primary" onClick={() => router.push('/cleaner/jobs/requests')}>
                    View new requests
                  </Button>
                  <Link href="/cleaner/calendar">
                    <Button variant="outline">Open calendar</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {todayJobs.map((job: any) => (
                <Card key={job.id} className="overflow-hidden card-interactive">
                  <CardContent className="p-0">
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span>{format(new Date(job.scheduled_start_at), 'h:mm a')}</span>
                          <span className="text-gray-300">·</span>
                          <span className="capitalize">
                            {(job.service_type || 'cleaning').replace('_', ' ')}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-900 truncate">{job.address}</p>
                        {job.client?.full_name && (
                          <p className="text-sm text-gray-600 mt-0.5">
                            Client: {job.client.full_name}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="primary"
                          size="sm"
                          className="gap-2"
                          onClick={() => router.push(`/cleaner/job/${job.id}/workflow`)}
                        >
                          <Play className="h-4 w-4" />
                          Start
                        </Button>
                        <Link href={`/cleaner/jobs/${job.id}`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            Details
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
                      <span className="truncate">{job.address}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </PageShell>
      </main>
      <Footer />
    </div>
  );
}
