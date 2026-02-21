'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchFilters } from '@/components/features/search/SearchFilters';
import { CleanerCard } from '@/components/features/search/CleanerCard';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete';
import { useCleanerSearch } from '@/hooks/useCleaners';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SkeletonList } from '@/components/ui/Skeleton';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';
import { EmptyCleaners } from '@/components/ui/EmptyState';
import { CleanerSearchParams } from '@/services/cleaner.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientEnhancedService } from '@/services/clientEnhanced.service';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Save, Map, List } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { LazyComponent } from '@/components/ui/LazyComponent';

export default function SearchPage() {
  const [filters, setFilters] = useState<CleanerSearchParams>({
    page: 1,
    per_page: 12,
    sort_by: 'rating',
  });
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showSaveSearch, setShowSaveSearch] = useState(false);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useCleanerSearch(filters);
  const { data: savedSearchesData } = useQuery({
    queryKey: ['client', 'saved-searches'],
    queryFn: async () => {
      const res = await clientEnhancedService.getSavedSearches();
      return (res ?? {}) as { savedSearches?: unknown[] };
    },
  });

  const { mutate: saveSearch } = useMutation({
    mutationFn: ({ name, filters }: { name: string; filters: any }) =>
      clientEnhancedService.saveSearch(name, filters),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', 'saved-searches'] });
      showToast('Search saved', 'success');
      setShowSaveSearch(false);
    },
  });

  const handleFilterChange = (newFilters: Partial<CleanerSearchParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page on filter change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with Global Search */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Find Your Perfect Cleaner
                </h1>
                <p className="text-gray-600">
                  {data?.pagination.total || 0} professional cleaners available in your area
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveSearch(true)}
                  className="flex items-center gap-2"
                  aria-label="Save current search"
                >
                  <Save className="h-4 w-4" />
                  Save Search
                </Button>
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-r-none"
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'map' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                    className="rounded-l-none"
                    aria-label="Map view"
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Global Search */}
            <div className="mb-4">
              <GlobalSearch />
            </div>

            {/* Saved Searches */}
            {savedSearchesData?.savedSearches && savedSearchesData.savedSearches.length > 0 && (
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {savedSearchesData.savedSearches.map((search: any) => (
                  <Button
                    key={search.id}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilters(search.filters);
                    }}
                    className="flex-shrink-0"
                  >
                    {search.name}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <SearchFilters
                currentFilters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Loading State */}
              {isLoading && (
                <div className="grid gap-4">
                  <SkeletonList items={6} />
                </div>
              )}

              {/* Error State */}
              {error && (
                <ErrorDisplay
                  error={error}
                  onRetry={() => window.location.reload()}
                  variant="card"
                  title="Failed to load cleaners"
                />
              )}

              {/* Results */}
              {!isLoading && !error && data && (
                <>
                  {data.data.length > 0 ? (
                    <div className="grid gap-4">
                      {data.data.map((cleaner: any) => (
                        <LazyComponent key={cleaner.id} fallback={<div className="h-32 bg-gray-100 animate-pulse rounded" />}>
                          <CleanerCard
                            id={cleaner.id}
                            name={cleaner.full_name || cleaner.name}
                            rating={cleaner.rating || 0}
                            reviews_count={cleaner.reviews || cleaner.reviewCount}
                            price_per_hour={cleaner.price_per_hour || cleaner.hourlyRate}
                            experience_years={cleaner.experience_years || cleaner.yearsExperience}
                            bio={cleaner.bio || cleaner.description}
                            availability={cleaner.availability || 'Available'}
                            imageUrl={cleaner.avatar_url || cleaner.imageUrl}
                            verified={cleaner.verified}
                            background_checked={cleaner.background_checked}
                            services={cleaner.services || []}
                            distance_miles={cleaner.distance_miles}
                          />
                        </LazyComponent>
                      ))}
                    </div>
                  ) : (
                    <EmptyCleaners />
                  )}

                  {/* Pagination */}
                  {data.pagination && data.pagination.total_pages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(data.pagination.page - 1)}
                        disabled={data.pagination.page === 1}
                        aria-label="Previous page"
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {data.pagination.page} of {data.pagination.total_pages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(data.pagination.page + 1)}
                        disabled={data.pagination.page === data.pagination.total_pages}
                        aria-label="Next page"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
