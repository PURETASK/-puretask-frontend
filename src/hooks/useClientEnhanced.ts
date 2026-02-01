// Client Enhanced Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientEnhancedService } from '@/services/clientEnhanced.service';
import { useToast } from '@/contexts/ToastContext';

export const useDashboardInsights = () => {
  return useQuery({
    queryKey: ['client', 'dashboard', 'insights'],
    queryFn: () => clientEnhancedService.getInsights(),
  });
};

export const useRecommendations = () => {
  return useQuery({
    queryKey: ['client', 'recommendations'],
    queryFn: () => clientEnhancedService.getRecommendations(),
  });
};

export const useDraftBooking = () => {
  return useQuery({
    queryKey: ['client', 'draft-booking'],
    queryFn: () => clientEnhancedService.getDraft(),
  });
};

export const useSaveDraftBooking = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (draft: any) => clientEnhancedService.saveDraft(draft),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', 'draft-booking'] });
      showToast('Draft saved', 'success');
    },
    onError: () => {
      showToast('Failed to save draft', 'error');
    },
  });
};

export const useLiveJobStatus = (jobId: string, enabled = true) => {
  return useQuery({
    queryKey: ['client', 'jobs', jobId, 'live-status'],
    queryFn: () => clientEnhancedService.getLiveStatus(jobId),
    enabled: enabled && !!jobId,
    refetchInterval: 10000, // Poll every 10 seconds
  });
};

export const useAddToCalendar = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (jobId: string) => clientEnhancedService.addToCalendar(jobId),
    onSuccess: () => {
      showToast('Added to calendar', 'success');
    },
    onError: () => {
      showToast('Failed to add to calendar', 'error');
    },
  });
};

export const useFavoriteRecommendations = () => {
  return useQuery({
    queryKey: ['client', 'favorites', 'recommendations'],
    queryFn: () => clientEnhancedService.getFavoriteRecommendations(),
  });
};

export const useFavoriteInsights = () => {
  return useQuery({
    queryKey: ['client', 'favorites', 'insights'],
    queryFn: () => clientEnhancedService.getFavoriteInsights(),
  });
};

export const useRecurringSuggestions = (id: string) => {
  return useQuery({
    queryKey: ['client', 'recurring-bookings', id, 'suggestions'],
    queryFn: () => clientEnhancedService.getRecurringSuggestions(id),
    enabled: !!id,
  });
};

export const useSkipRecurringBooking = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => clientEnhancedService.skipRecurringBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-bookings'] });
      showToast('Booking skipped', 'success');
    },
    onError: () => {
      showToast('Failed to skip booking', 'error');
    },
  });
};

export const usePreferences = () => {
  return useQuery({
    queryKey: ['client', 'preferences'],
    queryFn: () => clientEnhancedService.getPreferences(),
  });
};

export const useSavePreferences = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (preferences: any) => clientEnhancedService.savePreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', 'preferences'] });
      showToast('Preferences saved', 'success');
    },
    onError: () => {
      showToast('Failed to save preferences', 'error');
    },
  });
};

export const useReviewInsights = () => {
  return useQuery({
    queryKey: ['client', 'reviews', 'insights'],
    queryFn: () => clientEnhancedService.getReviewInsights(),
  });
};
