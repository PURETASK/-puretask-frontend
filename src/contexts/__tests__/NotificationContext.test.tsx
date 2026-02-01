// src/contexts/__tests__/NotificationContext.test.tsx
// Unit tests for NotificationContext

import { describe, it, expect, beforeEach, vi } from '@jest/globals';
import { renderHook, act, waitFor } from '@testing-library/react';
import { NotificationProvider, useNotifications } from '../NotificationContext';
import { AuthProvider } from '../AuthContext';
import { WebSocketProvider } from '../WebSocketContext';
import { notificationService } from '@/services/notification.service';

vi.mock('@/services/notification.service');
vi.mock('../AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({ isAuthenticated: true }),
}));
vi.mock('../WebSocketContext', () => ({
  WebSocketProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useWebSocket: () => ({
    isConnected: true,
    on: vi.fn(),
    off: vi.fn(),
  }),
}));
vi.mock('../ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

describe('NotificationContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useNotifications', () => {
    it('provides initial state', () => {
      const mockNotifications = [
        { id: '1', title: 'Test', read: false, type: 'info' },
      ];

      (notificationService.getNotifications as any).mockResolvedValueOnce({
        data: mockNotifications,
        unread_count: 1,
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <WebSocketProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </WebSocketProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useNotifications(), { wrapper });

      expect(result.current.notifications).toEqual([]);
      expect(result.current.unreadCount).toBe(0);
      expect(result.current.isLoading).toBe(false);
    });

    it('loads notifications on mount when authenticated', async () => {
      const mockNotifications = [
        { id: '1', title: 'Test 1', read: false, type: 'info' },
        { id: '2', title: 'Test 2', read: true, type: 'booking' },
      ];

      (notificationService.getNotifications as any).mockResolvedValueOnce({
        data: mockNotifications,
        unread_count: 1,
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <WebSocketProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </WebSocketProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.notifications).toEqual(mockNotifications);
      expect(result.current.unreadCount).toBe(1);
    });

    it('marks notification as read', async () => {
      const mockNotifications = [
        { id: '1', title: 'Test', read: false, type: 'info' },
      ];

      (notificationService.getNotifications as any).mockResolvedValueOnce({
        data: mockNotifications,
        unread_count: 1,
      });
      (notificationService.markAsRead as any).mockResolvedValueOnce({});

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <WebSocketProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </WebSocketProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.markAsRead('1');
      });

      expect(notificationService.markAsRead).toHaveBeenCalledWith('1');
      expect(result.current.unreadCount).toBe(0);
    });

    it('marks all notifications as read', async () => {
      const mockNotifications = [
        { id: '1', title: 'Test 1', read: false, type: 'info' },
        { id: '2', title: 'Test 2', read: false, type: 'booking' },
      ];

      (notificationService.getNotifications as any).mockResolvedValueOnce({
        data: mockNotifications,
        unread_count: 2,
      });
      (notificationService.markAllAsRead as any).mockResolvedValueOnce({});

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <WebSocketProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </WebSocketProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.markAllAsRead();
      });

      expect(notificationService.markAllAsRead).toHaveBeenCalled();
      expect(result.current.unreadCount).toBe(0);
    });

    it('deletes notification', async () => {
      const mockNotifications = [
        { id: '1', title: 'Test', read: false, type: 'info' },
      ];

      (notificationService.getNotifications as any).mockResolvedValueOnce({
        data: mockNotifications,
        unread_count: 1,
      });
      (notificationService.deleteNotification as any).mockResolvedValueOnce({});

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <WebSocketProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </WebSocketProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.deleteNotification('1');
      });

      expect(notificationService.deleteNotification).toHaveBeenCalledWith('1');
      expect(result.current.notifications).toHaveLength(0);
    });

    it('refreshes notifications', async () => {
      const initialNotifications = [
        { id: '1', title: 'Test 1', read: false, type: 'info' },
      ];
      const refreshedNotifications = [
        { id: '1', title: 'Test 1', read: false, type: 'info' },
        { id: '2', title: 'Test 2', read: false, type: 'booking' },
      ];

      (notificationService.getNotifications as any)
        .mockResolvedValueOnce({
          data: initialNotifications,
          unread_count: 1,
        })
        .mockResolvedValueOnce({
          data: refreshedNotifications,
          unread_count: 2,
        });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <WebSocketProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </WebSocketProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useNotifications(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.refreshNotifications();
      });

      expect(result.current.notifications).toHaveLength(2);
      expect(result.current.unreadCount).toBe(2);
    });
  });
});
