'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * /auth — single entry for "auth". Redirects to login so we have one canonical auth flow.
 * Use /auth/login and /auth/register for direct links.
 */
export default function AuthRedirectPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user) {
      // Already logged in: send to role home
      const home =
        user.role === 'admin' ? '/admin' : user.role === 'cleaner' ? '/cleaner' : '/client';
      router.replace(home);
      return;
    }

    router.replace('/auth/login');
  }, [router, isAuthenticated, isLoading, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-app">
      <div className="text-center">
        <LoadingSpinner className="mx-auto h-10 w-10 text-[var(--brand-blue)]" />
        <p className="mt-4 text-gray-600">Taking you to sign in…</p>
      </div>
    </div>
  );
}
