'use client';

import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface ErrorDisplayProps {
  error: Error | string;
  onRetry?: () => void;
  onDismiss?: () => void;
  title?: string;
  className?: string;
  variant?: 'inline' | 'card' | 'full';
  showDetails?: boolean;
}

export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  title = 'Something went wrong',
  className,
  variant = 'inline',
  showDetails = process.env.NODE_ENV === 'development',
}: ErrorDisplayProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? null : error.stack;

  const content = (
    <div className={cn('flex items-start gap-3', className)}>
      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{errorMessage}</p>
        {showDetails && errorStack && (
          <details className="mt-2">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
              Technical details
            </summary>
            <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
              {errorStack}
            </pre>
          </details>
        )}
        <div className="flex gap-2 mt-3">
          {onRetry && (
            <Button variant="primary" size="sm" onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Try Again
            </Button>
          )}
          {onDismiss && (
            <Button variant="outline" size="sm" onClick={onDismiss}>
              <X className="h-4 w-4 mr-1" />
              Dismiss
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (variant === 'card') {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">{content}</CardContent>
      </Card>
    );
  }

  if (variant === 'full') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-lg w-full border-red-200">
          <CardContent className="p-6">{content}</CardContent>
        </Card>
      </div>
    );
  }

  return <div className={cn('p-4 bg-red-50 border border-red-200 rounded-lg', className)}>{content}</div>;
}
