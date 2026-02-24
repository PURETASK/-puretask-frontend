/**
 * Admin settings category display labels.
 * Backend returns raw setting_type; frontend uses this map for display.
 * @see backend src/routes/admin/settings.ts – stop using formatCategoryLabel(); return raw setting_type
 */
export const ADMIN_SETTINGS_CATEGORY_LABELS: Record<string, string> = {
  platform: 'Platform Configuration',
  booking: 'Booking Rules',
  pricing: 'Pricing & Fees',
  credits: 'Credit System',
  payment: 'Payment Settings',
  payout: 'Payout Settings',
  notifications: 'Notifications',
  email: 'Email Configuration',
  sms: 'SMS Configuration',
  features: 'Feature Flags',
  ai: 'AI Assistant',
  security: 'Security Settings',
  rate_limit: 'Rate Limiting',
  tiers: 'Cleaner Tiers',
  reviews: 'Review System',
  disputes: 'Disputes',
  referral: 'Referral Program',
  analytics: 'Analytics & Tracking',
  api: 'API Configuration',
  webhooks: 'Webhooks',
  backup: 'Backup & Maintenance',
  maintenance: 'Maintenance',
};

/**
 * Get display label for a setting category (setting_type). Fallback: capitalize type.
 */
export function getAdminSettingsCategoryLabel(settingType: string): string {
  return (
    ADMIN_SETTINGS_CATEGORY_LABELS[settingType] ??
    settingType.charAt(0).toUpperCase() + settingType.slice(1).replace(/_/g, ' ')
  );
}
