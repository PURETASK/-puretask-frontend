import apiClient from '@/lib/api';

export interface AdminStats {
  total_users: number;
  total_cleaners: number;
  total_clients: number;
  total_bookings: number;
  total_revenue: number;
  active_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  pending_verifications: number;
  reported_issues: number;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'client' | 'cleaner' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  created_at: string;
  last_login_at?: string;
  phone_number?: string;
  profile_picture_url?: string;
}

export interface Transaction {
  id: string;
  booking_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  /** API may return category and/or setting_type; use the same value for getAdminSettingsCategoryLabel() */
  category?: string;
  setting_type?: string;
  description?: string;
}

export const adminService = {
  // Dashboard Analytics
  getStats: async () => {
    return apiClient.get<{ stats: AdminStats }>('/admin/analytics/overview');
  },

  getDailyStats: async (days: number = 30) => {
    return apiClient.get<{ daily_stats: any[] }>('/admin/analytics/daily', {
      params: { days },
    });
  },

  getRevenueAnalytics: async (period: 'week' | 'month' | 'year' = 'month') => {
    return apiClient.get<{ revenue: any[] }>('/admin/analytics/revenue', {
      params: { period },
    });
  },

  // User Management
  getAllUsers: async (params?: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    per_page?: number;
  }) => {
    return apiClient.get<{ users: User[]; total: number; page: number; per_page: number }>(
      '/admin/users',
      { params }
    );
  },

  getUser: async (userId: string) => {
    return apiClient.get<{ user: User }>(`/admin/users/${userId}`);
  },

  updateUserStatus: async (userId: string, status: 'active' | 'suspended' | 'banned') => {
    return apiClient.patch(`/admin/users/${userId}/status`, { status });
  },

  updateUserRole: async (userId: string, role: 'client' | 'cleaner' | 'admin') => {
    return apiClient.patch(`/admin/users/${userId}/role`, { role });
  },

  deleteUser: async (userId: string) => {
    return apiClient.delete(`/admin/users/${userId}`);
  },

  // Booking Management
  getAllBookings: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    per_page?: number;
  }) => {
    return apiClient.get<{ bookings: any[]; total: number }>('/admin/bookings', { params });
  },

  getBookingDetails: async (bookingId: string) => {
    return apiClient.get<{ booking: any }>(`/admin/bookings/${bookingId}`);
  },

  updateBookingStatus: async (bookingId: string, status: string) => {
    return apiClient.patch(`/admin/bookings/${bookingId}/status`, { status });
  },

  cancelBooking: async (bookingId: string, reason: string) => {
    return apiClient.post(`/admin/bookings/${bookingId}/cancel`, { reason });
  },

  // Financial Management
  getAllTransactions: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    per_page?: number;
  }) => {
    return apiClient.get<{ transactions: Transaction[]; total: number }>(
      '/admin/transactions',
      { params }
    );
  },

  processRefund: async (transactionId: string, amount: number, reason: string) => {
    return apiClient.post(`/admin/transactions/${transactionId}/refund`, { amount, reason });
  },

  getFinancialReport: async (startDate: string, endDate: string) => {
    return apiClient.get<{ report: any }>('/admin/reports/financial', {
      params: { start_date: startDate, end_date: endDate },
    });
  },

  // System Settings
  getAllSettings: async () => {
    return apiClient.get<{ settings: SystemSetting[] }>('/admin/settings');
  },

  updateSetting: async (key: string, value: string) => {
    return apiClient.patch('/admin/settings', { key, value });
  },

  // Cleaner Verification
  getPendingVerifications: async () => {
    return apiClient.get<{ verifications: any[] }>('/admin/verifications/pending');
  },

  approveVerification: async (verificationId: string) => {
    return apiClient.post(`/admin/verifications/${verificationId}/approve`);
  },

  rejectVerification: async (verificationId: string, reason: string) => {
    return apiClient.post(`/admin/verifications/${verificationId}/reject`, { reason });
  },

  // Reports & Issues
  getReportedIssues: async (params?: { status?: string; page?: number }) => {
    return apiClient.get<{ issues: any[] }>('/admin/issues', { params });
  },

  resolveIssue: async (issueId: string, resolution: string) => {
    return apiClient.post(`/admin/issues/${issueId}/resolve`, { resolution });
  },
};

