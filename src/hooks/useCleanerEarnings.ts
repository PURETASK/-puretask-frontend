import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cleanerEarningsService } from '@/services/cleanerEarnings.service';
import { useToast } from '@/contexts/ToastContext';

export function useCleanerEarnings() {
  return useQuery({
    queryKey: ['cleaner', 'earnings'],
    queryFn: () => cleanerEarningsService.getEarnings(),
  });
}

export function useCleanerPayouts(params?: { page?: number; per_page?: number }) {
  return useQuery({
    queryKey: ['cleaner', 'payouts', params],
    queryFn: () => cleanerEarningsService.getPayouts(params),
  });
}

export function useRequestPayout() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (amount?: number) => cleanerEarningsService.requestPayout(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cleaner', 'earnings'] });
      queryClient.invalidateQueries({ queryKey: ['cleaner', 'payouts'] });
      showToast('Payout requested successfully!', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.error?.message || 'Failed to request payout', 'error');
    },
  });
}
