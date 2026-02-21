'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'cleaner' | 'admin' | ('client' | 'cleaner' | 'admin')[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated - redirect to login
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Check role if required
      const roleOk = !requiredRole || (Array.isArray(requiredRole) ? requiredRole.includes(user?.role as 'client' | 'cleaner' | 'admin') : user?.role === requiredRole);
      if (requiredRole && !roleOk) {
        // Redirect to appropriate dashboard based on actual role
        const dashboardMap = {
          client: '/client/dashboard',
          cleaner: '/cleaner/dashboard',
          admin: '/admin/dashboard',
        };
        router.push(dashboardMap[user?.role as keyof typeof dashboardMap] || '/');
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, redirectTo, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Wrong role
  const roleOk = !requiredRole || (Array.isArray(requiredRole) ? requiredRole.includes(user?.role as 'client' | 'cleaner' | 'admin') : user?.role === requiredRole);
  if (requiredRole && !roleOk) {
    return null;
  }

  // All good - render children
  return <>{children}</>;
}

