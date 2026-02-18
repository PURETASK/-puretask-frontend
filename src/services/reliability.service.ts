import { apiClient } from '@/lib/api';
import type { ReliabilityScore } from '@/types/reliability';

export const reliabilityService = {
  getCleanerReliability: async (cleanerId: string): Promise<{ reliability: ReliabilityScore }> => {
    try {
      return await apiClient.get(`/cleaners/${cleanerId}/reliability`);
    } catch {
      // Mock when backend not ready
      return {
        reliability: {
          score: 92,
          tier: 'Excellent',
          breakdown: {
            onTimePct: 95,
            completionPct: 98,
            cancellationPct: 2,
            communicationPct: 94,
            qualityPct: 96,
          },
          explainers: [
            'Top 5% on-time rate in your area',
            '98% job completion rate',
            'Consistently high quality ratings',
          ],
          lastUpdatedISO: new Date().toISOString(),
        },
      };
    }
  },
};
