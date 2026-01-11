import { apiClient } from '@/lib/api';

export interface Cleaner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  rating: number;
  reviews_count: number;
  price_per_hour: number;
  experience_years: number;
  bio?: string;
  services: string[];
  availability: string;
  verified: boolean;
  background_checked: boolean;
  location?: string;
}

export interface CleanerSearchParams {
  query?: string;
  location?: string;
  service_type?: string;
  min_rating?: number;
  max_price?: number;
  min_price?: number;
  availability?: string;
  features?: string[];
  page?: number;
  per_page?: number;
  sort_by?: 'rating' | 'price_low' | 'price_high' | 'reviews' | 'experience';
}

export interface CleanerSearchResponse {
  data: Cleaner[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export const cleanerService = {
  // Search cleaners
  searchCleaners: async (params?: CleanerSearchParams): Promise<CleanerSearchResponse> => {
    return apiClient.get<CleanerSearchResponse>('/cleaners/search', { params });
  },

  // Get cleaner by ID
  getCleaner: async (cleanerId: string) => {
    return apiClient.get<{ cleaner: Cleaner }>(`/cleaners/${cleanerId}`);
  },

  // Get cleaner availability
  getCleanerAvailability: async (cleanerId: string, date: string) => {
    return apiClient.get<{ available_slots: string[] }>(
      `/cleaners/${cleanerId}/availability`,
      { params: { date } }
    );
  },

  // Get cleaner reviews
  getCleanerReviews: async (cleanerId: string, params?: { page?: number; per_page?: number }) => {
    return apiClient.get(`/cleaners/${cleanerId}/reviews`, { params });
  },

  // Get featured cleaners
  getFeaturedCleaners: async () => {
    return apiClient.get<{ cleaners: Cleaner[] }>('/cleaners/featured');
  },

  // Get top rated cleaners
  getTopRatedCleaners: async () => {
    return apiClient.get<{ cleaners: Cleaner[] }>('/cleaners/top-rated');
  },
};

