// Trust-Fintech motion standards: opacity/transform only, nothing layout-janky

export const MOTION = {
  duration: {
    fast: 0.15,
    normal: 0.25,
    slow: 0.35,
  },
  easing: {
    easeOut: [0, 0, 0.2, 1] as const,
    easeInOut: [0.4, 0, 0.2, 1] as const,
  },
} as const;
