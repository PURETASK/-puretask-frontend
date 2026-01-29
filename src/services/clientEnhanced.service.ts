// Client Enhanced Services
import { apiClient } from '@/lib/api';

export interface DashboardInsights {
  bookingPatterns: Array<{ dayOfWeek: number; hour: number; count: number }>;
  favoriteCleaner: {
    cleaner_id: string;
    name: string;
    booking_count: number;
  } | null;
  lastBooking: {
    scheduled_start_at: string;
    cleaner_id: string;
  } | null;
  creditExpiration: string | null;
}

export interface CleanerRecommendation {
  id: string;
  name: string;
  avatar_url?: string;
  price_per_hour: number;
  rating: number;
  reviews_count: number;
}

export const clientEnhancedService = {
  // Draft bookings
  saveDraft: async (draft: any) => {
    return apiClient.post('/client/bookings/draft', draft);
  },

  getDraft: async () => {
    return apiClient.get('/client/bookings/draft');
  },

  // Dashboard insights
  getInsights: async (): Promise<{ insights: DashboardInsights }> => {
    return apiClient.get('/client/dashboard/insights');
  },

  getRecommendations: async (): Promise<{
    recommendations: {
      similarToFavorites: CleanerRecommendation[];
      topRated: CleanerRecommendation[];
    };
  }> => {
    return apiClient.get('/client/dashboard/recommendations');
  },

  // Saved searches
  saveSearch: async (name: string, filters: any) => {
    return apiClient.post('/client/search/saved', { name, filters });
  },

  getSavedSearches: async () => {
    return apiClient.get('/client/search/saved');
  },

  // Favorites enhancements
  getFavoriteRecommendations: async () => {
    return apiClient.get('/client/favorites/recommendations');
  },

  getFavoriteInsights: async () => {
    return apiClient.get('/client/favorites/insights');
  },

  // Recurring bookings
  skipRecurringBooking: async (id: string) => {
    return apiClient.post(`/client/recurring-bookings/${id}/skip`);
  },

  getRecurringSuggestions: async (id: string) => {
    return apiClient.get(`/client/recurring-bookings/${id}/suggestions`);
  },

  // Profile preferences
  savePreferences: async (preferences: any) => {
    return apiClient.put('/client/profile/preferences', preferences);
  },

  getPreferences: async () => {
    return apiClient.get('/client/profile/preferences');
  },

  uploadProfilePhoto: async (photo_url: string) => {
    return apiClient.post('/client/profile/photo', { photo_url });
  },

  // Reviews
  addReviewPhotos: async (reviewId: string, photo_urls: string[]) => {
    return apiClient.post(`/client/reviews/${reviewId}/photos`, { photo_urls });
  },

  getReviewInsights: async () => {
    return apiClient.get('/client/reviews/insights');
  },

  // Job enhancements
  getLiveStatus: async (jobId: string) => {
    return apiClient.get(`/client/jobs/${jobId}/live-status`);
  },

  addToCalendar: async (jobId: string) => {
    return apiClient.post(`/client/jobs/${jobId}/add-to-calendar`);
  },

  getShareLink: async (jobId: string) => {
    return apiClient.get(`/client/jobs/${jobId}/share-link`);
  },

  // Credit auto-refill
  setupCreditAutoRefill: async (config: any) => {
    return apiClient.post('/client/credits/auto-refill', config);
  },
};
