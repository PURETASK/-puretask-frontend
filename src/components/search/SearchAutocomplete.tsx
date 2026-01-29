'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

interface AutocompleteSuggestion {
  id: string;
  text: string;
  type: 'cleaner' | 'service' | 'location';
  highlight?: string;
}

interface SearchAutocompleteProps {
  onSelect?: (suggestion: AutocompleteSuggestion) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  minLength?: number;
}

export function SearchAutocomplete({
  onSelect,
  onSearch,
  placeholder = 'Search...',
  className,
  minLength = 2,
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch autocomplete suggestions
  const { data: suggestionsData, isLoading } = useQuery({
    queryKey: ['search-autocomplete', query],
    queryFn: async () => {
      if (!query || query.length < minLength) return { suggestions: [] };
      
      const response = await apiClient.get('/search/autocomplete', {
        params: { q: query, limit: 8 },
      });
      return response.data;
    },
    enabled: query.length >= minLength,
    staleTime: 30000,
  });

  const suggestions = suggestionsData?.suggestions || [];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelect(suggestions[selectedIndex]);
      } else if (query.trim() && onSearch) {
        onSearch(query);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleSelect = (suggestion: AutocompleteSuggestion) => {
    setQuery(suggestion.text);
    setIsOpen(false);
    if (onSelect) {
      onSelect(suggestion);
    }
  };

  const handleChange = (value: string) => {
    setQuery(value);
    setIsOpen(value.length >= minLength);
    setSelectedIndex(-1);
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            if (query.length >= minLength) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10"
          aria-label="Search with autocomplete"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          role="combobox"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <Card className="absolute top-full mt-1 w-full z-50 shadow-lg">
          <CardContent className="p-0">
            <div className="max-h-64 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSelect(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    'w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0',
                    selectedIndex === index && 'bg-gray-50'
                  )}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {highlightText(suggestion.text, query)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 capitalize">
                        {suggestion.type}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isOpen && isLoading && (
        <Card className="absolute top-full mt-1 w-full z-50 shadow-lg">
          <CardContent className="p-4 text-center text-gray-500 text-sm">
            Searching...
          </CardContent>
        </Card>
      )}
    </div>
  );
}
