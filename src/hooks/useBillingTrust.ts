// src/hooks/useBillingTrust.ts
// TanStack Query hooks for billing (Trust-Fintech REST)

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/apiClient';
import type { Invoice } from '@/types/trust';

export function useInvoices() {
  return useQuery({
    queryKey: ['billing', 'invoices'],
    queryFn: () =>
      apiGet<{ invoices: Invoice[] }>('/api/billing/invoices'),
  });
}

export function useInvoice(invoiceId: string) {
  return useQuery({
    queryKey: ['billing', 'invoice', invoiceId],
    queryFn: () =>
      apiGet<Invoice>(
        `/api/billing/invoices/${encodeURIComponent(invoiceId)}`
      ),
    enabled: Boolean(invoiceId),
  });
}
