import { apiClient } from '@/lib/api';

export interface Holiday {
  holiday_date: string;
  name: string;
  is_federal: boolean;
  bank_holiday: boolean;
  support_limited: boolean;
}

export interface CleanerHolidaySettings {
  available_on_federal_holidays: boolean;
  holiday_rate_enabled: boolean;
  holiday_rate_multiplier: number;
}

export interface CleanerHolidayOverride {
  holiday_date: string;
  name: string;
  available: boolean;
  start_time_local: string | null;
  end_time_local: string | null;
  use_holiday_rate: boolean | null;
  min_job_hours: number | null;
  notes: string | null;
}

export const holidayService = {
  getHolidayByDate: async (date: string) => {
    return apiClient.get<{ holiday: Holiday | null }>(`/holidays`, { params: { date } });
  },
  listHolidays: async (params?: { from?: string; to?: string; limit?: number }) => {
    return apiClient.get<{ holidays: Holiday[] }>(`/holidays`, { params });
  },
  getCleanerHolidaySettings: async () => {
    return apiClient.get<{ settings: CleanerHolidaySettings }>(`/cleaner/holiday-settings`);
  },
  updateCleanerHolidaySettings: async (settings: Partial<CleanerHolidaySettings>) => {
    return apiClient.put<{ settings: CleanerHolidaySettings }>(`/cleaner/holiday-settings`, settings);
  },
  listCleanerHolidayOverrides: async (params?: { from?: string; to?: string }) => {
    return apiClient.get<{ overrides: CleanerHolidayOverride[]; range: { from: string; to: string } }>(
      `/cleaner/holiday-overrides`,
      { params }
    );
  },
  upsertCleanerHolidayOverride: async (
    holidayDate: string,
    payload: Omit<CleanerHolidayOverride, 'holiday_date' | 'name'>
  ) => {
    return apiClient.put<{ override: CleanerHolidayOverride }>(`/cleaner/holiday-overrides/${holidayDate}`, payload);
  },
};
