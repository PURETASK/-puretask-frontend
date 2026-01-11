'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';
import { STORAGE_KEYS } from '@/lib/config';
import { useToast } from '@/contexts/ToastContext';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '@/types/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (token && savedUser) {
          setUser(JSON.parse(savedUser));
          // Optionally verify token with backend
          await refreshUser();
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        // Clear invalid data
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      // Save token and user data
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
      
      setUser(response.user);
      showToast('Successfully logged in!', 'success');
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || 'Login failed';
      showToast(errorMsg, 'error');
      throw new Error(errorMsg);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      
      // Save token and user data
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
      
      setUser(response.user);
      showToast('Account created successfully!', 'success');
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || 'Registration failed';
      showToast(errorMsg, 'error');
      throw new Error(errorMsg);
    }
  };

  const logout = () => {
    // Clear storage
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    
    // Clear state
    setUser(null);
    
    // Optionally notify backend
    apiClient.post('/auth/logout').catch(() => {
      // Ignore errors on logout
    });
    
    showToast('Successfully logged out', 'info');
    
    // Redirect to home
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const refreshUser = async () => {
    try {
      // Fetch current user data from backend
      const response = await apiClient.get<{ user: User }>('/auth/me');
      
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
      setUser(response.user);
    } catch (error) {
      // If refresh fails, clear auth
      logout();
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}

