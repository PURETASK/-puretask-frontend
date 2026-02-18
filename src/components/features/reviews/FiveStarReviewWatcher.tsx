'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { cleanerService } from '@/services/cleaner.service';
import { LottieSuccess, LOTTIE_URLS } from '@/components/ui/LottieSuccess';
import { Button } from '@/components/ui/Button';

const STORAGE_KEY = 'puretask_five_star_celebrated';
const POLL_INTERVAL_MS = 60_000; // Poll every 60 seconds

function getCelebratedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addCelebratedId(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const ids = getCelebratedIds();
    if (!ids.includes(id)) {
      ids.push(id);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }
  } catch {
    // ignore
  }
}

export function FiveStarReviewWatcher() {
  const { user } = useAuth();
  const [showCelebration, setShowCelebration] = useState<string | null>(null); // review id being celebrated

  const { data } = useQuery({
    queryKey: ['cleaner', user?.id, 'reviews', 'watcher'],
    queryFn: () => cleanerService.getCleanerReviews(user!.id, { page: 1, per_page: 20 }),
    enabled: !!user?.id && user?.role === 'cleaner',
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: false, // Only poll when tab is visible
  });

  const reviews = (data as any)?.reviews || [];

  useEffect(() => {
    if (reviews.length === 0) return;
    const celebrated = getCelebratedIds();
    const fiveStarReviews = reviews.filter(
      (r: any) => r.rating === 5 && r.id && !celebrated.includes(r.id)
    );
    if (fiveStarReviews.length > 0) {
      // Show celebration for the most recent new 5-star review
      const sorted = [...fiveStarReviews].sort(
        (a: any, b: any) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
      const newest = sorted[0];
      addCelebratedId(newest.id);
      setShowCelebration(newest.id);
    }
  }, [reviews]);

  if (user?.role !== 'cleaner' || !showCelebration) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="five-star-celebration-title"
      onClick={() => setShowCelebration(null)}
    >
      <div
        className="flex flex-col items-center bg-white rounded-2xl p-8 shadow-xl max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <LottieSuccess
          src={LOTTIE_URLS.fiveStarReview}
          width={300}
          height={300}
          autoplay
          loop
        />
        <h2
          id="five-star-celebration-title"
          className="text-2xl font-bold text-gray-900 mt-4 text-center"
        >
          🌟 5-Star Review!
        </h2>
        <p className="text-gray-600 text-center mt-2">
          A client just gave you a perfect 5-star rating. Amazing work!
        </p>
        <Button
          variant="primary"
          size="lg"
          className="mt-6 w-full"
          onClick={() => setShowCelebration(null)}
        >
          Celebrate!
        </Button>
      </div>
    </div>
  );
}
