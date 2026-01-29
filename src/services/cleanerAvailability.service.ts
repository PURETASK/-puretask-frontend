import { apiClient } from '@/lib/api';

export interface WeeklyAvailability {
  monday?: Array<{ start: string; end: string }>;
  tuesday?: Array<{ start: string; end: string }>;
  wednesday?: Array<{ start: string; end: string }>;
  thursday?: Array<{ start: string; end: string }>;
  friday?: Array<{ start: string; end: string }>;
  saturday?: Array<{ start: string; end: string }>;
  sunday?: Array<{ start: string; end: string }>;
}

export interface TimeOff {
  id: string;
  start_date: string;
  end_date: string;
  all_day: boolean;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
  created_at: string;
}

export interface CleanerSchedule {
  bookings: Array<{
    id: string;
    scheduled_start_at: string;
    scheduled_end_at: string;
    address: string;
    client_name: string;
    status: string;
  }>;
  timeOff: TimeOff[];
}

export const cleanerAvailabilityService = {
  // Get availability
  getAvailability: async (): Promise<WeeklyAvailability> => {
    const response = await apiClient.get<{ availability: WeeklyAvailability }>('/cleaner/availability');
    return response.availability;
  },

  // Update availability
  updateAvailability: async (availability: WeeklyAvailability): Promise<WeeklyAvailability> => {
    const response = await apiClient.put<{ availability: WeeklyAvailability }>('/cleaner/availability', availability);
    return response.availability;
  },

  // Get schedule (bookings + time off)
  getSchedule: async (params?: { from?: string; to?: string }): Promise<CleanerSchedule> => {
    return apiClient.get<CleanerSchedule>('/cleaner/schedule', { params });
  },

  // Get time off
  getTimeOff: async (): Promise<TimeOff[]> => {
    const response = await apiClient.get<{ timeOff: TimeOff[] }>('/cleaner/time-off');
    return response.timeOff;
  },

  // Add time off
  addTimeOff: async (data: {
    startDate: string;
    endDate: string;
    allDay?: boolean;
    startTime?: string;
    endTime?: string;
    reason?: string;
  }): Promise<TimeOff> => {
    const response = await apiClient.post<{ timeOff: TimeOff }>('/cleaner/time-off', data);
    return response.timeOff;
  },

  // Delete time off
  deleteTimeOff: async (id: string): Promise<void> => {
    await apiClient.delete(`/cleaner/time-off/${id}`);
  },
};
