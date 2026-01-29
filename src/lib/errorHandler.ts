/**
 * Centralized error handling utilities
 */

export interface AppError {
  code: string;
  message: string;
  statusCode?: number;
  details?: any;
}

/**
 * Convert various error types to AppError
 */
export function normalizeError(error: unknown): AppError {
  // Already normalized
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    return error as AppError;
  }

  // Axios errors
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as any;
    const response = axiosError.response;
    
    return {
      code: response?.data?.error?.code || 'API_ERROR',
      message: response?.data?.error?.message || response?.statusText || 'An error occurred',
      statusCode: response?.status,
      details: response?.data,
    };
  }

  // Standard Error
  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred',
      details: { stack: error.stack },
    };
  }

  // String errors
  if (typeof error === 'string') {
    return {
      code: 'ERROR',
      message: error,
    };
  }

  // Fallback
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    details: error,
  };
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: AppError): string {
  const errorMessages: Record<string, string> = {
    NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
    TIMEOUT: 'The request took too long. Please try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action. Please log in.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    SERVER_ERROR: 'The server encountered an error. Please try again later.',
    RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
  };

  return errorMessages[error.code] || error.message || 'An error occurred';
}

/**
 * Log error (in production, send to error tracking service)
 */
export function logError(error: AppError, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error, context);
  } else {
    // TODO: Send to Sentry or other error tracking service
    // Sentry.captureException(error, { extra: context });
  }
}
