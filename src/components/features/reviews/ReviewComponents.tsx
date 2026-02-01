'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, Flag } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    id: string;
    name: string;
    avatar?: string;
  };
  booking?: {
    id: string;
    service_type: string;
  };
  helpful_count?: number;
  is_verified?: boolean;
}

interface ReviewListProps {
  reviews: Review[];
  title?: string;
  showServiceType?: boolean;
  onMarkHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
}

export function ReviewList({
  reviews,
  title = 'Reviews',
  showServiceType = false,
  onMarkHelpful,
  onReport,
}: ReviewListProps) {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">⭐</div>
            <p>No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                <div className="flex items-start gap-4">
                  <Avatar
                    src={review.reviewer.avatar}
                    fallback={review.reviewer.name[0]}
                    size="md"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">
                            {review.reviewer.name}
                          </h4>
                          {review.is_verified && (
                            <Badge variant="success" size="sm">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(review.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <Rating value={review.rating} readOnly size="sm" />
                    </div>

                    {showServiceType && review.booking && (
                      <Badge variant="default" size="sm" className="mb-2">
                        {review.booking.service_type.replace('_', ' ')}
                      </Badge>
                    )}

                    <p className="text-gray-700 text-sm leading-relaxed">
                      {review.comment}
                    </p>

                    <div className="flex items-center gap-4 mt-3">
                      {onMarkHelpful && (
                        <button
                          onClick={() => onMarkHelpful(review.id)}
                          className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>Helpful ({review.helpful_count || 0})</span>
                        </button>
                      )}
                      {onReport && (
                        <button
                          onClick={() => onReport(review.id)}
                          className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600"
                        >
                          <Flag className="h-4 w-4" />
                          <span>Report</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ReviewFormProps {
  bookingId: string;
  onSubmit: (data: { rating: number; comment: string }) => void;
  isLoading?: boolean;
}

export function ReviewForm({ bookingId, onSubmit, isLoading }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    onSubmit({ rating, comment });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <Rating value={rating} onChange={setRating} size="lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={6}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-2">
              {comment.length}/1000 characters
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={rating === 0 || !comment.trim()}
            className="w-full"
          >
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export function ReviewSummary({
  averageRating,
  totalReviews,
  ratingDistribution,
}: ReviewSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <Rating value={averageRating} readOnly size="md" />
            <p className="text-sm text-gray-600 mt-2">
              {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingDistribution[star as keyof typeof ratingDistribution] || 0;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-8">{star}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

