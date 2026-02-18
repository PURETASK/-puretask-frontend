'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Rating } from '@/components/ui/Rating';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { clientEnhancedService } from '@/services/clientEnhanced.service';
import { useToast } from '@/contexts/ToastContext';
import { format } from 'date-fns';
import { Edit, Trash2, Plus, Sparkles, Image as ImageIcon, TrendingUp } from 'lucide-react';

export default function ReviewsPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <ReviewsContent />
    </ProtectedRoute>
  );
}

function ReviewsContent() {
  const [activeTab, setActiveTab] = useState<'given' | 'write'>('given');
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['reviews', 'given'],
    queryFn: async () => {
      try {
        return await apiClient.get('/client/reviews/given');
      } catch {
        return { reviews: [] };
      }
    },
  });

  // Get review insights
  const { data: insightsData } = useQuery({
    queryKey: ['reviews', 'insights'],
    queryFn: () => clientEnhancedService.getReviewInsights(),
  });

  const reviews = reviewsData?.reviews || [];

  const { mutate: deleteReview } = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/client/reviews/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'given'] });
      showToast('Review deleted', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.error?.message || 'Failed to delete review', 'error');
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
              <p className="text-gray-600 mt-1">Manage your reviews</p>
            </div>
            <Button variant="primary" onClick={() => setShowWriteForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Write a Review
            </Button>
          </div>

          {/* Review Insights */}
          {insightsData?.insights && (
            <Card className="mb-6 border-purple-200 bg-purple-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-purple-900 mb-2">Your Review Insights</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      {insightsData.insights.total_reviews && (
                        <div>
                          <p className="text-purple-700">Total Reviews</p>
                          <p className="text-lg font-bold text-purple-900">
                            {insightsData.insights.total_reviews}
                          </p>
                        </div>
                      )}
                      {insightsData.insights.average_rating && (
                        <div>
                          <p className="text-purple-700">Average Rating Given</p>
                          <p className="text-lg font-bold text-purple-900">
                            {insightsData.insights.average_rating.toFixed(1)} ⭐
                          </p>
                        </div>
                      )}
                      {insightsData.insights.most_reviewed_cleaner && (
                        <div>
                          <p className="text-purple-700">Most Reviewed</p>
                          <p className="text-lg font-bold text-purple-900">
                            {insightsData.insights.most_reviewed_cleaner.name}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews Given Tab */}
          {isLoading ? (
            <div className="text-center py-12">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600 mb-6">You haven't written any reviews yet.</p>
                <Button variant="primary" onClick={() => setShowWriteForm(true)}>
                  Write Your First Review
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review: any) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onEdit={() => setEditingReview(review)}
                  onDelete={() => {
                    if (confirm('Delete this review?')) {
                      deleteReview(review.id);
                    }
                  }}
                />
              ))}
            </div>
          )}

          {/* Write/Edit Review Modal */}
          {(showWriteForm || editingReview) && (
            <WriteReviewModal
              review={editingReview}
              onClose={() => {
                setShowWriteForm(false);
                setEditingReview(null);
              }}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Review Card Component
function ReviewCard({
  review,
  onEdit,
  onDelete,
}: {
  review: any;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Rating value={review.rating} readOnly size="sm" />
              <span className="text-sm text-gray-600">
                {format(new Date(review.created_at), 'MMM d, yyyy')}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {review.cleaner?.name || 'Cleaner'}
            </h3>
            {review.comment && <p className="text-gray-700">{review.comment}</p>}
            {review.photos && review.photos.length > 0 && (
              <div className="mt-3 flex gap-2">
                {review.photos.map((photo: string, idx: number) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`Review photo ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Write Review Modal
function WriteReviewModal({ review, onClose }: { review?: any; onClose: () => void }) {
  const [rating, setRating] = useState(review?.rating || 5);
  const [comment, setComment] = useState(review?.comment || '');
  const [cleanerId, setCleanerId] = useState(review?.cleaner_id || '');
  const [photos, setPhotos] = useState<string[]>(review?.photos || []);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: async (data: any) => {
      let reviewId = review?.id;
      if (review) {
        await apiClient.patch(`/client/reviews/${review.id}`, data);
        reviewId = review.id;
      } else {
        const response = await apiClient.post('/client/reviews', data);
        reviewId = response.review?.id;
      }
      // Add photos if any
      if (photos.length > 0 && reviewId) {
        await clientEnhancedService.addReviewPhotos(reviewId, photos);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'given'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'insights'] });
      showToast(review ? 'Review updated!' : 'Review submitted!', 'success');
      onClose();
    },
    onError: (error: any) => {
      showToast(error.response?.data?.error?.message || 'Failed to submit review', 'error');
    },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Convert files to base64 or upload to storage
      // For now, just store file names (in production, upload to S3/Cloudinary)
      const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file));
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanerId) {
      showToast('Please select a cleaner', 'error');
      return;
    }
    submitReview({ cleaner_id: cleanerId, rating, comment });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{review ? 'Edit Review' : 'Write a Review'}</CardTitle>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!review && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Cleaner
                </label>
                <Input
                  type="text"
                  value={cleanerId}
                  onChange={(e) => setCleanerId(e.target.value)}
                  placeholder="Cleaner ID or search..."
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <Rating value={rating} onChange={setRating} size="lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos (Optional)
              </label>
              <div className="flex gap-2 flex-wrap">
                {photos.map((photo, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={photo}
                      alt={`Review photo ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500">
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Add up to 5 photos (optional)</p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isPending} className="flex-1">
                {review ? 'Update Review' : 'Submit Review'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
