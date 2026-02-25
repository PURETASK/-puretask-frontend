import { useQuery } from '@tanstack/react-query';
import { getJobStatusConfig } from '@/services/config.service';
import {
  JOB_STATUS,
  JOB_STATUS_TRANSITIONS,
  JOB_STATUS_LABELS,
  JOB_STATUS_TERMINAL,
  getJobStatusLabel as getFallbackLabel,
  canTransition as fallbackCanTransition,
  isTerminalStatus as fallbackIsTerminal,
} from '@/constants/jobStatus';

const CONFIG_QUERY_KEY = ['config', 'job-status'];

/**
 * Optionally use GET /config/job-status for status/transition logic.
 * When the endpoint is unavailable or fails, falls back to src/constants/jobStatus.
 */
export function useJobStatusConfig() {
  const { data: config, isLoading, isSuccess } = useQuery({
    queryKey: CONFIG_QUERY_KEY,
    queryFn: getJobStatusConfig,
    staleTime: 5 * 60 * 1000, // 5 min
    retry: false,
  });

  const statuses: string[] = config?.statuses?.length ? config.statuses : [...JOB_STATUS];
  const terminal: string[] = config?.terminal ?? [...JOB_STATUS_TERMINAL];
  const transitions: Record<string, string[]> =
    config?.transitions ?? (JOB_STATUS_TRANSITIONS as Record<string, string[]>);
  const labels: Record<string, string> = config?.labels ?? { ...JOB_STATUS_LABELS };

  function getLabel(status: string): string {
    return labels[status] ?? getFallbackLabel(status);
  }

  function canTransition(from: string, to: string): boolean {
    const allowed = transitions[from];
    if (!allowed || !Array.isArray(allowed)) return fallbackCanTransition(from, to);
    return allowed.includes(to);
  }

  function isTerminal(status: string): boolean {
    if (terminal?.length) return terminal.includes(status);
    return fallbackIsTerminal(status);
  }

  return {
    /** Server config when GET /config/job-status succeeded */
    config: isSuccess && config ? config : null,
    /** Whether status/transition logic is driven by server config */
    isFromServer: isSuccess && !!config?.statuses?.length,
    isLoading,
    statuses,
    getLabel,
    canTransition,
    isTerminal,
  };
}
