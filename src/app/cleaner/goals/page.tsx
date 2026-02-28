'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { GoalCard } from '@/components/gamification';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import { cleanerGamificationService } from '@/services/cleanerGamification.service';
import Link from 'next/link';

const PLACEHOLDER_GOALS = [
  {
    id: 'g1',
    title: 'Complete 45 add-ons',
    progress: 27,
    target: 45,
    countsWhen: 'Add-on is completed and confirmed in the job',
    rewardPreview: 'Unlock Priority Visibility for 14 days',
    detailHref: '/cleaner/goals/g1',
    actionHref: '/cleaner/jobs',
  },
];

function GoalsListContent() {
  const { data: goals, isLoading, isError } = useQuery({
    queryKey: ['cleaner', 'goals'],
    queryFn: () => cleanerGamificationService.getGoals(),
  });

  const hasFetched = !isLoading && !isError;
  const list =
    hasFetched && Array.isArray(goals) && goals.length === 0
      ? []
      : (goals && goals.length > 0)
        ? goals.map((g) => ({
        id: g.id,
        title: g.title ?? g.type ?? g.id,
        progress: g.current ?? 0,
        target: g.target ?? 1,
        countsWhen: g.counts_when ?? 'Progress counts when the action is completed and confirmed.',
        rewardPreview: g.reward_preview ?? 'Complete to unlock rewards.',
        detailHref: `/cleaner/goals/${g.id}`,
        actionHref: '/cleaner/jobs',
      }))
        : PLACEHOLDER_GOALS;

  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <a href="/cleaner" className="text-sm font-medium text-gray-600 hover:text-gray-900 mb-2 inline-block">← Back to home</a>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Goals</h1>
          <p className="text-gray-600 mb-6">
            Core, stretch, and maintenance goals. Filters: Level, Type, Almost complete.
          </p>

          {isLoading && (
            <p className="text-gray-500 text-sm mb-4">Loading goals…</p>
          )}
          {isError && goals?.length === 0 && (
            <p className="text-amber-600 text-sm mb-4">Could not load goals. Showing sample.</p>
          )}

          {list.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
              <p className="text-gray-600 mb-2">No goals for your current level yet.</p>
              <p className="text-sm text-gray-500">Complete jobs and level up to see new goals.</p>
              <Link href="/cleaner/progress" className="mt-4 inline-block text-sm font-medium" style={{ color: 'var(--brand-blue)' }}>
                View your progress
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {list.map((goal) => (
                <GoalCard
                  key={goal.id}
                  id={goal.id}
                  title={goal.title}
                  progress={goal.progress}
                  target={goal.target}
                  countsWhen={goal.countsWhen}
                  rewardPreview={goal.rewardPreview}
                  detailHref={goal.detailHref}
                  actionHref={goal.actionHref}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function GoalsListPage() {
  return (
    <ProtectedRoute requiredRole="cleaner">
      <GoalsListContent />
    </ProtectedRoute>
  );
}
