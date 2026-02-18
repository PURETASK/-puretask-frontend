'use client';

import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/Sheet';
import { AuditMetaRow } from '@/components/trust/AuditMetaRow';
import { EvidenceLink } from '@/components/trust/EvidenceLink';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import type { CreditLedgerEntry } from '@/types/credits';

interface LedgerEntryDrawerProps {
  entry: CreditLedgerEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LedgerEntryDrawer({
  entry,
  open,
  onOpenChange,
}: LedgerEntryDrawerProps) {
  if (!entry) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        title="Ledger Entry Details"
        description={`${entry.type} · ${entry.status}`}
        side="right"
      >
        <div className="space-y-6">
          <div className="rounded-lg border bg-gray-50 p-4 space-y-2">
            <AuditMetaRow label="Timestamp" value={format(new Date(entry.createdAtISO), 'PPpp')} />
            <AuditMetaRow label="Entry ID" value={entry.id} copyable mono />
            <AuditMetaRow label="Type" value={entry.type} />
            <AuditMetaRow label="Amount" value={formatCurrency(entry.amount)} />
            <AuditMetaRow label="Status" value={entry.status} />
            <AuditMetaRow label="Description" value={entry.description} />
          </div>

          {(entry.relatedBookingId || entry.invoiceId) && (
            <div>
              <h4 className="mb-2 font-medium text-gray-900">Related</h4>
              <div className="flex flex-wrap gap-2">
                {entry.relatedBookingId && (
                  <EvidenceLink
                    href={`/client/bookings/${entry.relatedBookingId}`}
                    label="View booking"
                    kind="booking"
                  />
                )}
                {entry.invoiceId && (
                  <EvidenceLink
                    href={`/client/billing/invoices/${entry.invoiceId}`}
                    label="View invoice"
                    kind="invoice"
                  />
                )}
              </div>
            </div>
          )}

          {entry.evidence && entry.evidence.length > 0 && (
            <div>
              <h4 className="mb-2 font-medium text-gray-900">Evidence</h4>
              <div className="flex flex-wrap gap-2">
                {entry.evidence.map((ev) => (
                  <EvidenceLink
                    key={ev.id}
                    href={ev.href}
                    label={ev.kind}
                    kind={ev.kind as any}
                    external
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
