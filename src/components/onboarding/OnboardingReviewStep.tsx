// src/components/onboarding/OnboardingReviewStep.tsx
// Step 10: Review & Complete

'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

interface OnboardingReviewStepProps {
  onComplete: () => void;
  onBack?: () => void;
  isLoading?: boolean;
  completedData?: {
    serviceAreasCount: number;
    availableDays: number;
  };
  progressData?: {
    steps: {
      agreements: boolean;
      basic_info: boolean;
      phone_verified: boolean;
      profile_photo: boolean;
      id_verification: boolean;
      background_check: boolean;
      service_areas: boolean;
      availability: boolean;
      rates: boolean;
    };
  };
}

export function OnboardingReviewStep({
  onComplete,
  onBack,
  isLoading,
  completedData,
  progressData,
}: OnboardingReviewStepProps) {
  const steps = progressData?.steps ?? {} as {
    agreements?: boolean;
    basic_info?: boolean;
    phone_verified?: boolean;
    profile_photo?: boolean;
    id_verification?: boolean;
    background_check?: boolean;
    service_areas?: boolean;
    availability?: boolean;
    rates?: boolean;
  };

  const checklist = [
    { label: 'Terms & Agreements', completed: steps.agreements },
    { label: 'Basic Information', completed: steps.basic_info },
    { label: 'Phone Verification', completed: steps.phone_verified },
    { label: 'Profile Photo', completed: steps.profile_photo },
    { label: 'ID Verification', completed: steps.id_verification },
    { label: 'Background Check Consent', completed: steps.background_check },
    { label: 'Service Areas', completed: steps.service_areas },
    { label: 'Availability', completed: steps.availability },
    { label: 'Rates', completed: steps.rates },
  ];

  const allCompleted = checklist.every((item) => item.completed);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Complete</h2>
        <p className="text-gray-600">
          Review your information below. Once you activate your profile, you'll be able to receive job offers!
        </p>
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 mb-3">Completed Steps</h3>
        {checklist.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              item.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                item.completed ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              {item.completed ? (
                <span className="text-white text-sm">✓</span>
              ) : (
                <span className="text-gray-500 text-sm">○</span>
              )}
            </div>
            <span
              className={`flex-1 ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Summary info */}
      {completedData && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-900 space-y-1">
            <div>
              <strong>Service Areas:</strong> {completedData.serviceAreasCount} zip code(s)
            </div>
            <div>
              <strong>Available Days:</strong> {completedData.availableDays} day(s) per week
            </div>
          </div>
        </div>
      )}

      {/* Activation notice */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="text-sm text-yellow-900">
          <strong>What happens next?</strong>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Your profile will be activated immediately</li>
            <li>You'll be able to receive job offers from clients</li>
            <li>Your background check will be processed (1-3 business days)</li>
            <li>Your ID verification will be reviewed by our team</li>
          </ul>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
            ← Back
          </Button>
        )}
        <Button
          type="button"
          variant="primary"
          className="flex-1"
          onClick={onComplete}
          disabled={!allCompleted || isLoading}
        >
          {isLoading ? 'Activating...' : 'Activate Profile →'}
        </Button>
      </div>
    </div>
  );
}
