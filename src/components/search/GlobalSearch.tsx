'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

interface SearchResult {
  type: 'cleaner' | 'booking' | 'client' | 'job';
  id: string;
  title: string;
  subtitle?: string;
  url: string;
}

interface SearchHistoryItem {
  query: string;
  timestamp: Date;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        })));
      } catch {
        // Invalid data
      }
    }
  }, []);

  // Global search query
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['global-search', query],
    queryFn: async () => {
      if (!query || query.length < 2) return { results: [] };
      
      const response = await apiClient.get('/search/global', {
        params: { q: query, limit: 10 },
      });
      return response.data;
    },
    enabled: query.length >= 2,
    staleTime: 30000,
  });

  // Suggestions based on query
  const suggestions = query.length > 0
    ? searchHistory
        .filter((item) => item.query.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
    : searchHistory.slice(0, 5);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Add to history
    const newHistory = [
      { query: searchQuery, timestamp: new Date() },
      ...searchHistory.filter((item) => item.query !== searchQuery),
    ].slice(0, 10);

    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    // Navigate to search results
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setShowSuggestions(false);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search cleaners, bookings, clients..."
          className="pl-10 pr-10 w-full max-w-md"
          aria-label="Global search"
          aria-expanded={isOpen}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setShowSuggestions(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <Card className="absolute top-full mt-2 w-full max-w-md z-50 shadow-lg">
          <CardContent className="p-0">
            {/* Search Results */}
            {query.length >= 2 && (
              <div className="border-b border-gray-200">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700">Search Results</h3>
                </div>
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
                ) : searchResults?.results?.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {searchResults.results.map((result: SearchResult) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => {
                          router.push(result.url);
                          setIsOpen(false);
                        }}
                        className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm">{result.title}</p>
                            {result.subtitle && (
                              <p className="text-xs text-gray-600 mt-1">{result.subtitle}</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 capitalize flex-shrink-0">
                            {result.type}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No results found for "{query}"
                  </div>
                )}
              </div>
            )}

            {/* Suggestions / History */}
            {showSuggestions && (
              <div>
                <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700">
                    {query.length > 0 ? 'Suggestions' : 'Recent Searches'}
                  </h3>
                  {searchHistory.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-xs text-gray-500 hover:text-gray-700"
                      aria-label="Clear search history"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {suggestions.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto">
                    {suggestions.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(item.query)}
                        className="w-full text-left p-3 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-0"
                      >
                        <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700 flex-1">{item.query}</span>
                        <TrendingUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    {query.length > 0 ? 'No suggestions' : 'No recent searches'}
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/search')}
                  className="flex-1"
                >
                  Advanced Search
                </Button>
                {query.length >= 2 && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSearch(query)}
                    className="flex-1"
                  >
                    Search All
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
