// src/components/onboarding/TermsAgreementStep.tsx
// Step 1: Terms & Agreements

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface TermsAgreementStepProps {
  onNext: (data: { terms_of_service: boolean; independent_contractor: boolean }) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export function TermsAgreementStep({ onNext, onBack, isLoading }: TermsAgreementStepProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [contractorAccepted, setContractorAccepted] = useState(false);

  const canContinue = termsAccepted && contractorAccepted;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canContinue) {
      onNext({
        terms_of_service: termsAccepted,
        independent_contractor: contractorAccepted,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Terms & Agreements</h2>
          <p className="text-gray-600">
            Please review and accept the following agreements to continue.
          </p>
        </div>

        {/* Terms of Service */}
        <label className="flex items-start gap-3 rounded-lg border-2 border-gray-200 bg-white p-4 cursor-pointer hover:border-blue-300 transition-colors">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            required
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900 mb-1">
              Terms of Service
            </div>
            <div className="text-sm text-gray-600">
              I have read and agree to the{' '}
              <a href="/terms" target="_blank" className="text-blue-600 hover:underline">
                Terms of Service
              </a>
              . I understand my rights and responsibilities as a cleaner on the platform.
            </div>
          </div>
        </label>

        {/* Independent Contractor Agreement */}
        <label className="flex items-start gap-3 rounded-lg border-2 border-gray-200 bg-white p-4 cursor-pointer hover:border-blue-300 transition-colors">
          <input
            type="checkbox"
            checked={contractorAccepted}
            onChange={(e) => setContractorAccepted(e.target.checked)}
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            required
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900 mb-1">
              Independent Contractor Agreement
            </div>
            <div className="text-sm text-gray-600">
              I acknowledge that I am an independent contractor, not an employee. I understand that I am
              responsible for my own taxes, insurance, and business expenses.{' '}
              <a href="/contractor-agreement" target="_blank" className="text-blue-600 hover:underline">
                View full agreement
              </a>
              .
            </div>
          </div>
        </label>

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
