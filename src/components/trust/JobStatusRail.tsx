'use client';

import { motion } from 'motion/react';
import { getStatusIndex, getStatusLabel, getStatusOrder, type JobStatus } from './jobStatus';

type Props = {
  status: JobStatus;
  compact?: boolean;
};

export default function JobStatusRail({ status, compact = false }: Props) {
  const steps = getStatusOrder();
  const activeIndex = getStatusIndex(status);

  const dotSize = compact ? 10 : 12;
  const railHeight = compact ? 2 : 3;

  return (
    <div className="w-full">
      <div
        className={`flex items-center justify-between ${compact ? 'text-[11px]' : 'text-xs'} text-white/65`}
      >
        {steps.map((s, i) => (
          <span key={s} className={i <= activeIndex ? 'text-white/85' : ''}>
            {getStatusLabel(s)}
          </span>
        ))}
      </div>

      <div className="relative mt-2">
        <div
          className="w-full rounded-full bg-white/10"
          style={{ height: railHeight }}
        />

        <motion.div
          className="absolute left-0 top-0 rounded-full"
          style={{
            height: railHeight,
            background:
              'linear-gradient(90deg, rgba(34,197,94,0.9), rgba(96,165,250,0.9))',
          }}
          initial={false}
          animate={{
            width: `${(activeIndex / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute top-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            background: 'rgba(255,255,255,0.92)',
            boxShadow:
              '0 0 0 6px rgba(34,197,94,0.10), 0 0 18px rgba(34,197,94,0.18)',
          }}
          initial={false}
          animate={{
            left: `calc(${(activeIndex / (steps.length - 1)) * 100}% - ${dotSize / 2}px)`,
            scale: status === 'working' || status === 'on_route' ? 1.05 : 1.0,
          }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
        />

        {(status === 'on_route' || status === 'working') && (
          <motion.div
            className="pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: dotSize + 10,
              height: dotSize + 10,
              left: `calc(${(activeIndex / (steps.length - 1)) * 100}% - ${(dotSize + 10) / 2}px)`,
              border: '1px solid rgba(34,197,94,0.35)',
            }}
            animate={{
              opacity: [0.15, 0.55, 0.15],
              scale: [0.98, 1.12, 0.98],
            }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>
    </div>
  );
}
