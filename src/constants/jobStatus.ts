/**
 * Canonical job/booking status — single source of truth for frontend.
 * Keep in sync with docs/CANONICAL_JOB_STATUS.md (backend + n8n use that doc).
 */

export const JOB_STATUS = [
  'pending',
  'accepted',
  'scheduled',
  'on_my_way',
  'in_progress',
  'awaiting_approval',
  'completed',
  'cancelled',
  'disputed',
] as const;

export type JobStatusValue = (typeof JOB_STATUS)[number];

/** Terminal statuses: no further transitions. */
export const JOB_STATUS_TERMINAL: JobStatusValue[] = ['completed', 'cancelled', 'disputed'];

/** Statuses where credits are held in escrow (show "Credits held" in UI). */
export const JOB_STATUS_ESCROW_HELD: JobStatusValue[] = [
  'pending',
  'accepted',
  'scheduled',
  'on_my_way',
  'in_progress',
  'awaiting_approval',
];

/** Statuses where we poll tracking (live presence). */
export const JOB_STATUS_POLL_TRACKING: JobStatusValue[] = [
  'pending',
  'accepted',
  'scheduled',
  'in_progress',
  'on_my_way',
  'awaiting_approval',
];

export function isEscrowHeld(status: string): boolean {
  return JOB_STATUS_ESCROW_HELD.includes(status as JobStatusValue);
}

export function shouldPollTracking(status: string): boolean {
  return JOB_STATUS_POLL_TRACKING.includes(status as JobStatusValue);
}

/** Allowed transitions: from -> to[] */
export const JOB_STATUS_TRANSITIONS: Record<JobStatusValue, JobStatusValue[]> = {
  pending: ['accepted', 'cancelled'],
  accepted: ['on_my_way', 'cancelled'],
  scheduled: ['on_my_way', 'cancelled'],
  on_my_way: ['in_progress', 'cancelled'],
  in_progress: ['awaiting_approval', 'cancelled'],
  awaiting_approval: ['completed', 'disputed'],
  completed: [],
  cancelled: [],
  disputed: ['completed', 'cancelled'],
};

export function canTransition(from: string, to: string): boolean {
  const fromKey = from as JobStatusValue;
  const toKey = to as JobStatusValue;
  if (!JOB_STATUS.includes(fromKey) || !JOB_STATUS.includes(toKey)) return false;
  return JOB_STATUS_TRANSITIONS[fromKey].includes(toKey);
}

export function isTerminalStatus(status: string): boolean {
  return JOB_STATUS_TERMINAL.includes(status as JobStatusValue);
}

/** Display labels for UI (badges, filters). */
export const JOB_STATUS_LABELS: Record<JobStatusValue, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  scheduled: 'Scheduled',
  on_my_way: 'On the way',
  in_progress: 'In Progress',
  awaiting_approval: 'Awaiting your approval',
  completed: 'Completed',
  cancelled: 'Cancelled',
  disputed: 'Disputed',
};

/** Tailwind-style badge colors (bg-*-100 text-*-800). */
export const JOB_STATUS_BADGE_CLASSES: Record<JobStatusValue, string> = {
  pending: 'bg-gray-100 text-gray-800',
  accepted: 'bg-blue-100 text-blue-800',
  scheduled: 'bg-blue-100 text-blue-800',
  on_my_way: 'bg-indigo-100 text-indigo-800',
  in_progress: 'bg-purple-100 text-purple-800',
  awaiting_approval: 'bg-amber-100 text-amber-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-600',
  disputed: 'bg-red-100 text-red-800',
};

export function getJobStatusLabel(status: string): string {
  return JOB_STATUS_LABELS[status as JobStatusValue] ?? status;
}

export function getJobStatusBadgeClass(status: string): string {
  return JOB_STATUS_BADGE_CLASSES[status as JobStatusValue] ?? 'bg-gray-100 text-gray-800';
}
