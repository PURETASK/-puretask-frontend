'use client';

import { useEffect, useRef, useState } from 'react';
import type { TrackingState } from '@/types/jobDetails';
import { getJobTracking } from '@/services/jobDetails.service';

/**
 * Poll GET /tracking/:jobId for live presence (cleaner location, status). Use on Job Details page.
 * @param jobId - Job/booking id
 * @param intervalMs - Poll interval (default 8000 = 8s)
 * @param enabled - When false, does not start polling (e.g. when job not yet loaded or not in active statuses)
 */
export function useJobTrackingPoll(
  jobId: string | null,
  intervalMs = 8000,
  enabled = true
) {
  const [tracking, setTracking] = useState<TrackingState | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inflightRef = useRef(false);

  useEffect(() => {
    if (!jobId || !enabled) return;

    const tick = async () => {
      if (inflightRef.current) return;
      inflightRef.current = true;
      try {
        const data = await getJobTracking(jobId);
        setTracking(data);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        inflightRef.current = false;
      }
    };

    tick();
    timerRef.current = setInterval(tick, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [jobId, intervalMs, enabled]);

  return { tracking, error };
}
