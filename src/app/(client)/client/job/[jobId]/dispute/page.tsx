'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { GradientButton } from '@/components/brand/GradientButton';
import { Textarea } from '@/components/ui/Textarea';
import { openDispute } from '@/services/jobs';

export default function ClientDisputePage() {
  const { jobId } = useParams<{ jobId: string }>();
  const r = useRouter();
  const [reason, setReason] = useState('quality');
  const [details, setDetails] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!jobId) return;
    setBusy(true);
    try {
      await openDispute(jobId, { reason, details });
      r.push(`/client/job/${jobId}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Open a dispute</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          We’ll review your case and get back to you. You can add more details below.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { k: 'quality', t: 'Quality not as expected' },
            { k: 'missing', t: 'Areas were missed' },
            { k: 'timing', t: 'Timing/access issue' },
            { k: 'other', t: 'Other' },
          ].map((x) => (
            <button
              key={x.k}
              type="button"
              onClick={() => setReason(x.k)}
              className="rounded-3xl border bg-white p-4 text-left shadow-sm"
              style={
                reason === x.k
                  ? {
                      backgroundImage: 'linear-gradient(90deg,#0078FF,#00D4FF)',
                      color: 'white',
                      borderColor: 'transparent',
                    }
                  : undefined
              }
            >
              <div className="text-sm font-semibold">{x.t}</div>
              <div className="text-xs opacity-70">Select</div>
            </button>
          ))}
        </div>

        <Textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="min-h-[140px] rounded-3xl"
          placeholder="Tell us what went wrong. Mention rooms/areas and expectations."
        />

        <GradientButton disabled={busy} onClick={submit}>
          {busy ? 'Submitting...' : 'Submit dispute'}
        </GradientButton>

        <div className="mt-6 p-4 rounded-2xl bg-gray-50 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">What happens next?</h4>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>We typically respond within 24–48 hours.</li>
            <li>Our team may contact you or your cleaner for more details.</li>
            <li>Possible outcomes: full or partial refund, or release of payment to the cleaner.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
