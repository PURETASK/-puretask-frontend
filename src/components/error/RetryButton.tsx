'use client';

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface RetryButtonProps {
  onRetry: () => Promise<void> | void;
  className?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  maxRetries?: number;
  children?: React.ReactNode;
}

export function RetryButton({
  onRetry,
  className,
  variant = 'primary',
  size = 'md',
  maxRetries = 3,
  children = 'Retry',
}: RetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleRetry = async () => {
    if (retryCount >= maxRetries) {
      setError(`Maximum retries (${maxRetries}) reached`);
      return;
    }

    setIsRetrying(true);
    setError(null);

    try {
      await onRetry();
      setRetryCount(0); // Reset on success
    } catch (err) {
      setRetryCount((prev) => prev + 1);
      setError(err instanceof Error ? err.message : 'Retry failed');
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Button
        variant={variant}
        size={size}
        onClick={handleRetry}
        disabled={isRetrying || retryCount >= maxRetries}
        isLoading={isRetrying}
      >
        <RefreshCw className={cn('h-4 w-4 mr-2', isRetrying && 'animate-spin')} />
        {children}
        {retryCount > 0 && ` (${retryCount}/${maxRetries})`}
      </Button>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
