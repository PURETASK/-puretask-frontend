'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <Card className="max-w-md w-full border-red-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <CardTitle className="text-xl">Something went wrong</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            An error occurred while loading this page. You can try again or go back.
          </p>
          {process.env.NODE_ENV === 'development' && error?.message && (
            <p className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded break-all">
              {error.message}
            </p>
          )}
          <div className="flex gap-3">
            <Button variant="primary" onClick={reset}>
              Try again
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
