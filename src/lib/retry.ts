/**
 * Retry utility with exponential backoff
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryable?: (error: any) => boolean;
}

const defaultOptions: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
  retryable: () => true, // Retry all errors by default
};

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...defaultOptions, ...options };
  let lastError: any;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if error is not retryable
      if (!opts.retryable(error)) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === opts.maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt),
        opts.maxDelay
      );

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Check if error is retryable (network errors, 5xx, rate limits)
 */
export function isRetryableError(error: any): boolean {
  // Network errors
  if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('network')) {
    return true;
  }

  // HTTP errors
  if (error?.response) {
    const status = error.response.status;
    // Retry on 5xx errors and rate limits
    return status >= 500 || status === 429;
  }

  // Timeout errors
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return true;
  }

  return false;
}
