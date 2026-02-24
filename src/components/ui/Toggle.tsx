'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { motionTokens } from '@/components/motion/tokens';

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: { track: 'w-8 h-4', thumb: 'h-3 w-3', xOff: 2, xOn: 16 },
  md: { track: 'w-11 h-6', thumb: 'h-5 w-5', xOff: 2, xOn: 20 },
  lg: { track: 'w-14 h-7', thumb: 'h-6 w-6', xOff: 2, xOn: 28 },
} as const;

export function Toggle({ checked = false, onChange, label, disabled = false, size = 'md', className }: ToggleProps) {
  const { track, thumb, xOff, xOn } = sizeConfig[size];

  return (
    <label className={cn('flex items-center gap-3 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange?.(!checked)}
        className={cn(
          'relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2',
          track,
          checked ? 'bg-blue-600' : 'bg-gray-300'
        )}
        disabled={disabled}
      >
        <motion.span
          className={cn('inline-block bg-white rounded-full shadow-sm', thumb)}
          animate={{ x: checked ? xOn : xOff }}
          transition={motionTokens.spring.snappy}
          style={{ originX: 0 }}
        />
      </button>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
    </label>
  );
}


