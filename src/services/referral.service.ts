import { apiClient } from '@/lib/api';

/**
 * Referral API. Backend: POST /referral/send (or /referral/invite), optionally GET /referral/me for code/stats.
 */
export const referralService = {
  sendInvite: async (payload: { email: string; message?: string }): Promise<{ ok: boolean }> => {
    return apiClient.post('/referral/send', payload);
  },

  getMe: async (): Promise<{
    referral_code?: string;
    referral_link?: string;
    total_referrals?: number;
    completed_bookings?: number;
    pending_rewards?: number;
    total_earned?: number;
    recent_referrals?: Array<{ id: string; name: string; email: string; status: string; reward: number; date: string }>;
  }> => {
    return apiClient.get('/referral/me');
  },
};
