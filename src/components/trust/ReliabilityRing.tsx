'use client';

import { motion } from 'framer-motion';
import { clampScore, getReliabilityColor, getReliabilityLabel } from './reliability';

type Props = {
  score: number;
  size?: number;
  stroke?: number;
  showNumber?: boolean;
  label?: string;
  /** Use 'light' on light backgrounds (e.g. cards on gray-50) so center text is readable */
  variant?: 'light' | 'dark';
};

export default function ReliabilityRing({
  score,
  size = 44,
  stroke = 6,
  showNumber = true,
  label,
  variant = 'dark',
}: Props) {
  const s = clampScore(score);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dashOffset = c * (1 - s / 100);
  const color = getReliabilityColor(s);
  const ariaLabel = label ?? `${getReliabilityLabel(s)}: ${s}%`;
  const isLight = variant === 'light';
  const trackStroke = isLight ? '#E5E7EB' : '#FFFFFF';
  const trackOpacity = isLight ? 0.5 : 0.1;
  const textClass = isLight ? 'text-gray-900 tabular-nums' : 'text-white/85 tabular-nums';

  return (
    <div className="inline-flex items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={ariaLabel}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={trackStroke}
            strokeOpacity={trackOpacity}
            strokeWidth={stroke}
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ filter: 'drop-shadow(0px 0px 6px rgba(34, 197, 94, 0.15))' }}
          />
        </svg>
        {showNumber && (
          <div className="absolute inset-0 grid place-items-center">
            <span className={`text-xs font-medium ${textClass}`}>{s}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
