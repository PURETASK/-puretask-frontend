/**
 * Mobile Input Type Configuration
 * Optimizes form inputs for mobile keyboards and autocomplete
 */

export interface MobileInputConfig {
  type: string;
  inputMode?: 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  autoComplete?: string;
  pattern?: string;
}

export const mobileInputTypes: Record<string, MobileInputConfig> = {
  phone: {
    type: 'tel',
    inputMode: 'tel',
    autoComplete: 'tel',
  },
  email: {
    type: 'email',
    inputMode: 'email',
    autoComplete: 'email',
  },
  password: {
    type: 'password',
    autoComplete: 'current-password',
  },
  newPassword: {
    type: 'password',
    autoComplete: 'new-password',
  },
  number: {
    type: 'text',
    inputMode: 'numeric',
    pattern: '[0-9]*',
  },
  decimal: {
    type: 'text',
    inputMode: 'decimal',
  },
  search: {
    type: 'search',
    inputMode: 'search',
    autoComplete: 'off',
  },
  text: {
    type: 'text',
    inputMode: 'text',
    autoComplete: 'off',
  },
  name: {
    type: 'text',
    inputMode: 'text',
    autoComplete: 'name',
  },
  address: {
    type: 'text',
    inputMode: 'text',
    autoComplete: 'street-address',
  },
  city: {
    type: 'text',
    inputMode: 'text',
    autoComplete: 'address-level2',
  },
  zip: {
    type: 'text',
    inputMode: 'numeric',
    pattern: '[0-9]*',
    autoComplete: 'postal-code',
  },
  country: {
    type: 'text',
    inputMode: 'text',
    autoComplete: 'country',
  },
};

/**
 * Get mobile input configuration for a field type
 */
export function getMobileInputConfig(fieldType: string): MobileInputConfig {
  return mobileInputTypes[fieldType] || mobileInputTypes.text;
}
