// src/types/trust.ts
// Data contracts for Trust-Fintech credits, billing, appointments

export type ReliabilityBreakdown = {
  onTimePct: number;
  completionPct: number;
  cancellationPct: number; // lower is better
  communicationPct: number;
  qualityPct: number;
};

export type ReliabilityScore = {
  score: number; // 0-100
  tier: 'Excellent' | 'Good' | 'Watch' | 'Risk';
  breakdown: ReliabilityBreakdown;
  explainers: string[];
  lastUpdatedISO: string;
};

export type CreditLedgerEntry = {
  id: string;
  createdAtISO: string;
  type: 'deposit' | 'spend' | 'refund' | 'bonus' | 'fee';
  amount: number;
  currency: 'USD';
  description: string;
  status: 'pending' | 'posted' | 'reversed';
  relatedBookingId?: string;
  invoiceId?: string;
};

export type CreditsBalance = {
  balance: number;
  currency: 'USD';
  lastUpdatedISO: string;
};

export type InvoiceLineItem = {
  id: string;
  label: string;
  quantity?: number;
  unitPrice?: number;
  amount: number;
};

export type Invoice = {
  id: string;
  createdAtISO: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'refunded';
  subtotal: number;
  tax: number;
  total: number;
  currency: 'USD';
  bookingId?: string;
  receiptUrl?: string;
  lineItems: InvoiceLineItem[];
  paymentMethodSummary?: string;
};

export type AppointmentState =
  | 'scheduled'
  | 'en_route'
  | 'arrived'
  | 'checked_in'
  | 'completed';

export type GpsEvidence = {
  id: string;
  event: 'en_route' | 'arrived' | 'check_in' | 'check_out';
  atISO: string;
  lat: number;
  lng: number;
  accuracyM?: number;
  source: 'device' | 'manual_override';
};

export type PhotoEvidence = {
  id: string;
  kind: 'before' | 'after';
  url: string;
  createdAtISO: string;
  uploadedBy: 'cleaner' | 'client' | 'support';
};

export type ChecklistItem = {
  id: string;
  label: string;
  completed: boolean;
  completedAtISO?: string;
};

export type AppointmentEvent = {
  id: string;
  atISO: string;
  type:
    | 'state_change'
    | 'gps'
    | 'photo'
    | 'checklist'
    | 'payment'
    | 'note'
    | 'manual_override';
  summary: string;
  metadata?: Record<string, unknown>;
};

export type LiveAppointment = {
  bookingId: string;
  state: AppointmentState;
  etaISO?: string;
  reliability?: ReliabilityScore;
  gps: GpsEvidence[];
  photos: PhotoEvidence[];
  checklist: ChecklistItem[];
  events: AppointmentEvent[];
};
