// src/app/client/billing-trust/page.tsx
// Simple billing page using Trust-Fintech hooks (fetch + /api/billing/*)

'use client';

import * as React from 'react';
import { useInvoices } from '@/hooks/useBillingTrust';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function BillingTrustContent() {
  const invoicesQ = useInvoices();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing (Trust API)</h1>
        <p className="text-gray-600 mb-6">Using fetch + /api/billing/* endpoints</p>

        {invoicesQ.isLoading ? (
          <p>Loading…</p>
        ) : invoicesQ.isError ? (
          <p className="text-red-600">Failed to load invoices.</p>
        ) : invoicesQ.data ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {invoicesQ.data.invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{inv.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(inv.createdAtISO).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{inv.status}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {inv.total} {inv.currency}
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
