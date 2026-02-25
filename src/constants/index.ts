/**
 * Frontend constants for labels and copy (i18n-ready).
 * Backend returns data only; frontend applies these for display.
 */

export {
  TRUST_CHECKLIST_ROOM_LABELS,
  mergeChecklistWithLabels,
  type ChecklistItemFromAPI,
  type ChecklistItemWithLabel,
} from './trustChecklist';

export {
  ADMIN_SETTINGS_CATEGORY_LABELS,
  getAdminSettingsCategoryLabel,
} from './adminSettingsCategories';

export {
  MATCHING_EXPLANATION_TEMPLATES,
  MATCHING_SUMMARY_PHRASES,
  buildExplanationFromBreakdown,
  type MatchingBreakdownKey,
  type MatchingBreakdown,
  type MatchingBreakdownFactor,
} from './matchingExplanations';

export {
  JOB_STATUS,
  JOB_STATUS_TERMINAL,
  JOB_STATUS_ESCROW_HELD,
  JOB_STATUS_POLL_TRACKING,
  JOB_STATUS_TRANSITIONS,
  JOB_STATUS_LABELS,
  JOB_STATUS_BADGE_CLASSES,
  getJobStatusLabel,
  getJobStatusBadgeClass,
  canTransition,
  isTerminalStatus,
  isEscrowHeld,
  shouldPollTracking,
  type JobStatusValue,
} from './jobStatus';
