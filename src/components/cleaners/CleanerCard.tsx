'use client';

import ReliabilityRing from '@/components/trust/ReliabilityRing';

export type Cleaner = {
  name: string;
  reliabilityScore: number;
  jobsLast30: number;
};

export default function CleanerCard({ cleaner }: { cleaner: Cleaner }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white">{cleaner.name}</div>
          <div className="mt-1 text-xs text-white/65">
            {cleaner.jobsLast30} jobs (30d)
          </div>
        </div>
        <ReliabilityRing score={cleaner.reliabilityScore} />
      </div>
    </div>
  );
}
