import { apiClient } from '@/lib/api';
import { jobService } from '@/services/job.service';
import type {
  JobDetailsDTO,
  JobDetailsJob,
  JobDetailsCleaner,
  JobDetailsLedger,
  JobDetailsResponse,
  JobPhoto,
  TrackingState,
} from '@/types/jobDetails';
import type { Job } from '@/types/api';

/** Backend may wrap in { data: { ... } }; unwrap once. */
function unwrapData<T>(res: T | { data: T }): T {
  return (res as { data?: T }).data !== undefined ? (res as { data: T }).data : (res as T);
}

function normalizeJobFromApi(job: Job | JobDetailsJob & { cleaning_type?: string }): JobDetailsJob {
  return {
    id: job.id,
    status: job.status,
    scheduled_start_at: job.scheduled_start_at,
    scheduled_end_at: job.scheduled_end_at,
    actual_start_at: (job as JobDetailsJob).actual_start_at ?? undefined,
    actual_end_at: (job as JobDetailsJob).actual_end_at ?? undefined,
    address: job.address,
    latitude: (job as JobDetailsJob).latitude ?? undefined,
    longitude: (job as JobDetailsJob).longitude ?? undefined,
    credit_amount: job.credit_amount,
    client_id: (job as Job).client_id,
    cleaner_id: (job as Job).cleaner_id ?? undefined,
    service_type: job.service_type ?? (job as { cleaning_type?: string }).cleaning_type,
    created_at: (job as Job).created_at,
  };
}

/**
 * Fetch full job details. Prefers GET /jobs/:jobId/details.
 * If that endpoint is not implemented (404), falls back to GET /jobs/:jobId and returns a minimal DTO.
 */
export async function getJobDetails(jobId: string): Promise<JobDetailsDTO> {
  try {
    const res = await apiClient.get<JobDetailsResponse | { data: JobDetailsResponse }>(`/jobs/${jobId}/details`);
    const payload = unwrapData<JobDetailsResponse>(res);
    const job = normalizeJobFromApi(payload.job);
    return {
      job,
      cleaner: payload.cleaner ?? null,
      presence: {
        checkins: payload.checkins ?? [],
        lastCleanerPosition: undefined,
      },
      ledger: {
        ledgerEntries: payload.ledgerEntries ?? [],
        paymentIntent: payload.paymentIntent ?? null,
        payout: payload.payout ?? null,
      },
      photos: payload.photos ?? [],
    };
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 404 || status === 501) {
      const raw = await jobService.getJob(jobId);
      const jobPayload = unwrapData<{ job: Job }>(raw);
      const jobRow = jobPayload.job as (Job & {
        actual_start_at?: string;
        actual_end_at?: string;
        latitude?: number;
        longitude?: number;
        cleaning_type?: string;
        cleaner?: { id?: string; full_name?: string; name?: string; reliability_score?: number; tier?: string; avg_rating?: number; jobs_completed?: number };
      }) | undefined;
      if (!jobRow) throw new Error('Job not found');
      const minimal: JobDetailsDTO = {
        job: normalizeJobFromApi(jobRow),
        cleaner: jobRow.cleaner
          ? {
              id: jobRow.cleaner.id ?? (jobRow as Job).cleaner_id ?? '',
              full_name: jobRow.cleaner.full_name,
              name: jobRow.cleaner.name,
              reliability_score: jobRow.cleaner.reliability_score,
              tier: jobRow.cleaner.tier,
              avg_rating: jobRow.cleaner.avg_rating,
              jobs_completed: jobRow.cleaner.jobs_completed,
            }
          : null,
        presence: { checkins: [] },
        ledger: { ledgerEntries: [], paymentIntent: null, payout: null },
        photos: [],
      };
      return minimal;
    }
    throw err;
  }
}

/**
 * Fetch live tracking state (presence, current cleaner location). Poll every 5–10s on the Job Details page.
 */
export async function getJobTracking(jobId: string): Promise<TrackingState> {
  const res = await apiClient.get<TrackingState | { data: TrackingState }>(`/tracking/${jobId}`);
  return unwrapData<TrackingState>(res);
}
