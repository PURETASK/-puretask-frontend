import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { TimelineEvent } from '@/services/jobs';

const pretty: Record<string, string> = {
  en_route_sent: 'En route sent',
  gps_check_in: 'Checked in (GPS)',
  before_photos_uploaded: 'Before photos uploaded',
  timer_started: 'Timer started',
  gps_check_out: 'Checked out (GPS)',
  after_photos_uploaded: 'After photos uploaded',
  job_submitted: 'Submitted to client',
  client_approved: 'Client approved',
  dispute_opened: 'Dispute opened',
};

export function JobTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="space-y-2">
      {events.map((e) => (
        <div
          key={e.id}
          className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm"
        >
          <div>
            <div className="text-sm font-semibold">{pretty[e.type] ?? e.type}</div>
            <div className="text-xs opacity-70">
              {new Date(e.createdAt).toLocaleString()}
            </div>
          </div>
          <Badge
            className={cn('rounded-full')}
            style={{ background: 'rgba(0,120,255,0.12)', color: '#1D2533' }}
          >
            {e.type}
          </Badge>
        </div>
      ))}
    </div>
  );
}
