import { apiClient } from '@/lib/api';

export type CleanerNextJob = {
  jobId: string;
  addressLabel: string;
  lat: number;
  lng: number;
  etaMinutes?: number;
};

export async function getCleanerNextJob() {
  const data = await apiClient.get<CleanerNextJob>('/api/v1/cleaner/next-job');
  return data as CleanerNextJob;
}

export async function sendCleanerLocation(payload: { lat: number; lng: number }) {
  return apiClient.post('/api/v1/cleaner/location', payload);
}
