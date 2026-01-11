'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Rating } from '@/components/ui/Rating';

export default function CleanerProfilePage() {
  const cleaner = {
    id: '1',
    name: 'Jane Doe',
    rating: 4.9,
    reviewCount: 47,
    hourlyRate: 45,
    minHours: 3,
    yearsExperience: 5,
    completedJobs: 156,
    responseTime: '< 1 hour',
    bio: 'Professional and reliable cleaner with 5 years of experience. I specialize in deep cleaning and pay attention to every detail. Your home deserves the best care!',
    services: ['Standard Cleaning', 'Deep Cleaning', 'Move In/Out', 'Post-Construction'],
    availability: {
      monday: '9AM - 5PM',
      tuesday: '9AM - 5PM',
      wednesday: '9AM - 5PM',
      thursday: '9AM - 5PM',
      friday: '9AM - 5PM',
      saturday: 'Available',
      sunday: 'Not Available',
    },
  };

  const reviews = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      date: 'Jan 5, 2026',
      text: 'Jane did an amazing job! My apartment has never looked better. Very professional and thorough.',
    },
    {
      name: 'Mike Chen',
      rating: 5,
      date: 'Dec 28, 2025',
      text: 'Highly recommend! Arrived on time, very friendly, and the quality of work exceeded my expectations.',
    },
    {
      name: 'Emily Davis',
      rating: 4,
      date: 'Dec 20, 2025',
      text: 'Great service overall. Very detail-oriented. Will book again!',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            ← Back to Search
          </Button>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <Avatar
                      alt={cleaner.name}
                      size="xl"
                      fallback={cleaner.name.charAt(0)}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h1 className="text-3xl font-bold text-gray-900">{cleaner.name}</h1>
                          <div className="flex items-center gap-2 mt-2">
                            <Rating value={cleaner.rating} readonly />
                            <span className="font-semibold text-gray-900">
                              {cleaner.rating.toFixed(1)}
                            </span>
                            <span className="text-gray-600">({cleaner.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge variant="success">✓ Insured</Badge>
                        <Badge variant="success">✓ Background Checked</Badge>
                        <Badge variant="primary">Top Rated</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{cleaner.bio}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{cleaner.yearsExperience}</div>
                      <div className="text-sm text-gray-600">Years Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{cleaner.completedJobs}</div>
                      <div className="text-sm text-gray-600">Jobs Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{cleaner.rating}</div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{cleaner.responseTime}</div>
                      <div className="text-sm text-gray-600">Response Time</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {cleaner.services.map((service, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg"
                      >
                        <span className="text-blue-600">✓</span>
                        <span className="font-medium text-gray-900">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Reviews ({cleaner.reviewCount})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviews.map((review, idx) => (
                    <div key={idx} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar
                            alt={review.name}
                            size="sm"
                            fallback={review.name.charAt(0)}
                          />
                          <div>
                            <div className="font-semibold text-gray-900">{review.name}</div>
                            <div className="text-sm text-gray-600">{review.date}</div>
                          </div>
                        </div>
                        <Rating value={review.rating} readonly size="sm" />
                      </div>
                      <p className="text-gray-700">{review.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-blue-600 mb-1">
                      ${cleaner.hourlyRate}
                      <span className="text-lg text-gray-600">/hr</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {cleaner.minHours} hour minimum
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full mb-3"
                    onClick={() => window.location.href = `/booking?cleaner=${cleaner.id}`}
                  >
                    Book Now
                  </Button>

                  <Button variant="outline" size="lg" className="w-full mb-6">
                    Send Message
                  </Button>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Availability</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(cleaner.availability).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="text-gray-600 capitalize">{day}:</span>
                          <span className="font-medium text-gray-900">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

