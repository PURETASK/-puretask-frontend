export type ReliabilityBreakdown = {
  onTimePct: number;
  completionPct: number;
  cancellationPct: number; // lower is better
  communicationPct: number;
  qualityPct: number;
};

export type ReliabilityTier = 'Excellent' | 'Good' | 'Watch' | 'Risk';

export type ReliabilityScore = {
  score: number; // 0-100
  tier: ReliabilityTier;
  breakdown: ReliabilityBreakdown;
  explainers: string[]; // "Why ranked #1..."
  lastUpdatedISO: string;
};
