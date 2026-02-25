import { apiClient } from '@/lib/api';

export type TimelineEventType =
  | 'job_assigned'
  | 'en_route_sent'
  | 'gps_check_in'
  | 'before_photos_uploaded'
  | 'timer_started'
  | 'timer_paused'
  | 'timer_resumed'
  | 'gps_check_out'
  | 'after_photos_uploaded'
  | 'job_submitted'
  | 'client_approved'
  | 'dispute_opened'
  | 'dispute_resolved';

export type Job = {
  id: string;
  status: string;
  addressLabel: string;
  lat: number;
  lng: number;
  scheduledStart?: string;
  scheduledEnd?: string;
  cleaner?: { id: string; name: string; tier?: string };
};

export type TimelineEvent = {
  id: string;
  type: TimelineEventType;
  createdAt: string;
  meta?: Record<string, unknown>;
};

export type JobPhotos = {
  before: Array<{ id: string; url: string; createdAt: string }>;
  after: Array<{ id: string; url: string; createdAt: string }>;
};

export async function getJob(jobId: string) {
  const data = await apiClient.get<Job>(`/api/v1/jobs/${jobId}`);
  return data as Job;
}

/** GET /jobs/:jobId/timeline — use for stepper (ASC order). */
export async function getJobTimeline(jobId: string) {
  const data = await apiClient.get<TimelineEvent[]>(`/jobs/${jobId}/timeline`);
  return data as TimelineEvent[];
}

export async function getJobPhotos(jobId: string) {
  const data = await apiClient.get<JobPhotos>(`/api/v1/jobs/${jobId}/photos`);
  return data as JobPhotos;
}

export async function sendEnRoute(jobId: string) {
  return apiClient.post(`/api/v1/jobs/${jobId}/events/en-route`);
}

export async function checkIn(jobId: string, coords: { lat: number; lng: number }) {
  return apiClient.post(`/api/v1/jobs/${jobId}/events/check-in`, coords);
}

export async function submitJob(jobId: string) {
  return apiClient.post(`/api/v1/jobs/${jobId}/events/submit`);
}

/** POST /tracking/:jobId/approve — auth + job ownership required */
export async function approveJob(jobId: string, payload?: { rating?: number; note?: string }) {
  return apiClient.post(`/tracking/${jobId}/approve`, payload ?? {});
}

/** POST /tracking/:jobId/dispute — auth + job ownership required */
export async function openDispute(
  jobId: string,
  payload: { reason: string; details: string }
) {
  return apiClient.post(`/tracking/${jobId}/dispute`, payload);
}
