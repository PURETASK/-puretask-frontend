'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <Card className="max-w-lg w-full">
          <CardContent className="p-8 text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>

            {/* Content */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Something went wrong!
            </h1>
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Our team has been notified and
              we're working to fix the issue.
            </p>

            {/* Error Details (for development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <p className="text-xs font-mono text-gray-700 break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-gray-500 mt-2">Error ID: {error.digest}</p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="primary" onClick={reset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = '/')}>
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>

            {/* Support */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Need help?</p>
              <a
                href="/help"
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Contact Support
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

