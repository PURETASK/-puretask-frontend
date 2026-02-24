/**
 * Canonical Job Details UI DTO — shape the frontend uses for the tracking surface.
 * Backend can return this from GET /jobs/:jobId/details or we build it from multiple calls.
 */

// ─── Job (identity + schedule + location + status) ─────────────────────────
export type JobDetailsJob = {
  id: string;
  status: string; // backend: pending | accepted | on_my_way | in_progress | awaiting_approval | completed | cancelled | disputed
  scheduled_start_at: string;
  scheduled_end_at: string;
  actual_start_at?: string | null;
  actual_end_at?: string | null;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  credit_amount?: number;
  client_id?: string;
  cleaner_id?: string | null;
  service_type?: string;
  created_at?: string;
};

// ─── Cleaner (display + reliability) ───────────────────────────────────────
export type JobDetailsCleaner = {
  id: string;
  full_name?: string;
  name?: string;
  email?: string;
  reliability_score?: number; // 0–100 for ReliabilityRing
  tier?: string;
  avg_rating?: number;
  jobs_completed?: number;
  avatar_url?: string;
};

// ─── Presence (check-ins + optional last position) ───────────────────────────
export type JobCheckIn = {
  id: string;
  job_id: string;
  cleaner_id?: string;
  type: 'check_in' | 'check_out';
  lat: number;
  lng: number;
  distance_from_job_meters?: number | null;
  is_within_radius?: boolean | null;
  created_at: string;
};

export type JobDetailsPresence = {
  checkins: JobCheckIn[];
  /** Latest cleaner location if job_events / tracking exists */
  lastCleanerPosition?: { lat: number; lng: number; created_at: string } | null;
};

// ─── Ledger (credit entries + payment intent + payout) ───────────────────────
export type CreditLedgerEntryForJob = {
  id: string;
  user_id: string;
  job_id: string;
  delta_credits: number;
  reason: string; // e.g. 'job_escrow' | 'job_release'
  created_at: string;
};

export type PaymentIntentForJob = {
  id: string;
  job_id: string;
  stripe_payment_intent_id?: string;
  status: string;
  amount_cents: number;
  currency: string;
  purpose?: string;
  created_at: string;
  updated_at: string;
};

export type PayoutForJob = {
  id: string;
  job_id: string;
  amount_cents: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type JobDetailsLedger = {
  ledgerEntries: CreditLedgerEntryForJob[];
  paymentIntent: PaymentIntentForJob | null;
  payout: PayoutForJob | null;
};

// ─── Photos ───────────────────────────────────────────────────────────────
export type JobPhoto = {
  id: string;
  job_id: string;
  uploaded_by?: string;
  type: 'before' | 'after';
  url: string;
  thumbnail_url?: string | null;
  created_at: string;
};

// ─── API response (GET /jobs/:jobId/details) ───────────────────────────────
/** Response body of GET /jobs/:jobId/details. Backend sends { data: JobDetailsResponse }. */
export interface JobDetailsResponse {
  job: JobDetailsJob;
  cleaner: JobDetailsCleaner | null;
  checkins: JobCheckIn[];
  photos: JobPhoto[];
  ledgerEntries: CreditLedgerEntryForJob[];
  paymentIntent: PaymentIntentForJob | null;
  payout: PayoutForJob | null;
}

// ─── Full DTO (normalized for UI) ─────────────────────────────────────────
export type JobDetailsDTO = {
  job: JobDetailsJob;
  cleaner: JobDetailsCleaner | null;
  presence: JobDetailsPresence;
  ledger: JobDetailsLedger;
  photos: JobPhoto[];
};

// ─── Tracking (GET /tracking/:jobId) ──────────────────────────────────────
/** Live presence from GET /tracking/:jobId. Backend may return different shapes; we only require currentLocation + optional status/events. */
export type TrackingState = {
  jobId?: string;
  status?: string;
  /** Latest cleaner location for approach dot / presence map */
  currentLocation?: { lat: number; lng: number; at?: string };
  events?: Array<{ type: string; created_at: string; payload?: unknown }>;
};
