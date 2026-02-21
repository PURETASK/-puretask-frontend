'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { BadgeGrid } from '@/components/gamification';
import { useQuery } from '@tanstack/react-query';
import { cleanerGamificationService } from '@/services/cleanerGamification.service';

const PLACEHOLDER_BADGES = [
  { id: 'on_time', name: 'On-Time Pro', icon: '⏱️', earned: true, earned_date: '2 days ago', how_to_earn: 'Complete 20 jobs with on-time rate ≥ 90%', featured: true, can_pin: true, category: 'core' as const },
  { id: 'photo_perfect', name: 'Photo Perfect', icon: '📸', earned: true, earned_date: '1 week ago', how_to_earn: 'Upload before + after photos for 15 jobs', featured: false, can_pin: true, category: 'core' as const },
  { id: 'early_bird', name: 'Early Bird', icon: '🌅', earned: false, how_to_earn: 'Complete 10 jobs before 8 AM', can_pin: false, category: 'fun' as const },
  { id: 'five_star', name: '5-Star Pro', icon: '⭐', earned: true, earned_date: '3 weeks ago', how_to_earn: 'Maintain 4.8+ rating for 20 bookings', can_pin: true, category: 'core' as const },
  { id: 'addon_king', name: 'Add-on Champion', icon: '➕', earned: false, how_to_earn: 'Complete 50 add-ons in a level window', can_pin: false, category: 'fun' as const },
  { id: 'rapid_reply', name: 'Rapid Responder', icon: '⚡', earned: true, earned_date: '1 month ago', how_to_earn: 'Respond to 50 messages within 5 minutes', can_pin: false, category: 'fun' as const },
];

function BadgesContent() {
  const [tab, setTab] = useState<'Core' | 'Fun' | 'All'>('All');

  const { data: apiBadges, isLoading, isError } = useQuery({
    queryKey: ['cleaner', 'badges'],
    queryFn: () => cleanerGamificationService.getBadges(),
  });

  const badges = (apiBadges && apiBadges.length > 0 ? apiBadges : PLACEHOLDER_BADGES) as Array<{
    id: string;
    name: string;
    icon?: string;
    earned: boolean;
    earned_date?: string;
    how_to_earn?: string;
    featured?: boolean;
    can_pin?: boolean;
    category?: 'core' | 'fun';
  }>;

  const filtered = useMemo(() => {
    if (tab === 'All') return badges;
    if (tab === 'Core') return badges.filter((b) => b.category === 'core' || ['on_time', 'photo_perfect', 'five_star'].includes(b.id));
    return badges.filter((b) => b.category === 'fun' || ['early_bird', 'rapid_reply', 'addon_king'].includes(b.id));
  }, [badges, tab]);

  const gridBadges = filtered.map((b) => ({
    id: b.id,
    name: b.name,
    icon: b.icon,
    earned: b.earned,
    earnedDate: b.earned_date,
    howToEarn: b.how_to_earn,
    featured: b.featured,
    canPin: b.can_pin,
    onPin: b.can_pin ? () => {} : undefined,
    onShare: () => {},
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Badges & Achievements</h1>
          <p className="text-gray-600 mb-6">
            Core badges (profile-visible), fun/personality badges, recently earned.
          </p>

          <div className="flex gap-2 border-b border-gray-200 mb-6">
            {(['Core', 'Fun', 'All'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium rounded-t ${tab === t ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {isLoading && <p className="text-gray-500 text-sm mb-4">Loading badges…</p>}
          {isError && apiBadges?.length === 0 && <p className="text-amber-600 text-sm mb-4">Could not load badges. Showing sample.</p>}

          <BadgeGrid
            badges={gridBadges}
            columns={4}
            emptyMessage="No badges in this category."
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function BadgesPage() {
  return (
    <ProtectedRoute requiredRole="cleaner">
      <BadgesContent />
    </ProtectedRoute>
  );
}
