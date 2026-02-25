'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { JobStepper, type StepKey } from '@/components/job/JobStepper';
import { GradientButton } from '@/components/brand/GradientButton';
import {
  sendEnRoute,
  checkIn,
  submitJob,
  getJobTimeline,
} from '@/services/jobs';
import type { TimelineEvent } from '@/services/jobs';

export default function CleanerWorkflowPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const r = useRouter();
  const [active, setActive] = useState<StepKey>('enroute');
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    if (!jobId) return;
    getJobTimeline(jobId)
      .then((tl) => {
        setTimeline(tl);
        const types = new Set(tl.map((e) => e.type));
        if (types.has('job_submitted')) setActive('submit');
        else if (types.has('after_photos_uploaded')) setActive('submit');
        else if (types.has('before_photos_uploaded')) setActive('clean');
        else if (types.has('gps_check_in')) setActive('before');
        else if (types.has('en_route_sent')) setActive('checkin');
      })
      .catch(() => {});
  }, [jobId]);

  const types = new Set(timeline.map((e) => e.type));
  const hasBefore = types.has('before_photos_uploaded');
  const hasAfter = types.has('after_photos_uploaded');
  const canSubmit = hasBefore && hasAfter;
  const submitGuardrail =
    active === 'submit' && !canSubmit
      ? 'Upload before and after photos first, then you can submit to the client.'
      : null;

  async function primaryAction() {
    if (!jobId) return;

    if (active === 'submit' && !canSubmit) {
      return; // guardrail: no submit without before+after
    }

    if (active === 'enroute') {
      await sendEnRoute(jobId);
      setActive('checkin');
      return;
    }

    if (active === 'checkin') {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, {
          enableHighAccuracy: true,
          timeout: 10000,
        })
      );
      await checkIn(jobId, {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      setActive('before');
      return;
    }

    if (active === 'before') {
      r.push(`/cleaner/job/${jobId}/upload?kind=before`);
      return;
    }

    if (active === 'after') {
      r.push(`/cleaner/job/${jobId}/upload?kind=after`);
      return;
    }

    if (active === 'submit') {
      await submitJob(jobId);
      r.push(`/client/job/${jobId}`);
      return;
    }

    if (active === 'clean') setActive('after');
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <JobStepper
        active={active}
        onSetActive={setActive}
        onPrimary={primaryAction}
        submitDisabled={active === 'submit' && !canSubmit}
        guardrailMessage={submitGuardrail}
      />

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Fast actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {submitGuardrail && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              {submitGuardrail}
            </div>
          )}
          <GradientButton onClick={() => r.push(`/cleaner/job/${jobId}/upload?kind=before`)}>
            Upload before photos
          </GradientButton>
          <GradientButton onClick={() => r.push(`/cleaner/job/${jobId}/upload?kind=after`)}>
            Upload after photos
          </GradientButton>
        </CardContent>
      </Card>
    </div>
  );
}
