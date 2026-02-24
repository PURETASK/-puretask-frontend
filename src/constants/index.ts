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
