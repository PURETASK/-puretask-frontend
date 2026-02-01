import { useQuery } from '@tanstack/react-query';
import { cleanerService, CleanerSearchParams } from '@/services/cleaner.service';

export function useCleanerSearch(params?: CleanerSearchParams) {
  return useQuery({
    queryKey: ['cleaners', 'search', params],
    queryFn: () => cleanerService.searchCleaners(params),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCleaner(cleanerId: string) {
  return useQuery({
    queryKey: ['cleaner', cleanerId],
    queryFn: () => cleanerService.getCleaner(cleanerId),
    enabled: !!cleanerId,
  });
}

export function useCleanerAvailability(cleanerId: string, date: string) {
  return useQuery({
    queryKey: ['cleaner', cleanerId, 'availability', date],
    queryFn: () => cleanerService.getCleanerAvailability(cleanerId, date),
    enabled: !!cleanerId && !!date,
  });
}

export function useCleanerReviews(cleanerId: string, page: number = 1) {
  return useQuery({
    queryKey: ['cleaner', cleanerId, 'reviews', page],
    queryFn: () => cleanerService.getCleanerReviews(cleanerId, { page, per_page: 10 }),
    enabled: !!cleanerId,
  });
}

export function useFeaturedCleaners() {
  return useQuery({
    queryKey: ['cleaners', 'featured'],
    queryFn: () => cleanerService.getFeaturedCleaners(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Alias for backward compatibility
export const useCleaners = useCleanerSearch;

