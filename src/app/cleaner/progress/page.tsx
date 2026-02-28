'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import {
  LevelBadge,
  LevelProgressRing,
  NextBestActionCard,
  RewardCard,
  RewardEffectPill,
  PausedProgressBanner,
} from '@/components/gamification';
import { useQuery } from '@tanstack/react-query';
import { cleanerGamificationService } from '@/services/cleanerGamification.service';
import {
  Target,
  Award,
  Shield,
  ChevronRight,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

const LEVEL_LABELS: Record<number, string> = {
  1: 'Getting Started',
  2: 'Rising Star',
  3: 'Reliable Pro',
  4: 'Trusted Pro',
  5: 'Elite Pro',
  6: 'Expert',
  7: 'Master',
  8: 'Champion',
  9: 'Legend',
  10: 'Elite Champion',
};

export default function ProgressPage() {
  const [visibilityModalOpen, setVisibilityModalOpen] = useState(false);

  const { data: progressData, isLoading: progressLoading, isError: progressError } = useQuery({
    queryKey: ['cleaner', 'progress'],
    queryFn: () => cleanerGamificationService.getProgress(),
  });
  const { data: rewardsData } = useQuery({
    queryKey: ['cleaner', 'rewards'],
    queryFn: () => cleanerGamificationService.getRewards(),
  });
  const { data: badgesData } = useQuery({
    queryKey: ['cleaner', 'badges'],
    queryFn: () => cleanerGamificationService.getBadges(),
  });
  const { data: goalsData } = useQuery({
    queryKey: ['cleaner', 'goals'],
    queryFn: () => cleanerGamificationService.getGoals().then((g) => ({ goals: g ?? [] })),
  });

  const currentLevel = progressData?.current_level ?? 4;
  const levelLabel = progressData?.level_label ?? LEVEL_LABELS[progressData?.current_level ?? 4] ?? `Level ${progressData?.current_level ?? 4}`;
  const coreCompletionPercent = progressData?.core_completion_percent ?? 72;
  const stretchSelected = progressData?.stretch_selected ?? true;
  const maintenanceOk = progressData?.maintenance_ok ?? true;
  const progressPausedReason = progressData?.progress_paused ? (progressData?.progress_paused_reason ?? 'Progress paused') : null;

  const nextBestActions =
    (progressData?.next_best_actions?.length ?? 0) > 0
      ? (progressData?.next_best_actions ?? []).map((a) => ({
          title: a.title,
          description: a.description,
          actionHref: a.action_href ?? '/cleaner/jobs',
          actionLabel: a.action_label ?? 'Take action',
          unlockPreview: a.unlock_preview,
        }))
      : [
          { title: 'Complete 3 more add-ons', description: "You're 3 away from your add-on goal this period.", actionHref: '/cleaner/jobs', actionLabel: 'Take Next Action', unlockPreview: 'unlock Priority Visibility for 7 days' },
          { title: 'Send a post-job message', description: 'Request a review to boost your rating goal.', actionHref: '/cleaner/messages', actionLabel: 'Send Message', unlockPreview: 'counts toward "Meaningful messages" goal' },
        ];

  const activeRewards =
    (progressData?.active_rewards?.length ? progressData.active_rewards : rewardsData?.active_rewards)?.map((r: { reward_id: string; name: string; effect?: string; applies_to?: string; days_remaining?: number }) => ({
      id: r.reward_id,
      name: r.name,
      effect: r.effect ?? 'Active reward',
      appliesTo: r.applies_to ?? 'All regions',
      daysRemaining: r.days_remaining ?? 0,
      variant: 'active' as const,
    })) ?? [
      { id: 'r1', name: 'Priority Visibility', effect: 'Early exposure +10 min for 14 days', appliesTo: 'All regions', daysRemaining: 7, variant: 'active' as const },
    ];

  const recentAchievements =
    badgesData?.filter((b) => b.earned).length
      ? (badgesData ?? []).filter((b) => b.earned).slice(0, 5).map((b) => ({ id: b.id, title: b.name, icon: b.icon ?? '🏅', earnedDate: b.earned_date ?? '' }))
      : [
          { id: 'b1', title: 'On-Time Pro', icon: '⏱️', earnedDate: '2 days ago' },
          { id: 'b2', title: 'Photo Perfect', icon: '📸', earnedDate: '1 week ago' },
        ];

  if (progressLoading && !progressData) {
    return (
      <div className="min-h-screen flex flex-col bg-app">
        <Header />
        <main className="flex-1 py-8 px-4 md:px-6 flex items-center justify-center">
          <p className="text-gray-500">Loading your progress…</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Paused banner when maintenance fails */}
          {progressPausedReason && (
            <PausedProgressBanner
              reason={progressPausedReason}
              recoverySteps={['Do 3 dispute-free jobs', 'Improve on-time over next 10 jobs']}
              onSeeWhatCounts={() => {}}
              onContactSupport={() => (window.location.href = '/support')}
              className="mb-6"
            />
          )}

          {/* Header: Your Progress + LevelBadge + How visibility works */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <a href="/cleaner" className="text-sm font-medium text-gray-600 hover:text-gray-900 mb-2 inline-block">← Back to home</a>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Progress</h1>
                <LevelBadge level={currentLevel} label={levelLabel} size="lg" />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setVisibilityModalOpen(true)}
              className="inline-flex items-center gap-2 text-sm font-medium"
              style={{ color: 'var(--brand-blue)' }}
            >
              <HelpCircle className="h-4 w-4" />
              How visibility works
            </button>
          </div>

          {/* Main top: Progress ring + Core / Stretch / Maintenance */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="rounded-2xl border-gray-200">
              <CardContent className="p-6 flex flex-col items-center">
                <LevelProgressRing
                  percentage={coreCompletionPercent}
                  currentLevel={currentLevel}
                  nextLevel={currentLevel + 1}
                  size={140}
                />
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-gray-200">
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Core completion</p>
                  <Progress value={coreCompletionPercent} max={100} showLabel size="md" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Stretch goal</p>
                  <p className="text-gray-900">
                    {stretchSelected ? (
                      <span className="text-green-600 font-medium">Selected</span>
                    ) : (
                      <span className="text-amber-600">Not selected yet</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Maintenance</p>
                  <p className="text-gray-900">
                    {maintenanceOk ? (
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <Shield className="h-4 w-4" /> Compliant
                      </span>
                    ) : (
                      <span className="text-amber-600">Needs attention</span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-gray-200 card-interactive">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Quick actions</h3>
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/cleaner/progress/level/${currentLevel}`}
                    className="inline-flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    View Level Details
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/cleaner/goals"
                    className="inline-flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View Goals
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/cleaner/rewards"
                    className="inline-flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View Rewards
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/cleaner/badges"
                    className="inline-flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View Badges
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/cleaner/maintenance"
                    className="inline-flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View Maintenance Status
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Best Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Next best actions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {nextBestActions.map((action, i) => (
                <NextBestActionCard
                  key={i}
                  title={action.title}
                  description={action.description}
                  actionHref={action.actionHref}
                  actionLabel={action.actionLabel}
                  unlockPreview={action.unlockPreview}
                />
              ))}
            </div>
          </div>

          {/* Active rewards + Recent achievements */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Active rewards
              </h2>
              <div className="space-y-4">
                {activeRewards.length > 0 ? (
                  activeRewards.map((r) => (
                    <div key={r.id} className="space-y-2">
                      <RewardEffectPill label={r.effect} variant="highlight" />
                      <RewardCard
                        id={r.id}
                        name={r.name}
                        effect={r.effect}
                        appliesTo={r.appliesTo}
                        daysRemaining={r.daysRemaining}
                        variant={r.variant}
                        onViewHowItWorks={() => setVisibilityModalOpen(true)}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No active rewards. Complete goals to unlock.</p>
                )}
              </div>
              <Link href="/cleaner/rewards" className="mt-3 inline-flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--brand-blue)' }}>
                View all rewards
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Recent achievements
              </h2>
              <div className="flex flex-wrap gap-3">
                {recentAchievements.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2"
                  >
                    <span className="text-2xl">{a.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{a.title}</p>
                      <p className="text-xs text-gray-500">{a.earnedDate}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/cleaner/badges" className="mt-3 inline-flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--brand-blue)' }}>
                View all badges
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Legacy goals from API (if any) — keep for backward compatibility */}
          {goalsData?.goals && goalsData.goals.length > 0 && (
            <Card className="mt-8 rounded-2xl border-[var(--brand-mint)]/20" style={{ backgroundColor: 'var(--brand-cloud)' }}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Active goals (from API)</h3>
                <div className="space-y-3">
                  {goalsData.goals.map((goal: { id: string; type?: string; current?: number; target?: number }) => (
                    <div key={goal.id} className="bg-white p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{goal.type ?? goal.id}</span>
                        <span className="text-sm text-gray-600">
                          {goal.current ?? 0} / {goal.target ?? 0}
                        </span>
                      </div>
                      <Progress
                        value={goal.current ?? 0}
                        max={goal.target ?? 1}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />

      {/* Simple visibility explainer modal */}
      {visibilityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setVisibilityModalOpen(false)}>
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">How visibility works</h3>
            <p className="text-sm text-gray-600 mb-4">
              Higher-level cleaners and those with active rewards (like Priority Visibility) appear earlier in client search results. 
              Completing core and stretch goals, staying in good standing with maintenance, and earning rewards all help you get more bookings.
            </p>
            <Button variant="primary" onClick={() => setVisibilityModalOpen(false)}>
              Got it
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
