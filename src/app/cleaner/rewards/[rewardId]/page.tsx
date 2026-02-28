'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import { cleanerGamificationService } from '@/services/cleanerGamification.service';
import { CountdownPill } from '@/components/gamification';

function RewardDetailContent() {
  const params = useParams();
  const rewardId = params.rewardId as string;

  const { data: rewardsData } = useQuery({
    queryKey: ['cleaner', 'rewards'],
    queryFn: () => cleanerGamificationService.getRewards(),
    enabled: !!rewardId,
  });

  const active = rewardsData?.active_rewards?.find((r) => r.reward_id === rewardId);
  const fromHistory = rewardsData?.reward_history?.find((r) => r.reward_id === rewardId);
  const reward = active ?? fromHistory;
  const name = active?.name ?? fromHistory?.name ?? `Reward ${rewardId}`;
  const effect = active?.effect ?? fromHistory?.effect ?? '—';
  const appliesTo = active?.applies_to ?? 'All regions';
  const daysRemaining = active?.days_remaining ?? 0;
  const grantedAt = fromHistory?.granted_at;

  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/cleaner/rewards" className="text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 inline-block">← Back to Rewards</Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Reward Details</h1>
          <p className="text-gray-600 mb-6">What this reward does and where it applies.</p>

          <Card className="rounded-2xl border-gray-200">
            <CardHeader>
              <CardTitle>{name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Effect</p>
                <p className="text-gray-900">{effect}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Applies to</p>
                <p className="text-gray-900">{appliesTo}</p>
              </div>
              {active && daysRemaining > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Time remaining</p>
                  <CountdownPill daysRemaining={daysRemaining} variant="default" />
                </div>
              )}
              {grantedAt && !active && (
                <p className="text-sm text-gray-500">Granted {new Date(grantedAt).toLocaleDateString()}</p>
              )}
              {!reward && (
                <p className="text-sm text-gray-500">This reward may be locked or no longer active. Check the Rewards center for current offers.</p>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 flex gap-2">
            <Link href="/cleaner/rewards">
              <Button variant="primary">Back to Rewards Center</Button>
            </Link>
            <Link href="/cleaner/goals">
              <Button variant="outline">View Goals</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function RewardDetailPage() {
  return (
    <ProtectedRoute requiredRole="cleaner">
      <RewardDetailContent />
    </ProtectedRoute>
  );
}
