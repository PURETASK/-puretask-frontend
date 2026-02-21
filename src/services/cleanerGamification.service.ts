/**
 * Cleaner-facing gamification API.
 * Endpoints documented in docs/BACKEND_ENDPOINTS.md and GAMIFICATION_BACKEND_IMPLEMENTATION_GUIDE.md.
 * All methods catch errors and return null/empty so UI can show placeholders until backend is ready.
 */
import { apiClient } from '@/lib/api';

export interface CleanerProgressSummary {
  current_level: number;
  level_label?: string;
  core_completion_percent?: number;
  stretch_selected?: boolean;
  maintenance_ok?: boolean;
  progress_paused?: boolean;
  progress_paused_reason?: string | null;
  active_rewards?: CleanerActiveReward[];
  next_best_actions?: { title: string; description: string; action_href?: string; action_label?: string; unlock_preview?: string }[];
}

export interface CleanerActiveReward {
  reward_id: string;
  name: string;
  effect?: string;
  expires_at?: string;
  days_remaining?: number;
  applies_to?: string;
}

export interface CleanerGoalWithProgress {
  id: string;
  type?: 'core' | 'stretch' | 'maintenance' | string;
  title?: string;
  current?: number;
  target?: number;
  window?: string;
  counts_when?: string;
  reward_preview?: string;
}

export interface CleanerBadgeItem {
  id: string;
  name: string;
  icon?: string;
  earned: boolean;
  earned_date?: string;
  how_to_earn?: string;
  featured?: boolean;
  can_pin?: boolean;
  category?: 'core' | 'fun';
}

export interface CleanerRewardHistoryItem {
  reward_id: string;
  name: string;
  granted_at: string;
  trigger?: string;
  goal_id?: string;
  effect?: string;
}

export interface CleanerChoiceEligible {
  choice_group_id: string;
  title: string;
  reward_options: { reward_id: string; name: string; effect?: string }[];
  expires_at?: string;
}

export interface CleanerStats {
  on_time_rate?: number | string;
  acceptance_rate?: number | string;
  photo_compliance?: number | string;
  avg_rating?: number | string;
  disputes_opened_lost?: string;
  add_on_completions?: number | string;
}

export interface CleanerMaintenanceStatus {
  progress_paused: boolean;
  progress_paused_reason?: string | null;
  recovery_steps?: string[];
}

export const cleanerGamificationService = {
  /**
   * GET /cleaner/progress or /cleaner/progress/summary
   * Returns full progress summary for the authenticated cleaner.
   */
  async getProgress(): Promise<CleanerProgressSummary | null> {
    try {
      const res = await apiClient.get<CleanerProgressSummary>('/cleaner/progress');
      return res ?? null;
    } catch {
      try {
        const res = await apiClient.get<CleanerProgressSummary>('/cleaner/progress/summary');
        return res ?? null;
      } catch {
        return null;
      }
    }
  },

  /**
   * GET /cleaner/goals — list goals with progress for current cleaner.
   */
  async getGoals(): Promise<CleanerGoalWithProgress[]> {
    try {
      const res = await apiClient.get<{ goals: CleanerGoalWithProgress[] }>('/cleaner/goals');
      return res?.goals ?? [];
    } catch {
      return [];
    }
  },

  /**
   * GET /cleaner/badges — earned badges and definitions.
   */
  async getBadges(): Promise<CleanerBadgeItem[]> {
    try {
      const res = await apiClient.get<{ badges: CleanerBadgeItem[] }>('/cleaner/badges');
      return res?.badges ?? [];
    } catch {
      return [];
    }
  },

  /**
   * GET /cleaner/rewards — active rewards, history, choice-eligible.
   * Backend may return { active_rewards, reward_history, choice_eligible } or similar.
   */
  async getRewards(): Promise<{
    active_rewards: CleanerActiveReward[];
    reward_history: CleanerRewardHistoryItem[];
    choice_eligible: CleanerChoiceEligible[];
  }> {
    try {
      const res = await apiClient.get<{
        active_rewards?: CleanerActiveReward[];
        reward_history?: CleanerRewardHistoryItem[];
        choice_eligible?: CleanerChoiceEligible[];
      }>('/cleaner/rewards');
      return {
        active_rewards: res?.active_rewards ?? [],
        reward_history: res?.reward_history ?? [],
        choice_eligible: res?.choice_eligible ?? [],
      };
    } catch {
      return { active_rewards: [], reward_history: [], choice_eligible: [] };
    }
  },

  /**
   * GET /cleaner/stats — metrics for Stats page.
   */
  async getStats(): Promise<CleanerStats | null> {
    try {
      const res = await apiClient.get<CleanerStats>('/cleaner/stats');
      return res ?? null;
    } catch {
      return null;
    }
  },

  /**
   * GET /cleaner/maintenance — paused status and recovery (or use progress summary).
   */
  async getMaintenance(): Promise<CleanerMaintenanceStatus | null> {
    try {
      const res = await apiClient.get<CleanerMaintenanceStatus>('/cleaner/maintenance');
      return res ?? null;
    } catch {
      return null;
    }
  },

  /**
   * POST /cleaner/rewards/choice/:choiceGroupId/select — record choice and grant reward.
   */
  async selectChoiceReward(choiceGroupId: string, rewardId: string): Promise<boolean> {
    try {
      await apiClient.post(`/cleaner/rewards/choice/${choiceGroupId}/select`, { reward_id: rewardId });
      return true;
    } catch {
      return false;
    }
  },
};
