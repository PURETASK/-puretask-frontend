/**
 * Environment Configuration with Validation
 * Validates all required environment variables at startup
 */

interface EnvConfig {
  // API
  NEXT_PUBLIC_API_URL: string;
  
  // Analytics
  NEXT_PUBLIC_GA_ID?: string;
  
  // Error Tracking
  NEXT_PUBLIC_SENTRY_DSN?: string;
  
  // Maps
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string;
  NEXT_PUBLIC_MAPBOX_TOKEN?: string;
  
  // Site
  NEXT_PUBLIC_SITE_URL?: string;
  
  // Feature Flags
  NEXT_PUBLIC_ENABLE_FEATURE_X?: string;
  NEXT_PUBLIC_ENABLE_FEATURE_Y?: string;
}

const requiredEnvVars = ['NEXT_PUBLIC_API_URL'] as const;
const optionalEnvVars = [
  'NEXT_PUBLIC_GA_ID',
  'NEXT_PUBLIC_SENTRY_DSN',
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  'NEXT_PUBLIC_MAPBOX_TOKEN',
  'NEXT_PUBLIC_SITE_URL',
] as const;

export function validateEnv(): EnvConfig {
  const missing: string[] = [];
  const config: Partial<EnvConfig> = {};

  // Check required variables
  requiredEnvVars.forEach((key) => {
    const value = process.env[key];
    if (!value) {
      missing.push(key);
    } else {
      (config as any)[key] = value;
    }
  });

  // Check optional variables
  optionalEnvVars.forEach((key) => {
    const value = process.env[key];
    if (value) {
      (config as any)[key] = value;
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file.'
    );
  }

  return config as EnvConfig;
}

export const env = validateEnv();

/**
 * Feature Flags
 */
export const featureFlags = {
  enableFeatureX: process.env.NEXT_PUBLIC_ENABLE_FEATURE_X === 'true',
  enableFeatureY: process.env.NEXT_PUBLIC_ENABLE_FEATURE_Y === 'true',
  enableAdvancedSearch: true, // Default enabled
  enableDarkMode: true, // Default enabled
  enableNotifications: true, // Default enabled
} as const;

/**
 * Get feature flag value
 */
export function isFeatureEnabled(flag: keyof typeof featureFlags): boolean {
  return featureFlags[flag];
}
