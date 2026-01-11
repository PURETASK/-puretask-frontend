import { apiClient } from '@/lib/api';
import type { Message, SendMessageData, PaginatedResponse } from '@/types/api';

export const messageService = {
  // Send a message
  sendMessage: async (data: SendMessageData): Promise<{ message: Message }> => {
    return apiClient.post('/messages', data);
  },

  // Get conversations list
  getConversations: async (params?: {
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<any>> => {
    return apiClient.get('/messages/conversations', { params });
  },

  // Get messages with a specific user
  getMessagesWith: async (
    userId: string,
    params?: { page?: number; per_page?: number }
  ): Promise<PaginatedResponse<Message>> => {
    return apiClient.get(`/messages/with/${userId}`, { params });
  },

  // Mark message as read
  markAsRead: async (messageId: string): Promise<{ message: string }> => {
    return apiClient.patch(`/messages/${messageId}/read`);
  },

  // Mark all messages from a user as read
  markAllAsRead: async (userId: string): Promise<{ message: string }> => {
    return apiClient.post(`/messages/read-all/${userId}`);
  },

  // Delete a message
  deleteMessage: async (messageId: string): Promise<{ message: string }> => {
    return apiClient.delete(`/messages/${messageId}`);
  },

  // Get unread count
  getUnreadCount: async (): Promise<{ count: number }> => {
    return apiClient.get('/messages/unread-count');
  },
};

