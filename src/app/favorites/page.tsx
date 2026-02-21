'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Loading } from '@/components/ui/Loading';
import { SkeletonList } from '@/components/ui/Skeleton';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';
import { EmptyFavorites } from '@/components/ui/EmptyState';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Heart, Star, MapPin, Calendar, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesService } from '@/services/favorites.service';
import { clientEnhancedService } from '@/services/clientEnhanced.service';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';

export default function FavoritesPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <FavoritesContent />
    </ProtectedRoute>
  );
}

function FavoritesContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data: favoritesData, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesService.getFavorites(),
  });

  // Get recommendations
  const { data: recommendationsData } = useQuery({
    queryKey: ['favorites', 'recommendations'],
    queryFn: async () => {
      try {
        const res = await clientEnhancedService.getFavoriteRecommendations();
        return (res ?? {}) as { recommendations?: unknown[] };
      } catch {
        return { recommendations: [] };
      }
    },
  });

  // Get insights
  const { data: insightsData } = useQuery({
    queryKey: ['favorites', 'insights'],
    queryFn: async () => {
      try {
        const res = await clientEnhancedService.getFavoriteInsights();
        return (res ?? {}) as { insights?: { most_booked?: { name?: string; count?: number }; total_bookings?: number; average_rating?: number } };
      } catch {
        return { insights: {} };
      }
    },
  });

  const { mutate: removeFavorite } = useMutation({
    mutationFn: (favoriteId: string) => favoritesService.removeFavorite(favoriteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      showToast('Removed from favorites', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.error?.message || 'Failed to remove favorite', 'error');
    },
  });

  const favorites = favoritesData?.favorites || [];

  const handleRemoveFavorite = (id: string) => {
    if (confirm('Remove this cleaner from your favorites?')) {
      removeFavorite(id);
    }
  };

  const handleBookNow = (cleanerId: string) => {
    router.push(`/booking?cleaner=${cleanerId}`);
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

          {/* Insights */}
          {insightsData?.insights && Object.keys(insightsData.insights).length > 0 && (
            <Card className="mb-6 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-2">Your Favorite Insights</h3>
                    <div className="space-y-1 text-sm text-blue-700">
                      {insightsData.insights.most_booked && (
                        <p>• Your most booked cleaner: <strong>{insightsData.insights.most_booked.name}</strong> ({insightsData.insights.most_booked.count} times)</p>
                      )}
                      {insightsData.insights.total_bookings && (
                        <p>• Total bookings with favorites: <strong>{insightsData.insights.total_bookings}</strong></p>
                      )}
                      {insightsData.insights.average_rating && (
                        <p>• Average rating given: <strong>{insightsData.insights.average_rating.toFixed(1)}</strong> ⭐</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {recommendationsData?.recommendations && recommendationsData.recommendations.length > 0 && (
            <Card className="mb-6 border-purple-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Cleaners similar to your favorites or top-rated in your area
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {recommendationsData.recommendations.slice(0, 4).map((rec: any) => (
                    <Card key={rec.id} className="border border-purple-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar
                            src={rec.avatar_url}
                            fallback={rec.name[0]}
                            size="md"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{rec.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-sm text-gray-600">{rec.rating.toFixed(1)}</span>
                              <Badge variant="info" className="text-xs">
                                {rec.reason}
                              </Badge>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => router.push(`/cleaner/${rec.id}`)}
                            >
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
                      {insightsData?.insights?.total_bookings || '-'}
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
                      {favorites.length > 0
                        ? (
                            favorites.reduce((sum, f) => sum + f.cleaner.rating, 0) /
                            favorites.length
                          ).toFixed(1)
                        : '0.0'}
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
              {favorites.map((favorite) => {
                const cleaner = favorite.cleaner;
                return (
                  <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        {/* Avatar */}
                        <Avatar
                          src={cleaner.avatar_url}
                          fallback={cleaner.name[0]}
                          size="lg"
                        />

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                {cleaner.name}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  <span className="font-medium">{cleaner.rating.toFixed(1)}</span>
                                  <span>({cleaner.reviews_count || 0} reviews)</span>
                                </div>
                                {(cleaner as { last_booking_date?: string }).last_booking_date && (
                                  <div className="flex items-center gap-1 text-gray-500">
                                    <Clock className="h-3 w-3" />
                                    <span>Last booked {new Date((cleaner as { last_booking_date?: string }).last_booking_date ?? '').toLocaleDateString()}</span>
                                  </div>
                                )}
                                {((cleaner as { total_bookings?: number }).total_bookings ?? 0) > 0 && (
                                  <Badge variant="success" className="text-xs">
                                    {(cleaner as { total_bookings?: number }).total_bookings} bookings
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">
                                ${cleaner.price_per_hour}
                              </p>
                              <p className="text-sm text-gray-600">per hour</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-3">
                            <Button
                              variant="primary"
                              onClick={() => handleBookNow(cleaner.id)}
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              Book Now
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => router.push(`/cleaner/${cleaner.id}`)}
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
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
