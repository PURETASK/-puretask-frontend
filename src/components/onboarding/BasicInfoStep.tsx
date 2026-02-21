// src/components/onboarding/BasicInfoStep.tsx
// Step 2: Basic Info

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface BasicInfoStepProps {
  onNext: (data: {
    first_name: string;
    last_name: string;
    bio: string;
    professional_headline?: string;
  }) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export function BasicInfoStep({ onNext, onBack, isLoading }: BasicInfoStepProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [headline, setHeadline] = useState('');

  const canContinue =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    bio.trim().length >= 20;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canContinue) {
      onNext({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        bio: bio.trim(),
        professional_headline: headline.trim() || undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
          <p className="text-gray-600">
            This information will be visible to clients. Make it professional and engaging.
          </p>
        </div>

        {/* Name fields */}
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="First Name"
            fieldType="name"
            placeholder="Jane"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
          />
          <Input
            label="Last Name"
            fieldType="name"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            autoComplete="family-name"
          />
        </div>

        {/* Professional headline */}
        <Input
          label="Professional Headline (Optional)"
          fieldType="text"
          placeholder="e.g., Experienced House Cleaner | 5+ Years"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          helperText="A short tagline that appears on your profile"
        />

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-base min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tell clients about your experience, specialties, and what makes you great at cleaning..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            minLength={20}
          />
          <div className="mt-1 text-xs text-gray-500">
            {bio.length}/20 characters minimum ({bio.length < 20 ? `${20 - bio.length} more needed` : '✓'})
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
