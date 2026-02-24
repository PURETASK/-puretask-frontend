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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
          <p className="text-gray-600 mb-8">
            Reviews from clients about your service appear here.
          </p>

          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                After you complete jobs, clients can leave reviews. They will show up here and on your public profile.
              </p>
              <Button variant="outline" asChild>
                <Link href="/cleaner/dashboard">Back to Dashboard</Link>
              </Button>
              <p className="text-sm text-gray-500 mt-6">
                Have a question?{' '}
                <Link href="/messages" className="text-blue-600 hover:underline">
                  Messages
                </Link>
                {' · '}
                <Link href="/help" className="text-blue-600 hover:underline">
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
