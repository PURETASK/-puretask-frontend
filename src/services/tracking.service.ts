/**
 * Tracking service: check-in / check-out (POST /tracking/:jobId/...).
 * Use with upload flow: sign → PUT to putUrl → commit → then call check-in/check-out with photo keys or URLs.
 */

import { apiClient } from '@/lib/api';

export type CheckInPayload = {
  location: { latitude: number; longitude: number; accuracy?: number };
  beforePhotos: string[]; // URLs or storage keys from upload flow
  accuracyM?: number;
  source?: 'device' | 'manual_override';
};

export type CheckOutPayload = {
  afterPhotos?: string[];
  notes?: string;
};

/** POST /tracking/:jobId/check-in — location + beforePhotos (cleaner only) */
export async function checkInTracking(jobId: string, payload: CheckInPayload) {
  return apiClient.post(`/tracking/${jobId}/check-in`, payload);
}

/** POST /tracking/:jobId/check-out — after photos, notes (cleaner only) */
export async function checkOutTracking(jobId: string, payload: CheckOutPayload) {
  return apiClient.post(`/tracking/${jobId}/check-out`, payload);
}
