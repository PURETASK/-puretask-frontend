// src/components/onboarding/BackgroundCheckConsentStep.tsx
// Step 6: Background Check Consent

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface BackgroundCheckConsentStepProps {
  onNext: (data: { fcra_consent: boolean; accuracy_consent: boolean }) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export function BackgroundCheckConsentStep({ onNext, onBack, isLoading }: BackgroundCheckConsentStepProps) {
  const [fcraConsent, setFcraConsent] = useState(false);
  const [accuracyConsent, setAccuracyConsent] = useState(false);

  const canContinue = fcraConsent && accuracyConsent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canContinue) {
      onNext({
        fcra_consent: fcraConsent,
        accuracy_consent: accuracyConsent,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Background Check Authorization</h2>
          <p className="text-gray-600">
            We conduct background checks to ensure the safety and trust of our platform. Please review and authorize below.
          </p>
        </div>

        {/* FCRA Consent */}
        <label className="flex items-start gap-3 rounded-lg border-2 border-gray-200 bg-white p-4 cursor-pointer hover:border-blue-300 transition-colors">
          <input
            type="checkbox"
            checked={fcraConsent}
            onChange={(e) => setFcraConsent(e.target.checked)}
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            required
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900 mb-1">
              Fair Credit Reporting Act (FCRA) Authorization
            </div>
            <div className="text-sm text-gray-600">
              I authorize PureTask and its designated background check provider to obtain consumer reports
              (background checks) about me for employment purposes. I understand that this authorization
              is required to work as a cleaner on the platform.{' '}
              <a href="/fcra-disclosure" target="_blank" className="text-blue-600 hover:underline">
                View FCRA disclosure
              </a>
              .
            </div>
          </div>
        </label>

        {/* Accuracy Consent */}
        <label className="flex items-start gap-3 rounded-lg border-2 border-gray-200 bg-white p-4 cursor-pointer hover:border-blue-300 transition-colors">
          <input
            type="checkbox"
            checked={accuracyConsent}
            onChange={(e) => setAccuracyConsent(e.target.checked)}
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            required
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900 mb-1">
              Information Accuracy
            </div>
            <div className="text-sm text-gray-600">
              I certify that all information I have provided is accurate and complete. I understand that
              providing false information may result in immediate termination and legal action.
            </div>
          </div>
        </label>

        {/* Information box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-900">
            <strong>What to expect:</strong>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Background check typically takes 1-3 business days</li>
              <li>You'll be notified once the check is complete</li>
              <li>You can view your status in your dashboard</li>
              <li>If there are any issues, our team will contact you</li>
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
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={!canContinue || isLoading}
          >
            {isLoading ? 'Saving...' : 'Continue →'}
          </Button>
        </div>
      </div>
    </form>
  );
}
