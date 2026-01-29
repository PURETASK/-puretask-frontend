import { apiClient } from '@/lib/api';

export interface Favorite {
  id: string;
  cleaner_id: string;
  cleaner: {
    id: string;
    name: string;
    avatar_url?: string;
    rating: number;
    reviews_count: number;
    price_per_hour: number;
  };
  created_at: string;
}

export const favoritesService = {
  // Get user's favorites
  getFavorites: async (): Promise<{ favorites: Favorite[] }> => {
    return apiClient.get('/client/favorites');
  },

  // Add cleaner to favorites
  addFavorite: async (cleanerId: string): Promise<{ favorite: Favorite }> => {
    return apiClient.post('/client/favorites', { cleaner_id: cleanerId });
  },

  // Remove cleaner from favorites
  removeFavorite: async (favoriteId: string): Promise<{ success: boolean }> => {
    return apiClient.delete(`/client/favorites/${favoriteId}`);
  },
};
