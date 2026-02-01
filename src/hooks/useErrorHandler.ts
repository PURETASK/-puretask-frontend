'use client';

import { useCallback } from 'react';
import { normalizeError, getUserFriendlyMessage, logError, AppError } from '@/lib/errorHandler';
import { useToast } from '@/contexts/ToastContext';

export function useErrorHandler() {
  const { showToast } = useToast();

  const handleError = useCallback(
    (error: unknown, options?: { showToast?: boolean; log?: boolean }) => {
      const normalized = normalizeError(error);
      const message = getUserFriendlyMessage(normalized);

      if (options?.log !== false) {
        logError(normalized);
      }

      if (options?.showToast !== false) {
        showToast(message, 'error');
      }

      return normalized;
    },
    [showToast]
  );

  return { handleError };
}
