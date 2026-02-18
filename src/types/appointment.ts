import type { ReliabilityScore } from './reliability';

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

export type AppointmentEventType =
  | 'state_change'
  | 'gps'
  | 'photo'
  | 'checklist'
  | 'payment'
  | 'note'
  | 'manual_override';

export type AppointmentEvent = {
  id: string;
  atISO: string;
  type: AppointmentEventType;
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
