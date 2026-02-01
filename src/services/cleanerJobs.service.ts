import { apiClient } from '@/lib/api';
import type { Job } from '@/types/api';

export interface AvailableJob extends Job {
  client?: {
    id: string;
    full_name: string;
    rating?: number;
  };
  distance_miles?: number;
}

export interface CleanerJobsResponse {
  assigned: Job[];
  available: AvailableJob[];
}

export interface AcceptJobResponse {
  job: Job;
}

export const cleanerJobsService = {
  // Get available jobs for cleaner
  getAvailableJobs: async (): Promise<AvailableJob[]> => {
    const response = await apiClient.get<CleanerJobsResponse>('/jobs');
    return response.available || [];
  },

  // Get assigned jobs for cleaner
  getAssignedJobs: async (): Promise<Job[]> => {
    const response = await apiClient.get<CleanerJobsResponse>('/jobs');
    return response.assigned || [];
  },

  // Accept a job
  acceptJob: async (jobId: string): Promise<AcceptJobResponse> => {
    return apiClient.post<AcceptJobResponse>(`/jobs/${jobId}/transition`, {
      event_type: 'job_accepted',
    });
  },

  // Get job details
  getJob: async (jobId: string) => {
    return apiClient.get<{ job: Job }>(`/jobs/${jobId}`);
  },
};
