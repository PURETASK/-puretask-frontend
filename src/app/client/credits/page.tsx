'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Legacy route. Credits flow lives at /client/credits-trust (balance, ledger, trust copy).
 */
export default function CreditsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/client/credits-trust');
  }, [router]);

  return (
    <ProtectedRoute requiredRole="client">
      <div className="min-h-screen flex items-center justify-center bg-app">
        <div className="text-center">
          <LoadingSpinner className="mx-auto h-10 w-10 text-[var(--brand-blue)]" />
          <p className="mt-4 text-gray-600">Taking you to Credits…</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
