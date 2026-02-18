'use client';

import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/Sheet';
import { AuditMetaRow } from '@/components/trust/AuditMetaRow';
import { EvidenceLink } from '@/components/trust/EvidenceLink';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/types/billing';

interface InvoiceViewerDrawerProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceViewerDrawer({
  invoice,
  open,
  onOpenChange,
}: InvoiceViewerDrawerProps) {
  if (!invoice) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        title="Invoice"
        description={`${invoice.status} · ${format(new Date(invoice.createdAtISO), 'PP')}`}
        side="right"
      >
        <div className="space-y-6">
          <div className="rounded-lg border bg-gray-50 p-4 space-y-2">
            <AuditMetaRow label="Invoice ID" value={invoice.id} copyable mono />
            <AuditMetaRow label="Date" value={format(new Date(invoice.createdAtISO), 'PPpp')} />
            <AuditMetaRow label="Status" value={invoice.status} />
            {invoice.paymentMethodSummary && (
              <AuditMetaRow label="Payment" value={invoice.paymentMethodSummary} />
            )}
          </div>

          <div>
            <h4 className="mb-2 font-medium text-gray-900">Line items</h4>
            <div className="space-y-2 border rounded-lg p-4">
              {invoice.lineItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm border-b last:border-0 pb-2 last:pb-0"
                >
                  <span>{item.label}</span>
                  <span>{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between font-medium">
              <span>Subtotal</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.tax > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span>{formatCurrency(invoice.tax)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>

          {(invoice.bookingId || invoice.receiptUrl) && (
            <div>
              <h4 className="mb-2 font-medium text-gray-900">Links</h4>
              <div className="flex flex-wrap gap-2">
                {invoice.bookingId && (
                  <EvidenceLink
                    href={`/client/bookings/${invoice.bookingId}`}
                    label="View booking"
                    kind="booking"
                  />
                )}
                {invoice.receiptUrl && (
                  <EvidenceLink
                    href={invoice.receiptUrl}
                    label="Download receipt"
                    kind="receipt"
                    external
                  />
                )}
                <EvidenceLink
                  href="/terms"
                  label="Refund policy"
                  kind="policy"
                />
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
