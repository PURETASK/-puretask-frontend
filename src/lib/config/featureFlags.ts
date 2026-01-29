/**
 * Feature Flags System
 * Centralized feature flag management
 */

import { isFeatureEnabled } from './env';

export type FeatureFlag = 
  | 'advancedSearch'
  | 'darkMode'
  | 'notifications'
  | 'featureX'
  | 'featureY';

/**
 * Check if a feature is enabled
 */
export function useFeatureFlag(flag: FeatureFlag): boolean {
  // Map feature flag names to env config
  const flagMap: Record<FeatureFlag, keyof typeof import('./env').featureFlags> = {
    advancedSearch: 'enableAdvancedSearch',
    darkMode: 'enableDarkMode',
    notifications: 'enableNotifications',
    featureX: 'enableFeatureX',
    featureY: 'enableFeatureY',
  };

  return isFeatureEnabled(flagMap[flag]);
}

/**
 * Feature flag hook for React components
 */
export function useFeatureFlags() {
  return {
    advancedSearch: useFeatureFlag('advancedSearch'),
    darkMode: useFeatureFlag('darkMode'),
    notifications: useFeatureFlag('notifications'),
    featureX: useFeatureFlag('featureX'),
    featureY: useFeatureFlag('featureY'),
  };
}
