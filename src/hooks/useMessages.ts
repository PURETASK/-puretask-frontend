import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '@/services/message.service';
import { useToast } from '@/contexts/ToastContext';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useEffect } from 'react';

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageService.getConversations(),
  });
}

export function useConversation(userId: string) {
  return useQuery({
    queryKey: ['conversation', userId],
    queryFn: () => messageService.getConversation(userId),
    enabled: !!userId,
  });
}

export function useMessages(conversationId?: string) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => {
      if (!conversationId) return Promise.resolve({ messages: [] });
      // Check if it's a job ID (UUID format) or conversation ID
      // For now, assume job-based messaging
      return messageService.getJobMessages(conversationId);
    },
    enabled: !!conversationId,
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({
      recipientId,
      content,
      jobId,
    }: {
      recipientId: string;
      content: string;
      jobId?: string;
    }) => {
      if (jobId) {
        return messageService.sendJobMessage(jobId, content, recipientId);
      }
      return messageService.sendMessage({ recipient_id: recipientId, content, jobId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      showToast(error.response?.data?.error?.message || 'Failed to send message', 'error');
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => messageService.markAsRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

// Hook for real-time message updates
export function useRealtimeMessages(conversationId?: string) {
  const { socket, isConnected } = useWebSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return;

    const handleNewMessage = (message: any) => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, isConnected, conversationId, queryClient]);
}

