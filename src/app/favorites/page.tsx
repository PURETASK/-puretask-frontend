'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Heart, Star, MapPin, Calendar, Trash2 } from 'lucide-react';

export default function FavoritesPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <FavoritesContent />
    </ProtectedRoute>
  );
}

function FavoritesContent() {
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - would come from API
  const favorites = [
    {
      id: '1',
      cleanerId: 'cleaner-1',
      name: 'Jane Doe',
      rating: 4.9,
      reviews: 127,
      pricePerHour: 35,
      experience: 5,
      avatar: null,
      specialties: ['Deep Cleaning', 'Eco-Friendly'],
      location: 'Manhattan, NY',
      lastBooked: '2025-12-15',
      totalBookings: 8,
    },
    {
      id: '2',
      cleanerId: 'cleaner-2',
      name: 'John Smith',
      rating: 4.8,
      reviews: 95,
      pricePerHour: 32,
      experience: 3,
      avatar: null,
      specialties: ['Standard Cleaning', 'Move In/Out'],
      location: 'Brooklyn, NY',
      lastBooked: '2025-11-28',
      totalBookings: 5,
    },
  ];

  const handleRemoveFavorite = (id: string) => {
    if (confirm('Remove this cleaner from your favorites?')) {
      console.log('Remove favorite:', id);
      // Would call API here
    }
  };

  const handleBookNow = (cleanerId: string) => {
    window.location.href = `/booking?cleaner=${cleanerId}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Favorite Cleaners
            </h1>
            <p className="text-gray-600">
              Quick access to your trusted cleaning professionals
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Favorites</p>
                    <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {favorites.reduce((sum, f) => sum + f.totalBookings, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(
                        favorites.reduce((sum, f) => sum + f.rating, 0) / favorites.length
                      ).toFixed(1)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Favorites List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loading />
            </div>
          ) : favorites.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No favorites yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start adding cleaners to your favorites for quick access
                </p>
                <Button
                  variant="primary"
                  onClick={() => (window.location.href = '/search')}
                >
                  Find Cleaners
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {favorites.map((favorite) => (
                <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Avatar */}
                      <Avatar
                        src={favorite.avatar}
                        fallback={favorite.name[0]}
                        size="lg"
                        className="flex-shrink-0"
                      />

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {favorite.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="font-medium">{favorite.rating}</span>
                                <span>({favorite.reviews} reviews)</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{favorite.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              ${favorite.pricePerHour}
                            </p>
                            <p className="text-sm text-gray-600">per hour</p>
                          </div>
                        </div>

                        {/* Specialties */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {favorite.specialties.map((specialty, index) => (
                            <Badge key={index} variant="default">
                              {specialty}
                            </Badge>
                          ))}
                          <Badge variant="primary">{favorite.experience}+ years exp</Badge>
                        </div>

                        {/* Booking Info */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              Last booked:{' '}
                              <span className="font-medium text-gray-900">
                                {new Date(favorite.lastBooked).toLocaleDateString()}
                              </span>
                            </span>
                            <span className="text-gray-600">
                              Total bookings:{' '}
                              <span className="font-medium text-gray-900">
                                {favorite.totalBookings}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          <Button
                            variant="primary"
                            onClick={() => handleBookNow(favorite.cleanerId)}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Book Again
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              (window.location.href = `/cleaners/${favorite.cleanerId}`)
                            }
                          >
                            View Profile
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleRemoveFavorite(favorite.id)}
                            className="text-red-600 hover:text-red-700 ml-auto"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
