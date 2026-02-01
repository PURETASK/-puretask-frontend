import { apiClient } from '@/lib/api';

export interface CleanerEarnings {
  pendingEarnings: {
    credits: number;
    usd: number;
    jobs: number;
  };
  paidOut: {
    credits: number;
    usd: number;
    jobs: number;
    lastPayout: string | null;
  };
  nextPayout: {
    date: string;
    estimatedCredits: number;
    estimatedUsd: number;
  };
  payoutSchedule: string;
}

export interface Payout {
  id: string;
  cleaner_id: string;
  job_id: string | null;
  amount_credits: number;
  amount_usd: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  stripe_payout_id: string | null;
  created_at: string;
  paid_at: string | null;
  failure_reason: string | null;
}

export interface PayoutsResponse {
  payouts: Payout[];
  total: number;
}

export const cleanerEarningsService = {
  // Get earnings summary
  getEarnings: async (): Promise<CleanerEarnings> => {
    return apiClient.get<CleanerEarnings>('/cleaner/earnings');
  },

  // Get payout history
  getPayouts: async (params?: { page?: number; per_page?: number }): Promise<PayoutsResponse> => {
    return apiClient.get<PayoutsResponse>('/cleaner/payouts', { params });
  },

  // Request instant payout (if available)
  requestPayout: async (amount?: number) => {
    return apiClient.post('/payouts/request', { amount });
  },
};
