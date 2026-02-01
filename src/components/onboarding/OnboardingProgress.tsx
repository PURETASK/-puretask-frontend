// src/components/onboarding/OnboardingProgress.tsx
// Progress indicator component

'use client';

import React from 'react';
import { Progress } from '@/components/ui/Progress';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
}

const STEP_LABELS = [
  'Terms',
  'Basic Info',
  'Phone',
  'Photo',
  'ID',
  'Background',
  'Service Areas',
  'Availability',
  'Rates',
  'Review',
];

export function OnboardingProgress({ currentStep, totalSteps, progress }: OnboardingProgressProps) {
  return (
    <div className="mb-8">
      {/* Step indicators */}
      <div className="flex justify-between mb-4">
        {STEP_LABELS.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={stepNumber}
              className={`flex flex-col items-center flex-1 ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-2 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                } ${isCurrent ? 'ring-2 ring-blue-300 ring-offset-2' : ''}`}
              >
                {stepNumber}
              </div>
              <span className="text-xs font-medium text-center hidden sm:block">{label}</span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="relative">
        <Progress value={progress} className="h-2" />
        <div className="mt-2 text-sm text-gray-600 text-center">
          Step {currentStep} of {totalSteps} • {Math.round(progress)}% Complete
        </div>
      </div>
    </div>
  );
}
