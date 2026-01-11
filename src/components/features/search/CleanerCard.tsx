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
  reviewCount: number;
  hourlyRate: number;
  yearsExperience: number;
  bio: string;
  availability: string;
  image?: string;
  badges?: string[];
}
export function CleanerCard({
  id,
  name,
  rating,
  reviewCount,
  hourlyRate,
  yearsExperience,
  bio,
  availability,
  image,
  badges = [],
}: CleanerCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Avatar */}
          <Avatar
            src={image}
            alt={name}
            size="lg"
            fallback={name.charAt(0)}
          />
          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Rating value={rating} readonly size="sm" />
                  <span className="text-sm text-gray-600">
                    {rating.toFixed(1)} ({reviewCount})
                  </span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
              <span className="font-semibold text-blue-600 text-lg">
                /hr
              </span>
              <span>???</span>
              <span>{yearsExperience} years exp</span>
            </div>
            <p className="text-gray-700 mb-3 line-clamp-2">{bio}</p>
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {badges.map((badge, idx) => (
                  <Badge key={idx} variant="secondary">
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600 font-medium">
                Available: {availability}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `/cleaner/${id}`}
                >
                  View Profile
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.location.href = `/booking?cleaner=${id}`}
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
