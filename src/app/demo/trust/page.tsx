import React from 'react';
import Link from 'next/link';
import CleanerCard from '@/components/cleaners/CleanerCard';
import JobCard from '@/components/jobs/JobCard';

export default function TrustDemoPage() {
  return (
    <main className="min-h-screen bg-[#0B0E14] p-8 text-white">
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/"
          className="text-sm text-white/70 hover:text-white underline"
        >
          ← Home
        </Link>
        <h1 className="text-xl font-semibold text-white/90">
          Trust layer demos (Reliability Ring + Job Status Rail)
        </h1>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/65">
          Reliability Ring (2A)
        </h2>
        <div className="max-w-md space-y-4">
          <CleanerCard
            cleaner={{
              name: 'Alyssa M.',
              reliabilityScore: 93,
              jobsLast30: 18,
            }}
          />
          <CleanerCard
            cleaner={{
              name: 'Jordan K.',
              reliabilityScore: 82,
              jobsLast30: 12,
            }}
          />
          <CleanerCard
            cleaner={{
              name: 'Rina S.',
              reliabilityScore: 64,
              jobsLast30: 5,
            }}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/65">
          Job Status Rail (2B)
        </h2>
        <div className="max-w-xl space-y-4">
          <JobCard title="Standard Clean — 2 Bed" status="booked" />
          <JobCard title="Deep Clean — Kitchen" status="on_route" />
          <JobCard title="Move-out Clean — 3 Bed" status="working" />
          <JobCard title="Standard Clean — Studio" status="completed" />
        </div>
      </section>
    </main>
  );
}
