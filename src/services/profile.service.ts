import { apiClient } from '@/lib/api';
import type { User } from '@/types/api';

export interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  email?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export const profileService = {
  // Get current user profile (use /auth/me for current user)
  getProfile: async () => {
    return apiClient.get<{ user: User }>('/auth/me');
  },

  // Update profile
  updateProfile: async (data: UpdateProfileData) => {
    return apiClient.patch<{ user: User }>('/users/me', data);
  },

  // Upload avatar
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return apiClient.post<{ avatar_url: string }>('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete avatar
  deleteAvatar: async () => {
    return apiClient.delete('/users/me/avatar');
  },

  // Change password
  changePassword: async (data: ChangePasswordData) => {
    return apiClient.post('/users/me/change-password', data);
  },

  // Delete account
  deleteAccount: async (password: string) => {
    return apiClient.post('/users/me/delete', { password });
  },
};

