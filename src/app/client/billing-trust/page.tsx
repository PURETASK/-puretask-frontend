// src/app/client/billing-trust/page.tsx
// Invoices list (Trust API) with empty state and link to detail

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useInvoices, usePayInvoice } from '@/hooks/useBillingTrust';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';
import { EmptyInvoices } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/skeleton/CardSkeleton';

const UNPAID_STATUSES = ['sent', 'open', 'draft'];

function BillingTrustContent() {
  const { showToast } = useToast();
  const invoicesQ = useInvoices();
  const payInvoice = usePayInvoice();

  const handlePay = (invoiceId: string, paymentMethod: 'credits' | 'card') => {
    payInvoice.mutate(
      { invoiceId, payment_method: paymentMethod },
      {
        onSuccess: () => {
          showToast('Invoice paid successfully', 'success');
          payInvoice.reset();
        },
        onError: (err: { message?: string }) => {
          showToast(err?.message || 'Failed to pay invoice', 'error');
        },
      }
    );
  };

  const invoices = invoicesQ.data?.invoices ?? [];
  const hasData = invoicesQ.data && !invoicesQ.isLoading && !invoicesQ.isError;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoices</h1>
        <p className="text-gray-600 mb-6">View and pay your invoices.</p>

        {invoicesQ.isLoading ? (
          <div className="space-y-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : invoicesQ.isError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <p className="text-red-700">Failed to load invoices. You may need to sign in again.</p>
          </div>
        ) : hasData && invoices.length === 0 ? (
          <EmptyInvoices />
        ) : hasData ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Booking</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((inv: { id: string; status: string; total: number; currency?: string; createdAtISO?: string; bookingId?: string }) => (
                  <tr key={inv.id}>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(inv.createdAtISO ?? '').toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{inv.status}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {inv.total} {inv.currency ?? 'USD'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{inv.bookingId ?? '—'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/client/billing-trust/${inv.id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          View
                        </Link>
                        {UNPAID_STATUSES.includes(inv.status) && (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handlePay(inv.id, 'credits')}
                              disabled={payInvoice.isPending}
                            >
                              Pay with credits
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handlePay(inv.id, 'card')}
                              disabled={payInvoice.isPending}
                            >
                              Pay with card
                            </Button>
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}

export default function BillingTrustPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <BillingTrustContent />
    </ProtectedRoute>
  );
}
