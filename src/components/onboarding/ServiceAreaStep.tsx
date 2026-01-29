// src/components/onboarding/ServiceAreaStep.tsx
// Step 7: Service Areas

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ServiceAreaStepProps {
  onNext: (data: { zip_codes: string[]; travel_radius_km: number }) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export function ServiceAreaStep({ onNext, onBack, isLoading }: ServiceAreaStepProps) {
  const [zipCode, setZipCode] = useState('');
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [travelRadius, setTravelRadius] = useState(25);

  const handleAddZip = (e: React.FormEvent) => {
    e.preventDefault();
    const zip = zipCode.replace(/\D/g, '').slice(0, 5);
    
    if (zip.length === 5 && !zipCodes.includes(zip)) {
      setZipCodes([...zipCodes, zip]);
      setZipCode('');
    }
  };

  const handleRemoveZip = (zipToRemove: string) => {
    setZipCodes(zipCodes.filter((z) => z !== zipToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCodes.length > 0) {
      onNext({
        zip_codes: zipCodes,
        travel_radius_km: travelRadius,
      });
    }
  };

  const canContinue = zipCodes.length > 0;

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Areas</h2>
          <p className="text-gray-600">
            Add the zip codes where you're willing to work. Clients in these areas will be able to book you.
          </p>
        </div>

        {/* Add zip code */}
        <div>
          <form onSubmit={handleAddZip} className="flex gap-2">
            <Input
              label="Add Zip Code"
              fieldType="text"
              placeholder="12345"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              maxLength={5}
              className="flex-1"
            />
            <Button
              type="submit"
              variant="outline"
              className="mt-6"
              disabled={zipCode.length !== 5 || zipCodes.includes(zipCode)}
            >
              Add
            </Button>
          </form>
        </div>

        {/* Zip codes list */}
        {zipCodes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Areas ({zipCodes.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {zipCodes.map((zip) => (
                <div
                  key={zip}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  <span>{zip}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveZip(zip)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
            This is the maximum distance you're willing to travel from your service areas.
          </p>
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
