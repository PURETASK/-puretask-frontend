// Admin Enhanced Services
import { apiClient } from '@/lib/api';

export const adminEnhancedService = {
  // Dashboard
  getRealtimeMetrics: async () => {
    return apiClient.get('/admin/dashboard/realtime');
  },

  getAlerts: async (severity?: string) => {
    return apiClient.get(`/admin/dashboard/alerts${severity ? `?severity=${severity}` : ''}`);
  },

  getSystemHealth: async () => {
    return apiClient.get('/admin/system/health');
  },

  // Jobs
  bulkAction: async (jobIds: string[], action: string, params?: any) => {
    return apiClient.post('/admin/jobs/bulk-action', { job_ids: jobIds, action, params });
  },

  getJobInsights: async () => {
    return apiClient.get('/admin/jobs/insights');
  },

  // Disputes
  analyzeDispute: async (id: string) => {
    return apiClient.post(`/admin/disputes/${id}/analyze`);
  },

  getDisputeInsights: async () => {
    return apiClient.get('/admin/disputes/insights');
  },

  getDisputesWithInsights: async (filters?: any) => {
    return apiClient.get('/admin/disputes/with-insights', { params: filters });
  },

  // Users
  getRiskProfile: async (userId: string) => {
    return apiClient.get(`/admin/users/${userId}/risk-profile`);
  },

  takeRiskAction: async (userId: string, action: string, reason?: string, duration?: number) => {
    return apiClient.post(`/admin/users/${userId}/risk-action`, { action, reason, duration });
  },

  // Analytics
  buildCustomReport: async (name: string, metrics: string[], dateRange: any, filters?: any) => {
    return apiClient.post('/admin/analytics/custom-report', {
      name,
      metrics,
      date_range: dateRange,
      filters,
    });
  },

  getAnalyticsInsights: async () => {
    return apiClient.get('/admin/analytics/insights');
  },

  // Finance
  getForecast: async (months: number = 3) => {
    return apiClient.get(`/admin/finance/forecast?months=${months}`);
  },

  getFinanceReports: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    return apiClient.get(`/admin/finance/reports?${params.toString()}`);
  },

  // Communication
  getTemplates: async () => {
    return apiClient.get('/admin/communication/templates');
  },

  sendMessage: async (templateId: string, subject: string, body: string, recipients: string[], channel: string) => {
    return apiClient.post('/admin/communication/send', {
      template_id: templateId,
      subject,
      body,
      recipients,
      channel,
    });
  },

  getCommunicationAnalytics: async () => {
    return apiClient.get('/admin/communication/analytics');
  },

  // Risk
  getRiskScoring: async () => {
    return apiClient.get('/admin/risk/scoring');
  },

  mitigateRisk: async (userId: string, action: string, reason?: string) => {
    return apiClient.post('/admin/risk/mitigate', { user_id: userId, action, reason });
  },

  // Reports
  buildReport: async (config: any) => {
    return apiClient.post('/admin/reports/build', config);
  },

  scheduleReport: async (reportId: string, frequency: string, recipients: string[]) => {
    return apiClient.post('/admin/reports/schedule', { report_id: reportId, frequency, recipients });
  },

  // Settings
  getFeatureFlags: async () => {
    return apiClient.get('/admin/settings/feature-flags');
  },

  getAuditLog: async (limit: number = 50) => {
    return apiClient.get(`/admin/settings/audit-log?limit=${limit}`);
  },
};
