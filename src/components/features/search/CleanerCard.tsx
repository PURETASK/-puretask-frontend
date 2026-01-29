'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Rating } from '@/components/ui/Rating';
interface CleanerCardProps {
  id: string;
  name: string;
  rating: number;
  reviews_count?: number;
  reviewCount?: number;
  price_per_hour?: number;
  hourlyRate?: number;
  experience_years?: number;
  yearsExperience?: number;
  bio?: string;
  description?: string;
  availability: string;
  imageUrl?: string;
  image?: string;
  verified?: boolean;
  background_checked?: boolean;
  services?: string[];
  location?: string;
  distance_miles?: number;
  badges?: string[];
}

export function CleanerCard({
  id,
  name,
  rating,
  reviews_count,
  reviewCount,
  price_per_hour,
  hourlyRate,
  experience_years,
  yearsExperience,
  bio,
  description,
  availability,
  imageUrl,
  image,
  verified,
  background_checked,
  services = [],
  location,
  distance_miles,
  badges = [],
}: CleanerCardProps) {
  // Normalize props (support both old and new format)
  const finalReviewCount = reviews_count ?? reviewCount ?? 0;
  const finalHourlyRate = price_per_hour ?? hourlyRate ?? 0;
  const finalExperience = experience_years ?? yearsExperience ?? 0;
  const finalBio = bio || description || '';
  const finalImage = imageUrl || image;
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar
              src={finalImage}
              alt={name}
              size="lg"
              fallback={name.charAt(0)}
            />
            {(verified || background_checked) && (
              <div className="flex gap-1 mt-2 justify-center">
                {verified && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                    ✓ Verified
                  </span>
                )}
                {background_checked && (
                  <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                    ✓ Background Checked
                  </span>
                )}
              </div>
            )}
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-gray-900 truncate">{name}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Rating value={rating} readonly size="sm" />
                  <span className="text-sm text-gray-600">
                    {rating.toFixed(1)} ({finalReviewCount} reviews)
                  </span>
                  {distance_miles !== undefined && (
                    <span className="text-sm text-gray-500">
                      📍 {distance_miles.toFixed(1)} miles away
                    </span>
                  )}
                </div>
              </div>
              <button
                className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Add to favorites
                }}
                aria-label="Add to favorites"
                title="Add to favorites"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 flex-wrap">
              <span className="font-semibold text-blue-600 text-lg">
                ${finalHourlyRate}/hr
              </span>
              {finalExperience > 0 && (
                <span>{finalExperience} years exp</span>
              )}
              {location && (
                <span className="text-gray-500">📍 {location}</span>
              )}
            </div>
            {finalBio && (
              <p className="text-gray-700 mb-3 line-clamp-2">{finalBio}</p>
            )}
            {services.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {services.slice(0, 3).map((service, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {service.replace('_', ' ')}
                  </Badge>
                ))}
                {services.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{services.length - 3} more
                  </Badge>
                )}
              </div>
            )}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {badges.map((badge, idx) => (
                  <Badge key={idx} variant="secondary">
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-sm text-green-600 font-medium">
                {availability || 'Available'}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = `/cleaner/${id}`)}
                >
                  View Profile
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => (window.location.href = `/booking?cleaner=${id}`)}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
