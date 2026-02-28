'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { motionTokens } from '@/components/motion/tokens';
import { cn } from '@/lib/utils';

export interface BeforeAfterPhoto {
  id: string;
  url: string;
  thumbnail_url?: string | null;
  type: 'before' | 'after';
}

export interface BeforeAfterCompareProps {
  before: BeforeAfterPhoto[];
  after: BeforeAfterPhoto[];
  className?: string;
}

/**
 * Before/after slider for job proof photos. One before + one after with a draggable divider.
 */
export function BeforeAfterCompare({ before, after, className }: BeforeAfterCompareProps) {
  const [position, setPosition] = useState(50); // 0 = all before, 100 = all after
  const beforeImg = before[0];
  const afterImg = after[0];
  if (!beforeImg && !afterImg) return null;
  const beforeUrl = beforeImg?.thumbnail_url || beforeImg?.url;
  const afterUrl = afterImg?.thumbnail_url || afterImg?.url;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionTokens.duration.base }}
      className={cn('relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800', className)}
    >
      <div className="relative aspect-video w-full">
        {afterUrl && (
          <div className="absolute inset-0">
            <img
              src={afterUrl}
              alt="After"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        {beforeUrl && (
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${position}%` }}
          >
            <img
              src={beforeUrl}
              alt="Before"
              className="h-full w-full object-cover object-left-top"
            />
          </motion.div>
        )}
        <div
          className="absolute top-0 bottom-0 w-1 cursor-ew-resize bg-white/90 shadow-md"
          style={{ left: `calc(${position}% - 2px)` }}
          onPointerDown={(e) => {
            const start = e.clientX;
            const startPos = position;
            const move = (e2: PointerEvent) => {
              const el = e.currentTarget.parentElement;
              if (!el) return;
              const rect = el.getBoundingClientRect();
              const p = ((startPos * rect.width) / 100 + (e2.clientX - start)) / rect.width;
              setPosition(Math.min(100, Math.max(0, p * 100)));
            };
            const up = () => {
              document.removeEventListener('pointermove', move);
              document.removeEventListener('pointerup', up);
            };
            document.addEventListener('pointermove', move);
            document.addEventListener('pointerup', up);
          }}
          role="slider"
          aria-valuenow={position}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
        />
        <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
          Before / After
        </div>
      </div>
    </motion.div>
  );
}
