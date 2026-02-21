/**
 * Admin gamification API. Endpoints documented in docs/BACKEND_ENDPOINTS.md.
 * Uses optional paths; callers should handle 404/errors and fall back to local/mock data.
 */
import { apiClient } from '@/lib/api';

export type GamificationFlagKey =
  | 'gamification_enabled'
  | 'rewards_enabled'
  | 'cash_rewards_enabled'
  | 'seasonal_enabled'
  | 'governor_enabled';

export interface GamificationFlags {
  gamification_enabled?: boolean;
  rewards_enabled?: boolean;
  cash_rewards_enabled?: boolean;
  seasonal_enabled?: boolean;
  governor_enabled?: boolean;
  region_overrides?: Record<string, Partial<GamificationFlags>>;
}

export interface AdminGoalRow {
  id: string;
  title: string;
  description?: string;
  level: number;
  type: 'core' | 'stretch' | 'maintenance';
  metric_key?: string;
  operator?: string;
  target: string | number;
  window?: string;
  enabled: boolean;
  effective_at?: string;
  version?: number;
  updated_at: string;
}

export interface AdminRewardRow {
  id: string;
  kind: string;
  name?: string;
  duration_days?: number;
  usage_limit?: number;
  stacking?: string;
  permanent?: boolean;
  enabled: boolean;
  updated_at: string;
}

export interface AdminChoiceRow {
  id: string;
  title: string;
  reward_ids: string[];
  eligibility_window_days?: number;
  expires_at?: string;
  enabled: boolean;
  updated_at: string;
}

export const gamificationAdminService = {
  async getFlags(): Promise<GamificationFlags | null> {
    try {
      const res = await apiClient.get<GamificationFlags>('/admin/gamification/flags');
      return res ?? null;
    } catch {
      return null;
    }
  },

  async updateFlags(payload: Partial<GamificationFlags>): Promise<GamificationFlags | null> {
    try {
      const res = await apiClient.patch<GamificationFlags>('/admin/gamification/flags', payload);
      return res ?? null;
    } catch {
      return null;
    }
  },

  async getGoals(params?: { level?: number; type?: string; enabled?: boolean }): Promise<AdminGoalRow[]> {
    try {
      const res = await apiClient.get<{ goals: AdminGoalRow[] }>('/admin/gamification/goals', { params });
      return res?.goals ?? [];
    } catch {
      return [];
    }
  },

  async getGoal(id: string): Promise<AdminGoalRow | null> {
    try {
      const res = await apiClient.get<AdminGoalRow>(`/admin/gamification/goals/${id}`);
      return res ?? null;
    } catch {
      return null;
    }
  },

  async createGoal(body: Partial<AdminGoalRow>): Promise<AdminGoalRow | null> {
    try {
      const res = await apiClient.post<AdminGoalRow>('/admin/gamification/goals', body);
      return res ?? null;
    } catch {
      return null;
    }
  },

  async updateGoal(id: string, body: Partial<AdminGoalRow>): Promise<AdminGoalRow | null> {
    try {
      const res = await apiClient.patch<AdminGoalRow>(`/admin/gamification/goals/${id}`, body);
      return res ?? null;
    } catch {
      return null;
    }
  },

  async getRewards(): Promise<AdminRewardRow[]> {
    try {
      const res = await apiClient.get<{ rewards: AdminRewardRow[] }>('/admin/gamification/rewards');
      return res?.rewards ?? [];
    } catch {
      return [];
    }
  },

  async getGovernor(): Promise<Record<string, unknown> | null> {
    try {
      const res = await apiClient.get<Record<string, unknown>>('/admin/gamification/governor');
      return res ?? null;
    } catch {
      return null;
    }
  },

  async getAbuseSignals(params?: { type?: string; page?: number }): Promise<{ items: unknown[] }> {
    try {
      const res = await apiClient.get<{ items: unknown[] }>('/admin/gamification/abuse', { params });
      return res ?? { items: [] };
    } catch {
      return { items: [] };
    }
  },

  async pauseRewardsForCleaner(cleanerId: string, reason?: string): Promise<boolean> {
    try {
      await apiClient.post(`/admin/gamification/abuse/${cleanerId}/pause-rewards`, { reason });
      return true;
    } catch {
      return false;
    }
  },

  async getReward(id: string): Promise<AdminRewardRow | null> {
    try {
      const res = await apiClient.get<AdminRewardRow>(`/admin/gamification/rewards/${id}`);
      return res ?? null;
    } catch {
      return null;
    }
  },

  async updateReward(id: string, body: Partial<AdminRewardRow>): Promise<AdminRewardRow | null> {
    try {
      const res = await apiClient.patch<AdminRewardRow>(`/admin/gamification/rewards/${id}`, body);
      return res ?? null;
    } catch {
      return null;
    }
  },

  async getChoices(): Promise<AdminChoiceRow[]> {
    try {
      const res = await apiClient.get<{ choice_groups: AdminChoiceRow[] }>('/admin/gamification/choices');
      return res?.choice_groups ?? [];
    } catch {
      return [];
    }
  },

  async getChoice(id: string): Promise<AdminChoiceRow | null> {
    try {
      const res = await apiClient.get<AdminChoiceRow>(`/admin/gamification/choices/${id}`);
      return res ?? null;
    } catch {
      return null;
    }
  },

  async createChoice(body: Partial<AdminChoiceRow>): Promise<AdminChoiceRow | null> {
    try {
      const res = await apiClient.post<AdminChoiceRow>('/admin/gamification/choices', body);
      return res ?? null;
    } catch {
      return null;
    }
  },

  async updateChoice(id: string, body: Partial<AdminChoiceRow>): Promise<AdminChoiceRow | null> {
    try {
      const res = await apiClient.patch<AdminChoiceRow>(`/admin/gamification/choices/${id}`, body);
      return res ?? null;
    } catch {
      return null;
    }
  },

  /** Support debug: full gamification state for a cleaner */
  async getSupportGamification(cleanerId: string): Promise<SupportGamificationResponse | null> {
    try {
      const res = await apiClient.get<SupportGamificationResponse>(
        `/admin/support/cleaner/${cleanerId}/gamification`
      );
      return res ?? null;
    } catch {
      return null;
    }
  },

  async recomputeSupportGamification(cleanerId: string): Promise<SupportGamificationResponse | null> {
    try {
      const res = await apiClient.post<SupportGamificationResponse>(
        `/admin/support/cleaner/${cleanerId}/gamification/recompute`,
        {}
      );
      return res ?? null;
    } catch {
      return null;
    }
  },

  async grantSupportReward(
    cleanerId: string,
    payload: { reward_id: string; reason?: string; duration_days?: number }
  ): Promise<boolean> {
    try {
      await apiClient.post(
        `/admin/support/cleaner/${cleanerId}/gamification/grant-reward`,
        payload
      );
      return true;
    } catch {
      return false;
    }
  },

  async removeSupportReward(
    cleanerId: string,
    payload: { reward_id: string; reason?: string }
  ): Promise<boolean> {
    try {
      await apiClient.post(
        `/admin/support/cleaner/${cleanerId}/gamification/remove-reward`,
        payload
      );
      return true;
    } catch {
      return false;
    }
  },
};

export interface SupportGamificationResponse {
  cleaner_id: string;
  current_level: number;
  level_label?: string;
  progress_paused: boolean;
  progress_paused_reason: string | null;
  core_completion_percent?: number;
  stretch_selected?: boolean;
  maintenance_ok?: boolean;
  goal_progress?: { goal_id: string; title: string; current: number; target: number; window?: string; status: string }[];
  active_rewards?: { reward_id: string; name: string; granted_at: string; expires_at?: string }[];
  reward_grant_history?: { reward_id: string; name: string; granted_at: string; trigger?: string; goal_id?: string }[];
  computed_metrics_debug?: Record<string, number>;
  support_explanation?: string;
}
