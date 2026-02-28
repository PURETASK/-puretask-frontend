'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Legacy route. Billing/invoices flow lives at /client/billing-trust.
 */
export default function BillingRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/client/billing-trust');
  }, [router]);

  return (
    <ProtectedRoute requiredRole="client">
      <div className="min-h-screen flex items-center justify-center bg-app">
        <div className="text-center">
          <LoadingSpinner className="mx-auto h-10 w-10 text-[var(--brand-blue)]" />
          <p className="mt-4 text-gray-600">Taking you to Billing…</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
