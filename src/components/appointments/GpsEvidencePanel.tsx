'use client';

import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { GpsEvidence } from '@/types/appointment';
import { MapPin } from 'lucide-react';

const EVENT_LABELS: Record<string, string> = {
  en_route: 'En route',
  arrived: 'Arrived',
  check_in: 'Checked in',
  check_out: 'Checked out',
};

interface GpsEvidencePanelProps {
  events: GpsEvidence[];
}

export function GpsEvidencePanel({ events }: GpsEvidencePanelProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-gray-900">GPS evidence</h3>
        <p className="text-sm text-gray-500">No GPS events recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 font-semibold text-gray-900">GPS evidence</h3>
      <div className="space-y-3">
        {events.map((ev) => (
          <div
            key={ev.id}
            className={cn(
              'flex items-start gap-3 rounded-lg border p-3',
              ev.source === 'manual_override' ? 'border-amber-200 bg-amber-50' : 'border-gray-200'
            )}
          >
            <MapPin className="h-5 w-5 flex-shrink-0 text-gray-500" />
            <div>
              <p className="font-medium text-gray-900">
                {EVENT_LABELS[ev.event] ?? ev.event} — {format(new Date(ev.atISO), 'h:mm a')}
              </p>
              <p className="text-sm text-gray-600">
                GPS verified
                {ev.accuracyM != null && ` (±${ev.accuracyM}m)`}
                {ev.source === 'manual_override' && ' · Manual override'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
