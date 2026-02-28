'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * /dashboard — redirects to the correct home for the user's role.
 * Prevents confusion with the old generic dashboard; all roles have a clear hub.
 */
export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace('/auth/login');
      return;
    }

    switch (user.role) {
      case 'admin':
        router.replace('/admin');
        break;
      case 'cleaner':
        router.replace('/cleaner');
        break;
      case 'client':
      default:
        router.replace('/client');
        break;
    }
  }, [router, user, isAuthenticated, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-app">
      <div className="text-center">
        <LoadingSpinner className="mx-auto h-10 w-10 text-[var(--brand-blue)]" />
        <p className="mt-4 text-gray-600">Taking you to your home…</p>
      </div>
    </div>
  );
}
