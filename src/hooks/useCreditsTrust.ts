// src/hooks/useCreditsTrust.ts
// TanStack Query hooks for credits (Trust-Fintech REST)

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/apiClient';
import type { CreditLedgerEntry, CreditsBalance } from '@/types/trust';

export type CreditsLedgerFilters = {
  from?: string; // ISO date or datetime
  to?: string;
  type?: CreditLedgerEntry['type'];
  status?: CreditLedgerEntry['status'];
  search?: string;
  limit?: number;
};

function toQueryString(filters: CreditsLedgerFilters) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v === undefined || v === null || v === '') continue;
    params.set(k, String(v));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function useCreditsBalance() {
  return useQuery({
    queryKey: ['credits', 'balance'],
    queryFn: () => apiGet<CreditsBalance>('/api/credits/balance'),
  });
}

export function useCreditsLedger(filters: CreditsLedgerFilters) {
  const qs = toQueryString(filters);
  return useQuery({
    queryKey: ['credits', 'ledger', filters],
    queryFn: () =>
      apiGet<{ entries: CreditLedgerEntry[] }>(`/api/credits/ledger${qs}`),
  });
}
