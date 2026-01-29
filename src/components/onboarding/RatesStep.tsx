// src/components/onboarding/RatesStep.tsx
// Step 9: Rates

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface RatesStepProps {
  onNext: (data: { hourly_rate_credits: number; travel_radius_km: number }) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

// Assuming 1 credit = $0.10, so $20 = 200 credits, $100 = 1000 credits
const MIN_RATE_CREDITS = 200; // $20
const MAX_RATE_CREDITS = 1000; // $100

export function RatesStep({ onNext, onBack, isLoading }: RatesStepProps) {
  const [hourlyRateDollars, setHourlyRateDollars] = useState(25);
  const [travelRadius, setTravelRadius] = useState(25);

  // Convert dollars to credits (1 credit = $0.10)
  const hourlyRateCredits = hourlyRateDollars * 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hourlyRateCredits >= MIN_RATE_CREDITS && hourlyRateCredits <= MAX_RATE_CREDITS) {
      onNext({
        hourly_rate_credits: hourlyRateCredits,
        travel_radius_km: travelRadius,
      });
    }
  };

  const canContinue =
    hourlyRateCredits >= MIN_RATE_CREDITS &&
    hourlyRateCredits <= MAX_RATE_CREDITS &&
    travelRadius >= 5 &&
    travelRadius <= 50;

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Set your rates</h2>
          <p className="text-gray-600">
            Set your hourly rate and travel radius. You can adjust these later in your settings.
          </p>
        </div>

        {/* Hourly rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hourly Rate <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">$</span>
            <Input
              type="number"
              min={20}
              max={100}
              value={hourlyRateDollars}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 20 && value <= 100) {
                  setHourlyRateDollars(value);
                }
              }}
              className="flex-1"
              required
            />
            <span className="text-gray-500">/ hour</span>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Rate must be between $20 and $100 per hour
          </p>
          {hourlyRateCredits < MIN_RATE_CREDITS && (
            <p className="mt-1 text-sm text-red-600">
              Minimum rate is $20/hour
            </p>
          )}
          {hourlyRateCredits > MAX_RATE_CREDITS && (
            <p className="mt-1 text-sm text-red-600">
              Maximum rate is $100/hour
            </p>
          )}
        </div>

        {/* Travel radius */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Travel Radius: {travelRadius} km
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={travelRadius}
            onChange={(e) => setTravelRadius(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>5 km</span>
            <span>50 km</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Maximum distance you're willing to travel from your service areas.
          </p>
        </div>

        {/* Info box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-900">
            <strong>Note:</strong> Your rate is what clients pay. You'll receive 80-85% of the booking
            amount (depending on your tier) after platform fees.
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
