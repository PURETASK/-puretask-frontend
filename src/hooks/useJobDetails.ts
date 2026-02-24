import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getJobDetails } from '@/services/jobDetails.service';

export const JOB_DETAILS_QUERY_KEY = ['job-details'];

export function useJobDetails(jobId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...JOB_DETAILS_QUERY_KEY, jobId],
    queryFn: () => getJobDetails(jobId!),
    enabled: !!jobId,
  });

  const invalidate = () => {
    if (jobId) queryClient.invalidateQueries({ queryKey: [...JOB_DETAILS_QUERY_KEY, jobId] });
  };

  return {
    ...query,
    invalidate,
    details: query.data ?? null,
  };
}
