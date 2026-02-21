// src/app/client/credits-trust/page.tsx
// Simple credits page using Trust-Fintech hooks (fetch + /api/credits/*)

'use client';

import * as React from 'react';
import {
  useCreditsBalance,
  useCreditsLedger,
  useBuyCredits,
  type CreditsLedgerFilters,
} from '@/hooks/useCreditsTrust';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';

const CREDIT_PACKAGES = [
  { packageId: 'starter', label: '100 credits', amount: '$10' },
  { packageId: 'standard', label: '500 credits', amount: '$45' },
  { packageId: 'premium', label: '1000 credits', amount: '$80' },
];

function CreditsTrustContent() {
  const [filters, setFilters] = React.useState<CreditsLedgerFilters>({
    limit: 50,
  });
  const [selectedPackage, setSelectedPackage] = React.useState(CREDIT_PACKAGES[0].packageId);

  const balanceQ = useCreditsBalance();
  const ledgerQ = useCreditsLedger(filters);
  const buyCredits = useBuyCredits();

  const { showToast } = useToast();

  const handleBuyCredits = () => {
    if (typeof window === 'undefined') return;
    const base = window.location.origin;
    buyCredits.mutate(
      {
        packageId: selectedPackage,
        successUrl: `${base}/client/credits-trust?success=1`,
        cancelUrl: `${base}/client/credits-trust?cancel=1`,
      },
      {
        onError: (err: { message?: string; status?: number }) => {
          showToast(err?.message || `Checkout failed (${err?.status || 'error'})`, 'error');
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6" style={{ padding: 24 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Credits (Trust API)</h1>
        <p className="text-gray-600 mb-6">Using fetch + /api/credits/* endpoints</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Balance</h2>
          {balanceQ.isLoading ? (
            <p>Loading…</p>
          ) : balanceQ.isError ? (
            <p className="text-red-600">Failed to load balance.</p>
          ) : balanceQ.data ? (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p>
                {balanceQ.data.balance} {balanceQ.data.currency} • Updated{' '}
                {new Date(balanceQ.data.lastUpdatedISO).toLocaleString()}
              </p>
              <div className="flex items-center gap-3">
                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {CREDIT_PACKAGES.map((p) => (
                    <option key={p.packageId} value={p.packageId}>
                      {p.label} — {p.amount}
                    </option>
                  ))}
                </select>
                <Button
                  variant="primary"
                  onClick={handleBuyCredits}
                  disabled={buyCredits.isPending}
                >
                  {buyCredits.isPending ? 'Redirecting…' : 'Buy credits'}
                </Button>
              </div>
            </div>
          ) : null}
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ledger</h2>

          <div className="flex flex-wrap gap-3 mb-4">
            <input
              placeholder="Search (booking/invoice/keyword)"
              value={filters.search || ''}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value || undefined }))
              }
              className="px-4 py-2 border border-gray-300 rounded-lg w-64"
            />
            <select
              value={filters.type || ''}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  type: (e.target.value as CreditsLedgerFilters['type']) || undefined,
                }))
              }
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All types</option>
              <option value="deposit">deposit</option>
              <option value="spend">spend</option>
              <option value="refund">refund</option>
              <option value="bonus">bonus</option>
              <option value="fee">fee</option>
            </select>
            <select
              value={filters.status || ''}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  status: (e.target.value as CreditsLedgerFilters['status']) || undefined,
                }))
              }
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All status</option>
              <option value="pending">pending</option>
              <option value="posted">posted</option>
              <option value="reversed">reversed</option>
            </select>
          </div>

          {ledgerQ.isLoading ? (
            <p>Loading…</p>
          ) : ledgerQ.isError ? (
            <p className="text-red-600">Failed to load ledger.</p>
          ) : ledgerQ.data ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {ledgerQ.data.entries.map((e: { id: string; createdAtISO?: string; type?: string; amount?: number; status?: string; currency?: string; description?: string }) => (
                    <tr key={e.id}>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(e.createdAtISO ?? '').toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{e.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{e.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {e.amount} {e.currency}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{e.status}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{e.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function CreditsTrustPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <CreditsTrustContent />
    </ProtectedRoute>
  );
}
