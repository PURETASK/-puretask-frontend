import { apiClient } from '@/lib/api';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/api';

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  // Get current user
  getCurrentUser: async (): Promise<{ user: User }> => {
    return apiClient.get<{ user: User }>('/auth/me');
  },

  // Logout
  logout: async (): Promise<void> => {
    return apiClient.post('/auth/logout');
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  // Reset password with token
  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    return apiClient.post('/auth/reset-password', {
      token,
      new_password: newPassword,
    });
  },

  // Verify email
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    return apiClient.post('/auth/verify-email', { token });
  },

  // Resend verification email
  resendVerification: async (email: string): Promise<{ message: string }> => {
    return apiClient.post('/auth/resend-verification', { email });
  },
};

