// src/app/client/billing-trust/[id]/page.tsx
// Invoice detail: line items, subtotal, tax, total, Pay (credits | card)

'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useInvoice, usePayInvoice } from '@/hooks/useBillingTrust';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/contexts/ToastContext';
import { Skeleton } from '@/components/ui/Skeleton';
import { FileText, CreditCard, Banknote } from 'lucide-react';
import type { Invoice, InvoiceLineItem } from '@/types/trust';

const UNPAID_STATUSES = ['sent', 'open', 'draft'];

function InvoiceDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { showToast } = useToast();

  const invoiceQ = useInvoice(id);
  const payInvoice = usePayInvoice();
  const [payMethod, setPayMethod] = React.useState<'credits' | 'card'>('credits');

  const inv = invoiceQ.data as Invoice | undefined;
  const isUnpaid = inv && UNPAID_STATUSES.includes(inv.status);

  const handlePay = () => {
    if (!inv) return;
    payInvoice.mutate(
      { invoiceId: inv.id, payment_method: payMethod },
      {
        onSuccess: () => {
          showToast('Invoice paid successfully', 'success');
          invoiceQ.refetch();
        },
        onError: (err: { message?: string }) => {
          showToast(err?.message || 'Failed to pay invoice', 'error');
        },
      }
    );
  };

  if (invoiceQ.isLoading || !invoiceQ.data) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8 px-6 max-w-2xl mx-auto w-full">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-24 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (invoiceQ.isError || !inv) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8 px-6 max-w-2xl mx-auto w-full">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <p className="text-amber-800 mb-4">Invoice not found or you don’t have access.</p>
              <Button variant="outline" onClick={() => router.push('/client/billing-trust')}>
                Back to Invoices
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const lineItems: InvoiceLineItem[] = inv.lineItems ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6 max-w-2xl mx-auto w-full">
        <Link
          href="/client/billing-trust"
          className="text-blue-600 hover:underline text-sm font-medium mb-4 inline-block"
        >
          ← Back to Invoices
        </Link>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <CardTitle className="text-xl">Invoice {inv.id}</CardTitle>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(inv.createdAtISO).toLocaleDateString()} • {inv.status}
              {inv.bookingId ? ` • Booking ${inv.bookingId}` : ''}
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Line items */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Line items</h3>
              <ul className="divide-y divide-gray-100">
                {lineItems.length === 0 ? (
                  <li className="py-3 text-sm text-gray-500">No line items</li>
                ) : (
                  lineItems.map((item: InvoiceLineItem) => (
                    <li key={item.id} className="py-3 flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.label}
                        {item.quantity != null && item.quantity > 1 && ` × ${item.quantity}`}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {item.amount} {inv.currency}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 pt-4 space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{inv.subtotal} {inv.currency}</span>
              </div>
              {inv.tax != null && inv.tax > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{inv.tax} {inv.currency}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-gray-900 pt-2">
                <span>Total</span>
                <span>{inv.total} {inv.currency}</span>
              </div>
            </div>

            {inv.paymentMethodSummary && (
              <p className="text-sm text-gray-500">
                Payment: {inv.paymentMethodSummary}
              </p>
            )}

            {/* Pay section */}
            {isUnpaid && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Pay invoice</h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setPayMethod('credits')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${
                      payMethod === 'credits'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Banknote className="h-4 w-4" />
                    Credits
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod('card')}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${
                      payMethod === 'card'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    Card
                  </button>
                </div>
                <Button
                  variant="primary"
                  onClick={handlePay}
                  disabled={payInvoice.isPending}
                >
                  {payInvoice.isPending ? 'Processing…' : `Pay with ${payMethod === 'credits' ? 'credits' : 'card'}`}
                </Button>
              </div>
            )}

            {inv.receiptUrl && (
              <a
                href={inv.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Download receipt
              </a>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default function InvoiceDetailPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <InvoiceDetailContent />
    </ProtectedRoute>
  );
}
