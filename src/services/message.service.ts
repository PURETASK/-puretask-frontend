import { apiClient } from '@/lib/api';
import type { Message, SendMessageData, PaginatedResponse } from '@/types/api';

export const messageService = {
  // Send a message (general - may need jobId)
  sendMessage: async (data: SendMessageData & { jobId?: string }): Promise<{ message: Message }> => {
    if (data.jobId) {
      return apiClient.post(`/messages/job/${data.jobId}`, {
        body: data.content,
        receiverId: data.recipient_id,
      });
    }
    // Fallback to general message endpoint (may need to create)
    return apiClient.post('/messages', data);
  },

  // Get a single conversation (messages with a user)
  getConversation: async (userId: string) =>
    apiClient.get(`/messages/with/${userId}`) as Promise<{ messages: Message[] }>,

  // Get conversations list
  getConversations: async (params?: {
    page?: number;
    per_page?: number;
  }): Promise<{ conversations: any[] }> => {
    return apiClient.get('/messages/conversations', { params });
  },

  // Get messages with a specific user (via job or direct)
  getMessagesWith: async (
    userId: string,
    jobId?: string,
    params?: { page?: number; per_page?: number }
  ): Promise<{ messages: Message[] }> => {
    if (jobId) {
      return apiClient.get(`/messages/job/${jobId}`, { params });
    }
    // Fallback: try to get messages via user ID (may need backend endpoint)
    return apiClient.get(`/messages/with/${userId}`, { params });
  },

  // Get messages for a job
  getJobMessages: async (
    jobId: string,
    params?: { limit?: number; before?: string }
  ): Promise<{ messages: Message[] }> => {
    return apiClient.get(`/messages/job/${jobId}`, { params });
  },

  // Send message to a job
  sendJobMessage: async (
    jobId: string,
    body: string,
    receiverId?: string
  ): Promise<{ message: Message }> => {
    return apiClient.post(`/messages/job/${jobId}`, { body, receiverId });
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

