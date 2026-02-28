'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { Star } from 'lucide-react';

function CleanerReviewsContent() {
  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <a href="/cleaner" className="text-sm font-medium text-gray-600 hover:text-gray-900 mb-2 inline-block">← Back to home</a>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My reviews</h1>
            <p className="text-gray-600 mt-1">Reviews from clients about your service appear here.</p>
          </div>

          <Card className="rounded-2xl border-gray-200">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--brand-cloud)', color: 'var(--brand-blue)' }}>
                <Star className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                After you complete jobs, clients can leave reviews. They will show up here and on your public profile.
              </p>
              <Button variant="outline" asChild>
                <Link href="/cleaner">Back to home</Link>
              </Button>
              <p className="text-sm text-gray-500 mt-6">
                Have a question?{' '}
                <Link href="/messages" className="hover:underline" style={{ color: 'var(--brand-blue)' }}>
                  Messages
                </Link>
                {' · '}
                <Link href="/help" className="hover:underline" style={{ color: 'var(--brand-blue)' }}>
                  Help Center
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Placeholder for future review list */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Review summary (when available)</h2>
            <p className="text-sm text-gray-500">
              Average rating and recent reviews will appear here once clients leave feedback.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CleanerReviewsPage() {
  return (
    <ProtectedRoute requiredRole="cleaner">
      <CleanerReviewsContent />
    </ProtectedRoute>
  );
}
