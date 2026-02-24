export type ReliabilityTier = 'new' | 'pro' | 'elite';

export function getReliabilityTier(score: number): ReliabilityTier {
  if (score >= 90) return 'elite';
  if (score >= 75) return 'pro';
  return 'new';
}

export function getReliabilityLabel(score: number): string {
  const tier = getReliabilityTier(score);
  if (tier === 'elite') return 'Elite reliability';
  if (tier === 'pro') return 'Pro reliability';
  return 'New reliability';
}

export function getReliabilityColor(score: number): string {
  if (score >= 90) return '#22C55E'; // success green
  if (score >= 75) return '#60A5FA'; // calm blue
  return '#94A3B8'; // neutral
}

export function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}
