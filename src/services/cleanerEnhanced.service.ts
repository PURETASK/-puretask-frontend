// Cleaner Enhanced Services
import { apiClient } from '@/lib/api';

export const cleanerEnhancedService = {
  // Dashboard analytics
  getDashboardAnalytics: async (period: string = 'month') => {
    return apiClient.get(`/cleaner/dashboard/analytics?period=${period}`);
  },

  // Goals
  setGoal: async (type: string, target: number, period: string) => {
    return apiClient.post('/cleaner/goals', { type, target, period });
  },

  getGoals: async () => {
    return apiClient.get('/cleaner/goals');
  },

  // Calendar
  detectConflicts: async (startDate: string, endDate: string) => {
    return apiClient.get(`/cleaner/calendar/conflicts?start_date=${startDate}&end_date=${endDate}`);
  },

  optimizeSchedule: async (date: string) => {
    return apiClient.post('/cleaner/calendar/optimize', { date });
  },

  // Job matching
  getMatchingScore: async (jobId: string) => {
    return apiClient.get(`/cleaner/jobs/${jobId}/matching-score`);
  },

  setAutoAcceptRules: async (enabled: boolean, conditions: any) => {
    return apiClient.post('/cleaner/auto-accept-rules', { enabled, conditions });
  },

  // Job tools
  trackTime: async (jobId: string, action: string, timestamp?: string) => {
    return apiClient.post(`/cleaner/jobs/${jobId}/track-time`, { action, timestamp });
  },

  trackExpense: async (jobId: string, description: string, amount: number, category?: string) => {
    return apiClient.post(`/cleaner/jobs/${jobId}/expenses`, { description, amount, category });
  },

  getDirections: async (jobId: string) => {
    return apiClient.get(`/cleaner/jobs/${jobId}/directions`);
  },

  // Earnings
  getTaxReport: async (year?: number) => {
    return apiClient.get(`/cleaner/earnings/tax-report${year ? `?year=${year}` : ''}`);
  },

  getEarningsBreakdown: async (period: string = 'month') => {
    return apiClient.get(`/cleaner/earnings/breakdown?period=${period}`);
  },

  exportEarnings: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    return apiClient.get(`/cleaner/earnings/export?${params.toString()}`);
  },

  // Profile
  getProfileCompleteness: async () => {
    return apiClient.get('/cleaner/profile/completeness');
  },

  getProfilePreview: async () => {
    return apiClient.get('/cleaner/profile/preview');
  },

  getProfileInsights: async () => {
    return apiClient.get('/cleaner/profile/insights');
  },

  uploadIntroVideo: async (video_url: string) => {
    return apiClient.post('/cleaner/profile/video', { video_url });
  },

  // Availability
  getAvailabilitySuggestions: async () => {
    return apiClient.get('/cleaner/availability/suggestions');
  },

  applyAvailabilityTemplate: async (template: string, days?: number[]) => {
    return apiClient.post('/cleaner/availability/template', { template, days });
  },
};
