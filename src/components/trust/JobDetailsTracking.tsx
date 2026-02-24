'use client';

import React from 'react';
import { format } from 'date-fns';
import JobStatusRail from '@/components/trust/JobStatusRail';
import ReliabilityRing from '@/components/trust/ReliabilityRing';
import { mapBackendJobStatusToRail } from '@/components/trust/jobStatus';
import type { JobDetailsDTO, JobCheckIn, JobPhoto, TrackingState } from '@/types/jobDetails';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { MapPin, Clock, User, CreditCard, Camera } from 'lucide-react';

type JobDetailsTrackingProps = {
  details: JobDetailsDTO;
  /** Optional: live tracking from GET /tracking/:jobId (poll 5–10s) for presence dot / status */
  tracking?: TrackingState | null;
  /** Optional: show compact rail */
  compact?: boolean;
};

function LedgerPhase({
  ledger,
}: {
  ledger: JobDetailsDTO['ledger'];
}) {
  const hasEscrow = ledger.ledgerEntries.some((e) => e.reason === 'job_escrow');
  const hasRelease = ledger.ledgerEntries.some((e) => e.reason === 'job_release');
  const hasPayout = ledger.payout && ['paid', 'completed', 'succeeded'].includes(ledger.payout.status.toLowerCase());

  let phase: 'pending' | 'moving' | 'settled' = 'pending';
  if (hasPayout) phase = 'settled';
  else if (hasRelease) phase = 'moving';
  else if (hasEscrow) phase = 'pending';

  const labels = { pending: 'Pending', moving: 'Moving', settled: 'Settled' };
  const colors = {
    pending: 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
    moving: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
    settled: 'bg-green-500/20 text-green-700 dark:text-green-400',
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[phase]}`}>
        {labels[phase]}
      </span>
      {ledger.paymentIntent && (
        <span className="text-xs text-gray-500">
          {ledger.paymentIntent.amount_cents / 100} {ledger.paymentIntent.currency.toUpperCase()}
        </span>
      )}
    </div>
  );
}

function PresenceBlock({ checkins }: { checkins: JobCheckIn[] }) {
  const lastCheckIn = checkins.filter((c) => c.type === 'check_in').pop();
  const lastCheckOut = checkins.filter((c) => c.type === 'check_out').pop();
  const checkedIn = lastCheckIn && (!lastCheckOut || new Date(lastCheckOut.created_at) < new Date(lastCheckIn.created_at));

  if (checkins.length === 0) return null;

  return (
    <div className="space-y-1">
      {checkedIn && (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
          Checked in
        </span>
      )}
      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
        {checkins.slice(-5).reverse().map((c) => (
          <li key={c.id}>
            {c.type === 'check_in' ? 'In' : 'Out'} — {format(new Date(c.created_at), 'MMM d, h:mm a')}
            {c.is_within_radius != null && (
              <span className="ml-1">{c.is_within_radius ? '✓ on site' : ''}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PhotosBlock({ photos }: { photos: JobPhoto[] }) {
  const before = photos.filter((p) => p.type === 'before');
  const after = photos.filter((p) => p.type === 'after');
  if (before.length === 0 && after.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2">
      {before.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Before</p>
          <div className="flex gap-1 flex-wrap">
            {before.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-20 h-20 rounded-lg overflow-hidden bg-gray-100"
              >
                <img src={p.thumbnail_url || p.url} alt="Before" className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        </div>
      )}
      {after.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">After</p>
          <div className="flex gap-1 flex-wrap">
            {after.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-20 h-20 rounded-lg overflow-hidden bg-gray-100"
              >
                <img src={p.thumbnail_url || p.url} alt="After" className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobDetailsTracking({ details, tracking = null, compact = false }: JobDetailsTrackingProps) {
  const { job, cleaner, presence, ledger, photos } = details;
  const effectiveStatus = tracking?.status ?? job.status;
  const railStatus = mapBackendJobStatusToRail(effectiveStatus);
  const isCancelledOrDisputed = ['cancelled', 'disputed'].includes((effectiveStatus || '').toLowerCase());

  return (
    <div className="space-y-4">
      {/* Timeline rail */}
      {!isCancelledOrDisputed && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <JobStatusRail status={railStatus} compact={compact} />
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {format(new Date(job.scheduled_start_at), 'MMM d, h:mm a')} – {format(new Date(job.scheduled_end_at), 'h:mm a')}
              </span>
              {job.address && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.address}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cleaner + Reliability ring */}
      {cleaner && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Cleaner
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {cleaner.full_name || cleaner.name || 'Cleaner'}
              </p>
              {(cleaner.avg_rating != null || cleaner.jobs_completed != null) && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {cleaner.avg_rating != null && `${cleaner.avg_rating.toFixed(1)} rating`}
                  {cleaner.avg_rating != null && cleaner.jobs_completed != null && ' · '}
                  {cleaner.jobs_completed != null && `${cleaner.jobs_completed} jobs`}
                </p>
              )}
            </div>
            {cleaner.reliability_score != null && (
              <ReliabilityRing
                score={cleaner.reliability_score}
                size={44}
                stroke={6}
                showNumber
                variant="light"
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Ledger flow */}
      {(ledger.ledgerEntries.length > 0 || ledger.paymentIntent || ledger.payout) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LedgerPhase ledger={ledger} />
          </CardContent>
        </Card>
      )}

      {/* Presence / check-ins + live location */}
      {(presence.checkins.length > 0 || tracking?.currentLocation) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Presence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {tracking?.currentLocation && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                Live location active
              </span>
            )}
            <PresenceBlock checkins={presence.checkins} />
          </CardContent>
        </Card>
      )}

      {/* Before/after photos */}
      {photos.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PhotosBlock photos={photos} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
