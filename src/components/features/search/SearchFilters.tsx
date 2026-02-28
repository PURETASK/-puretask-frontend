'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { CleanerSearchParams } from '@/services/cleaner.service';

interface SearchFiltersProps {
  onFilterChange: (filters: Partial<CleanerSearchParams>) => void;
  currentFilters: CleanerSearchParams;
}

export function SearchFilters({ onFilterChange, currentFilters }: SearchFiltersProps) {
  const [localFilters, setLocalFilters] = useState({
    location: currentFilters.location || '',
    serviceType: currentFilters.service_type || '',
    minRating: currentFilters.min_rating || 0,
    minPrice: currentFilters.min_price || 0,
    maxPrice: currentFilters.max_price || 0,
    features: currentFilters.features || [] as string[],
  });

  // Update local filters when currentFilters change
  useEffect(() => {
    setLocalFilters({
      location: currentFilters.location || '',
      serviceType: currentFilters.service_type || '',
      minRating: currentFilters.min_rating || 0,
      minPrice: currentFilters.min_price || 0,
      maxPrice: currentFilters.max_price || 0,
      features: currentFilters.features || [],
    });
  }, [currentFilters]);

  const handleFilterUpdate = (updates: Partial<typeof localFilters>) => {
    const newFilters = { ...localFilters, ...updates };
    setLocalFilters(newFilters);
    
    // Convert to API format and notify parent
    onFilterChange({
      location: newFilters.location || undefined,
      service_type: newFilters.serviceType || undefined,
      min_rating: newFilters.minRating > 0 ? newFilters.minRating : undefined,
      min_price: newFilters.minPrice > 0 ? newFilters.minPrice : undefined,
      max_price: newFilters.maxPrice > 0 ? newFilters.maxPrice : undefined,
      features: newFilters.features.length > 0 ? newFilters.features : undefined,
    });
  };

  const handleReset = () => {
    const resetFilters = {
      location: '',
      serviceType: '',
      minRating: 0,
      minPrice: 0,
      maxPrice: 0,
      features: [],
    };
    setLocalFilters(resetFilters);
    onFilterChange({
      location: undefined,
      service_type: undefined,
      min_rating: undefined,
      min_price: undefined,
      max_price: undefined,
      features: undefined,
    });
  };

  return (
    <Card className="h-fit sticky top-4 rounded-2xl border-gray-200 shadow-sm overflow-hidden">
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, var(--brand-blue), var(--brand-aqua))' }} aria-hidden />
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-gray-600 hover:text-[var(--brand-blue)]">
            Reset
          </Button>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <Input
            type="text"
            value={localFilters.location}
            onChange={(e) => handleFilterUpdate({ location: e.target.value })}
            placeholder="ZIP code or city"
            className="mb-2"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Use browser geolocation
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  // In a real app, you'd reverse geocode this
                  // For now, just show a message
                  alert('Location detected! (Feature to be implemented)');
                });
              }
            }}
            className="text-xs text-blue-600"
          >
            📍 Use my location
          </Button>
        </div>

        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Type
          </label>
          <div className="space-y-2">
            {[
              { value: 'standard', label: 'Standard Cleaning' },
              { value: 'deep', label: 'Deep Clean' },
              { value: 'move_in_out', label: 'Move In/Out' },
              { value: 'airbnb', label: 'Airbnb Cleaning' },
            ].map((service) => (
              <label key={service.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.serviceType === service.value}
                  onChange={(e) =>
                    handleFilterUpdate({ serviceType: e.target.checked ? service.value : '' })
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">{service.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Rating
          </label>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-400 text-lg">
              {'⭐'.repeat(Math.floor(localFilters.minRating))}
            </span>
            <span className="text-sm text-gray-600">
              {localFilters.minRating > 0 ? `${localFilters.minRating}+` : 'Any'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={localFilters.minRating}
            onChange={(e) => handleFilterUpdate({ minRating: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Any</span>
            <span>4+</span>
            <span>4.5+</span>
            <span>5</span>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range (per hour)
          </label>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>${localFilters.minPrice || 0}</span>
            <span>-</span>
            <span>${localFilters.maxPrice || 200}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Input
              type="number"
              placeholder="Min"
              value={localFilters.minPrice || ''}
              onChange={(e) =>
                handleFilterUpdate({ minPrice: parseInt(e.target.value) || 0 })
              }
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Max"
              value={localFilters.maxPrice || ''}
              onChange={(e) =>
                handleFilterUpdate({ maxPrice: parseInt(e.target.value) || 0 })
              }
              className="text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFilterUpdate({ minPrice: 0, maxPrice: 50 })}
              className="text-xs"
            >
              Under $50
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFilterUpdate({ minPrice: 50, maxPrice: 100 })}
              className="text-xs"
            >
              $50-$100
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFilterUpdate({ minPrice: 100, maxPrice: 0 })}
              className="text-xs"
            >
              $100+
            </Button>
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Features
          </label>
          <div className="space-y-2">
            {[
              { value: 'verified', label: '✓ Verified' },
              { value: 'background_checked', label: '✓ Background Checked' },
              { value: 'insured', label: '✓ Insured' },
              { value: 'eco_friendly', label: '🌱 Eco-Friendly' },
              { value: 'pet_friendly', label: '🐾 Pet-Friendly' },
            ].map((feature) => (
              <label key={feature.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.features.includes(feature.value)}
                  onChange={(e) => {
                    const newFeatures = e.target.checked
                      ? [...localFilters.features, feature.value]
                      : localFilters.features.filter((f) => f !== feature.value);
                    handleFilterUpdate({ features: newFeatures });
                  }}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">{feature.label}</span>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
