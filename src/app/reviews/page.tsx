import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ReviewCard } from '@/components/features/reviews/ReviewCard';
import { Button } from '@/components/ui/Button';
export default function ReviewsPage() {
  const reviews = [
    {
      author: 'Sarah Johnson',
      rating: 5,
      date: 'Jan 5, 2026',
      text: 'Jane did an amazing job! My apartment has never looked better. Very professional and thorough. Highly recommend!',
      helpful: 12,
    },
    {
      author: 'Mike Chen',
      rating: 5,
      date: 'Jan 3, 2026',
      text: 'Excellent service! Arrived on time, very friendly, and the quality of work exceeded my expectations.',
      helpful: 8,
    },
    {
      author: 'Emily Davis',
      rating: 4,
      date: 'Dec 28, 2025',
      text: 'Great service overall. Very detail-oriented. Will definitely book again!',
      helpful: 5,
    },
  ];
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
              <p className="text-gray-600 mt-1">Read what clients are saying</p>
            </div>
            <Button variant="primary">Write a Review</Button>
          </div>
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <ReviewCard key={idx} {...review} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
