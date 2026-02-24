/**
 * Optional: templates to build matching explanation bullets from GET match/explain response.
 * Backend can return only breakdown (reliability, distance, repeatClient, flexibility, riskAlignment)
 * with .score and .description; frontend builds the bullet list from these for i18n.
 * @see backend matching routes – can stop sending top-level "explanation" array
 */

export type MatchingBreakdownKey =
  | 'reliability'
  | 'distance'
  | 'repeatClient'
  | 'flexibility'
  | 'riskAlignment';

/** Template ideas for building explanation bullets from breakdown (use breakdown.*.description or these) */
export const MATCHING_EXPLANATION_TEMPLATES: Record<
  MatchingBreakdownKey,
  { withScore?: string; fallback: string }
> = {
  reliability: {
    withScore: 'Based on {{score}}/100 reliability score',
    fallback: 'Reliability score',
  },
  distance: {
    withScore: '{{km}}km from job location',
    fallback: 'Distance from job',
  },
  repeatClient: {
    fallback: 'Bonus for previous successful jobs with you',
  },
  flexibility: {
    fallback: 'Schedule flexibility',
  },
  riskAlignment: {
    fallback: 'Risk alignment with client profile',
  },
};

/** Summary bullet templates (e.g. "High reliability score (X/100)", "Close proximity (Xkm away)") */
export const MATCHING_SUMMARY_PHRASES = {
  highReliability: 'High reliability score ({{score}}/100)',
  closeProximity: 'Close proximity ({{km}}km away)',
  repeatClientBonus: 'Has successfully completed jobs with you before',
  noRepeatHistory: 'No prior history with this client',
  eliteTier: 'Elite tier cleaner – top performer',
  proTier: 'Pro tier cleaner – highly rated',
  flexibilityLow: 'Low flexibility (prefers fixed schedules)',
  flexibilityHigh: 'Flexible with schedule changes',
  riskAlignment: 'Good risk alignment',
  riskAdjustment: 'Adjustment based on client risk profile',
} as const;

/** Breakdown factor shape from API (score + optional description) */
export type MatchingBreakdownFactor = {
  score?: number;
  description?: string;
  km?: number;
};

export type MatchingBreakdown = Partial<
  Record<MatchingBreakdownKey, MatchingBreakdownFactor>
>;

/**
 * Build explanation bullets from breakdown. Use when backend returns only breakdown
 * (no top-level explanation array). Uses backend description when present, else template phrases.
 */
export function buildExplanationFromBreakdown(breakdown: MatchingBreakdown): string[] {
  const bullets: string[] = [];
  const keys: MatchingBreakdownKey[] = [
    'reliability',
    'distance',
    'repeatClient',
    'flexibility',
    'riskAlignment',
  ];

  for (const key of keys) {
    const factor = breakdown[key];
    if (!factor) continue;

    const template = MATCHING_EXPLANATION_TEMPLATES[key];
    const score = factor.score;
    const desc = factor.description;

    if (desc && desc.trim()) {
      bullets.push(desc.trim());
      continue;
    }

    if (key === 'reliability' && typeof score === 'number' && template.withScore) {
      bullets.push(template.withScore.replace('{{score}}', String(Math.round(score))));
    } else if (key === 'distance' && (factor.km != null || typeof score === 'number') && template.withScore) {
      const km = factor.km ?? (typeof score === 'number' ? Math.round(score) : 0);
      bullets.push(template.withScore.replace('{{km}}', String(km)));
    } else {
      bullets.push(template.fallback);
    }
  }

  return bullets;
}
