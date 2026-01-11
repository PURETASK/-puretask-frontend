'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchFilters } from '@/components/features/search/SearchFilters';
import { CleanerCard } from '@/components/features/search/CleanerCard';
import { useCleanerSearch } from '@/hooks/useCleaners';
import { Loading, SkeletonCard } from '@/components/ui/Loading';
import { CleanerSearchParams } from '@/services/cleaner.service';

export default function SearchPage() {
  const [filters, setFilters] = useState<CleanerSearchParams>({
    page: 1,
    per_page: 12,
    sort_by: 'rating',
  });

  const { data, isLoading, error } = useCleanerSearch(filters);

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
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Find Your Perfect Cleaner
            </h1>
            <p className="text-gray-600">
              {data?.pagination.total || 0} professional cleaners available in your area
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <SearchFilters onFilterChange={handleFilterChange} currentFilters={filters} />
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Sort & View Options */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-600">
                    {isLoading ? (
                      'Loading...'
                    ) : error ? (
                      'Error loading results'
                    ) : (
                      `Showing ${data?.data.length || 0} of ${data?.pagination.total || 0} results`
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Sort by:</label>
                  <select
                    value={filters.sort_by}
                    onChange={(e) =>
                      handleFilterChange({
                        sort_by: e.target.value as CleanerSearchParams['sort_by'],
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="reviews">Most Reviews</option>
                    <option value="experience">Most Experience</option>
                  </select>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="grid gap-4">
                  {[...Array(6)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-2">⚠️</div>
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Error Loading Cleaners
                  </h3>
                  <p className="text-red-700">
                    {error.message || 'Failed to load cleaners. Please try again.'}
                  </p>
                </div>
              )}

              {/* Results */}
              {!isLoading && !error && data && (
                <>
                  {data.data.length > 0 ? (
                    <div className="grid gap-4">
                      {data.data.map((cleaner) => (
                        <CleanerCard
                          key={cleaner.id}
                          id={cleaner.id}
                          name={cleaner.name}
                          rating={cleaner.rating}
                          reviews={cleaner.reviews_count}
                          pricePerHour={cleaner.price_per_hour}
                          experience={cleaner.experience_years}
                          description={cleaner.bio || ''}
                          availability={cleaner.availability}
                          imageUrl={cleaner.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleaner.name)}&size=200`}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No cleaners found
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Try adjusting your filters to see more results
                      </p>
                      <button
                        onClick={() => setFilters({ page: 1, per_page: 12, sort_by: 'rating' })}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}

                  {/* Pagination */}
                  {data.pagination.total_pages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <button
                        onClick={() => handlePageChange(data.pagination.page - 1)}
                        disabled={data.pagination.page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <div className="flex gap-2">
                        {[...Array(Math.min(5, data.pagination.total_pages))].map((_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-4 py-2 rounded-lg ${
                                data.pagination.page === page
                                  ? 'bg-blue-600 text-white'
                                  : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => handlePageChange(data.pagination.page + 1)}
                        disabled={data.pagination.page === data.pagination.total_pages}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
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
