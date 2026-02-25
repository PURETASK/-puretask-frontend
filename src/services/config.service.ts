import { apiClient } from '@/lib/api';

/**
 * Optional backend config for job status.
 * GET /config/job-status — use for status/transition logic when available;
 * otherwise frontend uses src/constants/jobStatus.ts.
 */

export type JobStatusConfigResponse = {
  statuses: string[];
  terminal?: string[];
  transitions?: Record<string, string[]>;
  labels?: Record<string, string>;
};

export async function getJobStatusConfig(): Promise<JobStatusConfigResponse | null> {
  try {
    const data = await apiClient.get<JobStatusConfigResponse>('/config/job-status');
    return data ?? null;
  } catch {
    return null;
  }
}
