// src/app/client/credits-trust/page.tsx
// Credits dashboard (Trust): balance + ledger + buy credits

'use client';

import * as React from 'react';
import {
  useCreditsBalance,
  useCreditsLedger,
  useBuyCredits,
  type CreditsLedgerFilters,
} from '@/hooks/useCreditsTrust';
import { useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageShell } from '@/components/layout/PageShell';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { TrustBanner } from '@/components/trust/TrustBanner';
import { EvidenceLink } from '@/components/trust/EvidenceLink';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/contexts/ToastContext';
import { EmptyLedger } from '@/components/ui/EmptyState';
import { LedgerSkeleton } from '@/components/ui/skeleton/LedgerSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';
import { Wallet, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  const queryClient = useQueryClient();

  const balanceQ = useCreditsBalance();
  const ledgerQ = useCreditsLedger(filters);
  const buyCredits = useBuyCredits();

  const { showToast } = useToast();

  const [showCreditsAdded, setShowCreditsAdded] = React.useState(false);

  // Handle success/cancel redirect from checkout
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const cancel = params.get('cancel');
    if (success === '1') {
      setShowCreditsAdded(true);
      showToast('Credits purchased successfully. Balance updated.', 'success');
      queryClient.invalidateQueries({ queryKey: ['credits', 'balance'] });
      queryClient.invalidateQueries({ queryKey: ['credits', 'ledger'] });
      window.history.replaceState({}, '', '/client/credits-trust');
      const t = setTimeout(() => setShowCreditsAdded(false), 3000);
      return () => clearTimeout(t);
    } else if (cancel === '1') {
      showToast('Checkout was cancelled.', 'info');
      window.history.replaceState({}, '', '/client/credits-trust');
    }
  }, [showToast, queryClient]);

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

  const entries = ledgerQ.data?.entries ?? [];
  const hasLedgerData = ledgerQ.data && !ledgerQ.isLoading && !ledgerQ.isError;

  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      <main className="flex-1">
        <PageShell title="Credits" subtitle="Manage your balance and transaction history." back={{ href: '/client', label: 'Back to home' }} maxWidth="content">
        <AnimatePresence>
          {showCreditsAdded && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="mb-6 flex items-center gap-3 rounded-xl border border-[var(--brand-mint)]/40 bg-[rgba(40,199,111,0.12)] px-4 py-3"
            >
              <CheckCircle2 className="h-8 w-8 text-[var(--brand-mint)] flex-shrink-0" aria-hidden />
              <div>
                <p className="font-semibold text-gray-900">Credits added!</p>
                <p className="text-sm text-gray-600">Your balance has been updated.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Balance card (prominent) */}
        <section className="mb-8">
          {balanceQ.isLoading ? (
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardContent>
            </Card>
          ) : balanceQ.isError ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <p className="text-red-700">Failed to load balance. You may need to sign in again.</p>
              </CardContent>
            </Card>
          ) : balanceQ.data ? (
            <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden card-interactive">
              <CardContent className="p-0">
                <div className="px-6 py-5 text-white" style={{ background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-aqua))' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Wallet className="h-5 w-5" />
                    <span className="text-sm font-medium opacity-90">Available balance</span>
                  </div>
                  <p className="text-3xl font-bold">
                    {balanceQ.data.balance} {balanceQ.data.currency}
                  </p>
                  <p className="text-sm opacity-90 mt-1">
                    Updated {new Date(balanceQ.data.lastUpdatedISO).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 flex flex-wrap items-center gap-3 border-t border-gray-100">
                  <select
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
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
              </CardContent>
            </Card>
          ) : null}
          {balanceQ.data && (
            <TrustBanner
              variant="verified"
              label="Balance updates in real time"
              sub="See transaction history below for full ledger"
              className="mt-4"
            />
          )}
        </section>

        {/* Ledger */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Transaction history</h2>
          <p className="text-sm text-gray-500 mb-4">Every transaction has an ID and timestamp. Use filters to search.</p>
          <div className="flex flex-wrap gap-3 mb-4">
            <input
              placeholder="Search (booking/invoice/keyword)"
              value={filters.search || ''}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value || undefined }))
              }
              className="px-4 py-2 border border-gray-300 rounded-lg w-64 text-sm"
            />
            <input
              type="date"
              value={filters.from || ''}
              onChange={(e) =>
                setFilters((f) => ({ ...f, from: e.target.value || undefined }))
              }
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="date"
              value={filters.to || ''}
              onChange={(e) =>
                setFilters((f) => ({ ...f, to: e.target.value || undefined }))
              }
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <select
              value={filters.type || ''}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  type: (e.target.value as CreditsLedgerFilters['type']) || undefined,
                }))
              }
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
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
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All status</option>
              <option value="pending">pending</option>
              <option value="posted">posted</option>
              <option value="reversed">reversed</option>
            </select>
          </div>

          {ledgerQ.isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <LedgerSkeleton key={i} />
              ))}
            </div>
          ) : ledgerQ.isError ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <p className="text-red-700">Failed to load ledger.</p>
              </CardContent>
            </Card>
          ) : hasLedgerData && entries.length === 0 ? (
            <EmptyLedger />
          ) : hasLedgerData ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Booking / Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {entries.map((e: { id: string; createdAtISO?: string; type?: string; amount?: number; status?: string; currency?: string; description?: string; relatedBookingId?: string; invoiceId?: string }) => (
                    <tr key={e.id}>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(e.createdAtISO ?? '').toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-mono text-xs">{e.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{e.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {e.amount} {e.currency ?? 'USD'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{e.status}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{e.description ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {e.relatedBookingId ? (
                          <EvidenceLink href={`/client/bookings/${e.relatedBookingId}`} label="View booking" kind="booking" />
                        ) : e.invoiceId ? (
                          <EvidenceLink href={`/client/billing-trust/${e.invoiceId}`} label="View invoice" kind="invoice" />
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
        </PageShell>
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
