import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cleanerJobsService } from '@/services/cleanerJobs.service';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';

export function useAvailableJobs() {
  return useQuery({
    queryKey: ['cleaner', 'available-jobs'],
    queryFn: () => cleanerJobsService.getAvailableJobs(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

export function useAssignedJobs() {
  return useQuery({
    queryKey: ['cleaner', 'assigned-jobs'],
    queryFn: () => cleanerJobsService.getAssignedJobs(),
  });
}

export function useAcceptJob() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: (jobId: string) => cleanerJobsService.acceptJob(jobId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['cleaner', 'available-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['cleaner', 'assigned-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      showToast('Job accepted successfully!', 'success');
      router.push(`/cleaner/jobs/${response.job.id}`);
    },
    onError: (error: any) => {
      showToast(error.response?.data?.error?.message || 'Failed to accept job', 'error');
    },
  });
}
