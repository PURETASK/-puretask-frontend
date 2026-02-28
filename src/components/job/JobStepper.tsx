'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export type StepKey = 'enroute' | 'checkin' | 'before' | 'clean' | 'after' | 'submit';

export function JobStepper({
  active,
  onSetActive,
  onPrimary,
  submitDisabled,
  guardrailMessage,
}: {
  active: StepKey;
  onSetActive: (k: StepKey) => void;
  onPrimary?: () => void;
  /** When true, primary action is disabled (e.g. submit without before+after) */
  submitDisabled?: boolean;
  /** Shown in current step area when set (e.g. "Upload before and after photos first") */
  guardrailMessage?: string | null;
}) {
  const steps: Array<{ key: StepKey; label: string; hint: string }> = [
    { key: 'enroute', label: 'Send En Route', hint: 'Notify client + unlock check-in' },
    { key: 'checkin', label: 'Arrive + Check In', hint: 'GPS verifies arrival' },
    { key: 'before', label: 'Before Photos', hint: 'Minimum 1 photo' },
    { key: 'clean', label: 'Clean (Timer)', hint: 'Work time tracked' },
    { key: 'after', label: 'After Photos', hint: 'Minimum 1 photo' },
    { key: 'submit', label: 'Submit', hint: 'Client reviews + approves' },
  ];

  const idx = steps.findIndex((s) => s.key === active);
  const pct = Math.round(((idx + 1) / steps.length) * 100);

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Job Progress</div>
          <div className="text-xs opacity-70">
            Step {idx + 1} of {steps.length}
          </div>
        </div>
        <Badge
          className="rounded-full"
          style={{ background: 'rgba(0,212,255,0.12)', color: '#1D2533' }}
        >
          Live
        </Badge>
      </div>

      <div className="mt-4">
        <Progress value={pct} />
      </div>

      <div className="mt-4 grid gap-2">
        {steps.map((s, i) => {
          const done = i < idx;
          const isActive = s.key === active;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onSetActive(s.key)}
              className={cn(
                'w-full rounded-3xl border bg-white p-4 text-left shadow-sm transition',
                isActive && 'border-transparent',
                done && 'opacity-90'
              )}
              style={
                isActive
                  ? {
                      backgroundImage: 'linear-gradient(90deg,#0078FF,#00D4FF)',
                      color: 'white',
                    }
                  : undefined
              }
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{s.label}</div>
                  <div
                    className={cn('text-xs', isActive ? 'opacity-90' : 'opacity-70')}
                  >
                    {s.hint}
                  </div>
                </div>
                <div className="text-xs">{done ? 'Done' : isActive ? 'Now' : ''}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="rounded-3xl bg-slate-50 p-4"
          >
            <div className="text-sm font-semibold">Current step</div>
            <div className="text-xs opacity-70">{steps[idx]?.hint}</div>
            {guardrailMessage && (
              <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
                {guardrailMessage}
              </div>
            )}
            {onPrimary && (
              <div className="mt-3">
                <Button
                  className="rounded-full"
                  onClick={onPrimary}
                  disabled={submitDisabled}
                >
                  Primary action
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
