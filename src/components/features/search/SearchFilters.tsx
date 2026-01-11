'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export function SearchFilters() {
  const [filters, setFilters] = useState({
    zipCode: '10001',
    service: ['standard'],
    rating: 4,
    priceMin: 30,
    priceMax: 80,
    availability: ['today'],
    features: [] as string[],
  });

  return (
    <Card className="h-fit sticky top-4">
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-4 text-gray-900">Filters</h3>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <Input
            type="text"
            value={filters.zipCode}
            onChange={(e) => setFilters({ ...filters, zipCode: e.target.value })}
            placeholder="ZIP code"
          />
        </div>

        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Type
          </label>
          <div className="space-y-2">
            {['standard', 'deep', 'move', 'commercial'].map((service) => (
              <label key={service} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.service.includes(service)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({ ...filters, service: [...filters.service, service] });
                    } else {
                      setFilters({ ...filters, service: filters.service.filter(s => s !== service) });
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 capitalize">{service} Cleaning</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Rating
          </label>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-xl">{'⭐'.repeat(filters.rating)}</span>
            <span className="text-sm text-gray-600">{filters.rating}+</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={filters.rating}
            onChange={(e) => setFilters({ ...filters, rating: parseInt(e.target.value) })}
            className="w-full mt-2"
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>${filters.priceMin}</span>
            <span>-</span>
            <span>${filters.priceMax}</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={filters.priceMax}
            onChange={(e) => setFilters({ ...filters, priceMax: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Availability
          </label>
          <div className="space-y-2">
            {['today', 'thisWeek', 'flexible'].map((avail) => (
              <label key={avail} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.availability.includes(avail)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({ ...filters, availability: [...filters.availability, avail] });
                    } else {
                      setFilters({ ...filters, availability: filters.availability.filter(a => a !== avail) });
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {avail === 'thisWeek' ? 'This Week' : avail}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Features
          </label>
          <div className="space-y-2">
            {['instant', 'petFriendly', 'topRated', 'insured'].map((feature) => (
              <label key={feature} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.features.includes(feature)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({ ...filters, features: [...filters.features, feature] });
                    } else {
                      setFilters({ ...filters, features: filters.features.filter(f => f !== feature) });
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">
                  {feature === 'petFriendly' ? 'Pet Friendly' : 
                   feature === 'topRated' ? 'Top Rated' : 
                   feature === 'instant' ? 'Instant Book' : 'Insured'}
                </span>
              </label>
            ))}
          </div>
        </div>

        <Button variant="outline" className="w-full">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}
