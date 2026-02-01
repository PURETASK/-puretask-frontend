import { apiClient } from '@/lib/api';

export interface Notification {
  id: string;
  type: 'booking' | 'message' | 'payment' | 'system';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

export const notificationService = {
  // Get all notifications
  getNotifications: async (params?: {
    page?: number;
    per_page?: number;
    unread_only?: boolean;
  }) => {
    return apiClient.get<{ data: Notification[]; unread_count: number }>(
      '/notifications',
      { params }
    );
  },

  // Get unread count
  getUnreadCount: async () => {
    return apiClient.get<{ count: number }>('/notifications/unread-count');
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    return apiClient.patch(`/notifications/${notificationId}/read`);
  },

  // Mark all as read
  markAllAsRead: async () => {
    return apiClient.post('/notifications/read-all');
  },

  // Delete notification
  deleteNotification: async (notificationId: string) => {
    return apiClient.delete(`/notifications/${notificationId}`);
  },
};

