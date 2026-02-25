// src/app/(cleaner)/cleaner/job/[jobId]/tracking/page.tsx
// Full tracking flow: check-in (location + before photos) and check-out (after photos + notes).
// Uses POST /tracking/:jobId/check-in and POST /tracking/:jobId/check-out.

'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PhotoUploader } from '@/components/upload/PhotoUploader';
import { Textarea } from '@/components/ui/Textarea';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { checkInTracking, checkOutTracking } from '@/services/tracking.service';
import { getJobTimeline } from '@/services/jobs';
import { useToast } from '@/contexts/ToastContext';
import { MapPin, LogOut } from 'lucide-react';

function TrackingContent() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [timeline, setTimeline] = useState<string[]>([]);
  const [loadingTimeline, setLoadingTimeline] = useState(true);

  const [beforeKeys, setBeforeKeys] = useState<string[]>([]);
  const [afterKeys, setAfterKeys] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [checkInBusy, setCheckInBusy] = useState(false);
  const [checkOutBusy, setCheckOutBusy] = useState(false);

  const hasBefore = timeline.some((t) => t === 'before_photos_uploaded' || t === 'gps_check_in');
  const hasAfter = timeline.some((t) => t === 'after_photos_uploaded');

  React.useEffect(() => {
    if (!jobId) return;
    getJobTimeline(jobId)
      .then((events) => setTimeline(events.map((e) => e.type)))
      .catch(() => setTimeline([]))
      .finally(() => setLoadingTimeline(false));
  }, [jobId]);

  const getLocation = (): Promise<{ latitude: number; longitude: number; accuracy?: number }> =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy ?? undefined,
          }),
        reject,
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });

  const handleCheckIn = async () => {
    if (!jobId || beforeKeys.length === 0) {
      showToast('Upload at least one before photo first', 'error');
      return;
    }
    setCheckInBusy(true);
    try {
      const location = await getLocation();
      await checkInTracking(jobId, {
        location,
        beforePhotos: beforeKeys,
        source: 'device',
      });
      showToast('Check-in recorded', 'success');
      setBeforeKeys([]);
      setTimeline((prev) => [...prev, 'before_photos_uploaded', 'gps_check_in']);
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Check-in failed', 'error');
    } finally {
      setCheckInBusy(false);
    }
  };

  const handleCheckOut = async () => {
    if (!jobId) return;
    if (afterKeys.length === 0) {
      showToast('Upload at least one after photo first', 'error');
      return;
    }
    setCheckOutBusy(true);
    try {
      await checkOutTracking(jobId, {
        afterPhotos: afterKeys,
        notes: notes.trim() || undefined,
      });
      showToast('Check-out recorded', 'success');
      setAfterKeys([]);
      setNotes('');
      setTimeline((prev) => [...prev, 'after_photos_uploaded']);
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Check-out failed', 'error');
    } finally {
      setCheckOutBusy(false);
    }
  };

  if (!jobId) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6 max-w-2xl mx-auto w-full">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/cleaner/job/${jobId}/workflow`)}
          className="mb-4"
        >
          ← Back to workflow
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Job tracking</h1>
        <p className="text-gray-600 mb-6">
          Check in with location and before photos; check out with after photos and notes.
        </p>

        {loadingTimeline ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : (
          <div className="space-y-6">
            {/* Check-in */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Check-in
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Add before photos, then submit with your current location.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <PhotoUploader
                  jobId={jobId}
                  kind="before"
                  title="Before photos"
                  minRequired={1}
                  onUploadedKeys={(keys) => setBeforeKeys((prev) => [...prev, ...keys])}
                />
                <Button
                  variant="primary"
                  onClick={handleCheckIn}
                  disabled={checkInBusy || beforeKeys.length === 0}
                >
                  {checkInBusy ? 'Submitting…' : 'Check in (location + photos)'}
                </Button>
                {hasBefore && (
                  <p className="text-sm text-green-600">Check-in recorded.</p>
                )}
              </CardContent>
            </Card>

            {/* Check-out */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Check-out
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Add after photos and optional notes, then submit.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <PhotoUploader
                  jobId={jobId}
                  kind="after"
                  title="After photos"
                  minRequired={1}
                  onUploadedKeys={(keys) => setAfterKeys((prev) => [...prev, ...keys])}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any notes for the client or support..."
                    className="min-h-[80px]"
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={handleCheckOut}
                  disabled={checkOutBusy || afterKeys.length === 0}
                >
                  {checkOutBusy ? 'Submitting…' : 'Check out'}
                </Button>
                {hasAfter && (
                  <p className="text-sm text-green-600">Check-out recorded.</p>
                )}
              </CardContent>
            </Card>

            {hasBefore && hasAfter && (
              <Button variant="outline" onClick={() => router.push(`/cleaner/job/${jobId}/workflow`)}>
                Back to workflow
              </Button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function CleanerJobTrackingPage() {
  return (
    <ProtectedRoute requiredRole="cleaner">
      <TrackingContent />
    </ProtectedRoute>
  );
}
