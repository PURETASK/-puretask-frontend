// src/contexts/__tests__/WebSocketContext.test.tsx
// Unit tests for WebSocketContext

import { describe, it, expect, beforeEach, vi } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { WebSocketProvider, useWebSocket } from '../WebSocketContext';
import { AuthProvider } from '../AuthContext';
import { io } from 'socket.io-client';

vi.mock('socket.io-client');
vi.mock('../AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: 'user-123', email: 'test@example.com' },
  }),
}));
vi.mock('@/lib/config', () => ({
  API_CONFIG: { wsURL: 'ws://localhost:3001' },
  STORAGE_KEYS: { AUTH_TOKEN: 'auth_token' },
}));

describe('WebSocketContext', () => {
  let mockSocket: any;

  beforeEach(() => {
    localStorage.setItem('auth_token', 'test-token');
    mockSocket = {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
      disconnect: vi.fn(),
      connected: true,
    };
    (io as any).mockReturnValue(mockSocket);
    vi.clearAllMocks();
  });

  describe('useWebSocket', () => {
    it('connects when authenticated', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <WebSocketProvider>{children}</WebSocketProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useWebSocket(), { wrapper });

      await waitFor(() => {
        expect(io).toHaveBeenCalled();
      });

      expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    });

    it('disconnects when not authenticated', async () => {
      const mockUseAuth = require('../AuthContext').useAuth;
      mockUseAuth.mockReturnValueOnce({
        isAuthenticated: false,
        user: null,
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <WebSocketProvider>{children}</WebSocketProvider>
        </AuthProvider>
      );

      renderHook(() => useWebSocket(), { wrapper });

      await waitFor(() => {
        expect(mockSocket.disconnect).toHaveBeenCalled();
      });
    });

    it('emits events when connected', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <WebSocketProvider>{children}</WebSocketProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useWebSocket(), { wrapper });

      result.current.emit('test:event', { data: 'test' });

      expect(mockSocket.emit).toHaveBeenCalledWith('test:event', { data: 'test' });
    });

    it('registers event listeners', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <WebSocketProvider>{children}</WebSocketProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useWebSocket(), { wrapper });
      const callback = vi.fn();

      result.current.on('test:event', callback);

      expect(mockSocket.on).toHaveBeenCalledWith('test:event', callback);
    });

    it('removes event listeners', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>
          <WebSocketProvider>{children}</WebSocketProvider>
        </AuthProvider>
      );

      const { result } = renderHook(() => useWebSocket(), { wrapper });
      const callback = vi.fn();

      result.current.off('test:event', callback);

      expect(mockSocket.off).toHaveBeenCalledWith('test:event', callback);
    });
  });
});
