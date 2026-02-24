'use client';

import JobStatusRail from '@/components/trust/JobStatusRail';
import type { JobStatus } from '@/components/trust/jobStatus';

export default function JobCard({
  title,
  status,
}: {
  title: string;
  status: JobStatus;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-white">{title}</div>
        <span className="text-xs text-white/65 capitalize">
          {status.replace('_', ' ')}
        </span>
      </div>
      <div className="mt-3">
        <JobStatusRail status={status} />
      </div>
    </div>
  );
}
