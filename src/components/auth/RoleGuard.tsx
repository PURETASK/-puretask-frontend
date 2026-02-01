'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: Array<'admin' | 'cleaner' | 'client'>;
  redirectTo?: string;
}

/**
 * RoleGuard - Protect routes based on user roles
 * 
 * Usage:
 * <RoleGuard allowedRoles={['admin']}>
 *   <AdminDashboard />
 * </RoleGuard>
 */
export function RoleGuard({ 
  children, 
  allowedRoles = ['admin', 'cleaner', 'client'],
  redirectTo 
}: RoleGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Still loading - wait
    if (isLoading) {
      return;
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated || !user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // User doesn't have required role - redirect to their dashboard
    if (!allowedRoles.includes(user.role)) {
      const userDashboard = 
        user.role === 'admin' ? '/admin' :
        user.role === 'cleaner' ? '/cleaner/dashboard' :
        user.role === 'client' ? '/client/dashboard' :
        '/';
      
      router.push(redirectTo || userDashboard);
      return;
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router, pathname, redirectTo]);

  // Still loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // User doesn't have required role
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // User has access
  return <>{children}</>;
}

/**
 * Admin-only route guard
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['admin']}>{children}</RoleGuard>;
}

/**
 * Cleaner-only route guard (admins can also access)
 */
export function CleanerGuard({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['cleaner', 'admin']}>{children}</RoleGuard>;
}

/**
 * Client-only route guard (admins can also access)
 */
export function ClientGuard({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['client', 'admin']}>{children}</RoleGuard>;
}

