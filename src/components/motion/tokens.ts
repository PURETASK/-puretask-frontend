/**
 * Single source of truth for motion across PureTask.
 * Use these values in all Framer Motion components for a consistent, premium feel.
 */
export const motionTokens = {
  duration: {
    instant: 0.12,
    fast: 0.18,
    base: 0.28,
    slow: 0.42,
  },

  ease: {
    /** Premium "Apple-like" ease-out */
    out: [0.16, 1, 0.3, 1] as const,
    inOut: [0.65, 0, 0.35, 1] as const,
  },

  spring: {
    soft: { type: 'spring' as const, stiffness: 220, damping: 26, mass: 0.9 },
    medium: { type: 'spring' as const, stiffness: 320, damping: 28, mass: 0.9 },
    snappy: { type: 'spring' as const, stiffness: 520, damping: 34, mass: 0.9 },
  },

  hover: {
    lift: { y: -2, scale: 1.01 },
    press: { scale: 0.99 },
  },

  page: {
    enter: { opacity: 1, y: 0, filter: 'blur(0px)' },
    initial: { opacity: 0, y: 10, filter: 'blur(6px)' },
    exit: { opacity: 0, y: -8, filter: 'blur(6px)' },
  },

  stagger: {
    delayChildren: 0.04,
    staggerChildren: 0.06,
  },

  listItem: {
    hidden: { opacity: 0, y: 10, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
} as const;
