'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { AppointmentState } from '@/types/appointment';
import { Check } from 'lucide-react';

const STATES: AppointmentState[] = [
  'scheduled',
  'en_route',
  'arrived',
  'checked_in',
  'completed',
];

const LABELS: Record<AppointmentState, string> = {
  scheduled: 'Scheduled',
  en_route: 'En route',
  arrived: 'Arrived',
  checked_in: 'Checked in',
  completed: 'Completed',
};

interface AppointmentStatusStepperProps {
  currentState: AppointmentState;
  stateTimestamps?: Partial<Record<AppointmentState, string>>;
  etaISO?: string;
}

export function AppointmentStatusStepper({
  currentState,
  stateTimestamps,
  etaISO,
}: AppointmentStatusStepperProps) {
  const currentIndex = STATES.indexOf(currentState);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 font-semibold text-gray-900">Status</h3>
      <div className="flex items-center justify-between gap-2">
        {STATES.map((state, i) => {
          const isActive = i <= currentIndex;
          const isCurrent = state === currentState;
          const timestamp = stateTimestamps?.[state];

          return (
            <React.Fragment key={state}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                    isActive ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-gray-50'
                  )}
                >
                  {i < currentIndex ? <Check className="h-5 w-5" /> : i + 1}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium',
                    isCurrent ? 'text-blue-600' : 'text-gray-500'
                  )}
                >
                  {LABELS[state]}
                </span>
                {timestamp && (
                  <span className="mt-1 text-xs text-gray-400">
                    {format(new Date(timestamp), 'h:mm a')}
                  </span>
                )}
              </div>
              {i < STATES.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1',
                    i < currentIndex ? 'bg-blue-600' : 'bg-gray-200'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {etaISO && currentState === 'en_route' && (
        <p className="mt-4 text-sm text-blue-600">
          ETA: {format(new Date(etaISO), 'h:mm a')}
        </p>
      )}
    </div>
  );
}
