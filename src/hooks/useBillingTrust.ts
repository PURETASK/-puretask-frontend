// src/hooks/useBillingTrust.ts
// TanStack Query hooks for billing (Trust-Fintech REST)

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/apiClient';
import type { Invoice } from '@/types/trust';

export type PayInvoiceRequest = {
  payment_method: 'credits' | 'card';
};

export function usePayInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, payment_method }: { invoiceId: string } & PayInvoiceRequest) =>
      apiPost<PayInvoiceRequest, { ok: boolean }>(
        `/client/invoices/${encodeURIComponent(invoiceId)}/pay`,
        { payment_method }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'invoices'] });
      queryClient.invalidateQueries({ queryKey: ['credits', 'balance'] });
      queryClient.invalidateQueries({ queryKey: ['credits', 'ledger'] });
    },
  });
}

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
