/**
 * Idempotency keys for payment and credit charge requests.
 * Prevents double-charges when the user retries or the request is replayed.
 * Backend should use this header to deduplicate POSTs (e.g. Stripe, credits checkout).
 */

const hasCrypto = typeof crypto !== 'undefined' && crypto.randomUUID;

export function generateIdempotencyKey(): string {
  if (hasCrypto) return crypto.randomUUID();
  // Fallback for older envs (e.g. some SSR)
  return `key-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export const IDEMPOTENCY_HEADER = 'Idempotency-Key' as const;
