/**
 * PureTask design tokens (from interactive prototype canon).
 * Use these for gradients, neutrals, and success states.
 */
export const BRAND = {
  blue: '#0078FF',
  aqua: '#00D4FF',
  graphite: '#1D2533',
  cloud: '#F7F9FC',
  mint: '#28C76F',
} as const;

export const gradientPrimary = `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.aqua})`;
