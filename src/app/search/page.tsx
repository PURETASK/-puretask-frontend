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
import { usePageTitle } from '@/hooks/usePageTitle';

export default function SearchPage() {
  const [filters, setFilters] = useState<CleanerSearchParams>({
    page: 1,
    per_page: 12,
    sort_by: 'rating',
  });
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showSaveSearch, setShowSaveSearch] = useState(false);
  usePageTitle('Find a Cleaner');
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
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto section-wrap">
          {/* Page header with accent */}
          <div
            className="mb-8 rounded-2xl border border-[var(--brand-blue)]/20 px-6 py-5 shadow-sm"
            style={{ background: 'linear-gradient(135deg, rgba(0,120,255,0.06) 0%, rgba(0,212,255,0.03) 100%)' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  Find your cleaner
                </h1>
                <p className="text-gray-600 mt-1">
                  {data?.pagination?.total ?? 0} verified cleaners in your area · Book with protected payment
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveSearch(true)}
                  className="gap-2 border-[var(--brand-blue)]/40 text-[var(--brand-blue)] hover:bg-[var(--brand-cloud)]"
                  aria-label="Save current search"
                >
                  <Save className="h-4 w-4" />
                  Save search
                </Button>
                <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-[var(--brand-blue)] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    className={`p-2.5 transition-colors ${viewMode === 'map' ? 'bg-[var(--brand-blue)] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    aria-label="Map view"
                  >
                    <Map className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <GlobalSearch />
            </div>

            {savedSearchesData?.savedSearches && savedSearchesData.savedSearches.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                <span className="text-sm text-gray-500 flex-shrink-0 self-center">Saved:</span>
                {savedSearchesData.savedSearches.map((search: any) => (
                  <button
                    key={search.id}
                    type="button"
                    onClick={() => setFilters(search.filters)}
                    className="flex-shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-[var(--brand-blue)]/40 hover:text-[var(--brand-blue)] transition-colors"
                  >
                    {search.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <SearchFilters
                currentFilters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            <div className="lg:col-span-3">
              {isLoading && (
                <div className="grid gap-4">
                  <SkeletonList items={6} />
                </div>
              )}

              {error && (
                <ErrorDisplay
                  error={error}
                  onRetry={() => window.location.reload()}
                  variant="card"
                  title="Failed to load cleaners"
                />
              )}

              {!isLoading && !error && data && (
                <>
                  {Array.isArray(data?.data) && data.data.length > 0 ? (
                    <div className="grid gap-4">
                      {data.data.map((cleaner: any) => (
                        <LazyComponent key={cleaner.id} fallback={<div className="h-36 bg-gray-100 animate-pulse rounded-2xl" />}>
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
                            tier={cleaner.tier}
                            reliability_score={cleaner.reliability_score}
                          />
                        </LazyComponent>
                      ))}
                    </div>
                  ) : (
                    <EmptyCleaners />
                  )}

                  {(() => {
                    const pagination = data?.pagination;
                    return pagination && pagination.total_pages > 1 ? (
                      <div className="flex items-center justify-center gap-3 mt-8">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          aria-label="Previous page"
                          className="border-gray-200 hover:border-[var(--brand-blue)]/40"
                        >
                          Previous
                        </Button>
                        <span className="text-sm text-gray-600 tabular-nums">
                          Page {pagination.page} of {pagination.total_pages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.total_pages}
                          aria-label="Next page"
                          className="border-gray-200 hover:border-[var(--brand-blue)]/40"
                        >
                          Next
                        </Button>
                      </div>
                    ) : null;
                  })()}
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
