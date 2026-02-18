import { apiClient } from '@/lib/api';
import type { CreditLedgerEntry } from '@/types/credits';

export interface CreditsBalance {
  balance: number;
  currency: string;
  lastUpdatedISO: string;
}

export interface CreditsLedgerResponse {
  entries: CreditLedgerEntry[];
  pagination?: { page: number; per_page: number; total: number };
}

export const creditsService = {
  getBalance: async (): Promise<CreditsBalance> => {
    try {
      const res = await apiClient.get<{ balance: number; last_updated?: string }>(
        '/credits/balance'
      );
      return {
        balance: res.balance ?? 0,
        currency: 'USD',
        lastUpdatedISO: res.last_updated ?? new Date().toISOString(),
      };
    } catch {
      return { balance: 0, currency: 'USD', lastUpdatedISO: new Date().toISOString() };
    }
  },

  getLedger: async (params?: {
    from?: string;
    to?: string;
    type?: string;
    status?: string;
    page?: number;
  }): Promise<CreditsLedgerResponse> => {
    try {
      const res = await apiClient.get<{ entries?: CreditLedgerEntry[]; data?: CreditLedgerEntry[] }>(
        '/credits/ledger',
        { params }
      );
      const entries = res.entries ?? res.data ?? [];
      return { entries };
    } catch {
      return { entries: [] };
    }
  },
};
