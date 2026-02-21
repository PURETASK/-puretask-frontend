'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RewardCard, ChoiceRewardModal } from '@/components/gamification';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cleanerGamificationService } from '@/services/cleanerGamification.service';
import type { CleanerChoiceEligible } from '@/services/cleanerGamification.service';

const TABS = ['Active', 'Earned', 'Locked', 'Choice'] as const;

function RewardsCenterContent() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Active');
  const [choiceModalOpen, setChoiceModalOpen] = useState(false);
  const [selectedChoiceGroup, setSelectedChoiceGroup] = useState<CleanerChoiceEligible | null>(null);
  const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: rewardsData, isLoading, isError } = useQuery({
    queryKey: ['cleaner', 'rewards'],
    queryFn: () => cleanerGamificationService.getRewards(),
  });

  const { mutate: selectReward, isPending: selectingReward } = useMutation({
    mutationFn: ({ choiceGroupId, rewardId }: { choiceGroupId: string; rewardId: string }) =>
      cleanerGamificationService.selectChoiceReward(choiceGroupId, rewardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cleaner', 'rewards'] });
      queryClient.invalidateQueries({ queryKey: ['cleaner', 'progress'] });
      setChoiceModalOpen(false);
      setSelectedChoiceGroup(null);
      setSelectedRewardId(null);
    },
  });

  const activeRewards = rewardsData?.active_rewards ?? [];
  const rewardHistory = rewardsData?.reward_history ?? [];
  const choiceEligible = rewardsData?.choice_eligible ?? [];

  const activeCards = activeRewards.length > 0
    ? activeRewards.map((r) => ({
        id: r.reward_id,
        name: r.name,
        effect: r.effect ?? 'Active reward',
        appliesTo: r.applies_to ?? 'All regions',
        daysRemaining: r.days_remaining ?? 0,
        variant: 'active' as const,
      }))
    : [
        { id: 'r1', name: 'Priority Visibility', effect: 'Early exposure +10 min for 14 days', appliesTo: 'All regions', daysRemaining: 7, variant: 'active' as const },
      ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Rewards Center</h1>
          <p className="text-gray-600 mb-6">
            Active rewards, earned history, locked (coming soon), and choice rewards.
          </p>

          <div className="flex gap-2 border-b border-gray-200 mb-6">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {isLoading && <p className="text-gray-500 text-sm mb-4">Loading rewards…</p>}
          {isError && <p className="text-amber-600 text-sm mb-4">Could not load rewards. Showing sample where available.</p>}

          {tab === 'Active' && (
            <>
              {activeCards.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
                  <p className="text-gray-600">No active rewards right now.</p>
                  <p className="text-sm text-gray-500 mt-1">Complete goals to unlock rewards.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeCards.map((r) => (
                    <RewardCard
                      key={r.id}
                      id={r.id}
                      name={r.name}
                      effect={r.effect}
                      appliesTo={r.appliesTo}
                      daysRemaining={r.daysRemaining}
                      variant={r.variant}
                    />
                  ))}
                </div>
              )}
            </>
          )}
          {tab === 'Earned' && (
            <>
              {rewardHistory.length === 0 ? (
                <p className="text-sm text-gray-500">No earned rewards history yet.</p>
              ) : (
                <ul className="space-y-3">
                  {rewardHistory.map((h) => (
                    <li key={`${h.reward_id}-${h.granted_at}`} className="rounded-lg border border-gray-200 bg-white p-4">
                      <p className="font-medium text-gray-900">{h.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Granted {new Date(h.granted_at).toLocaleDateString()}{h.trigger ? ` · ${h.trigger}` : ''}</p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
          {tab === 'Locked' && (
            <p className="text-sm text-gray-500">Locked rewards — complete goals to unlock. (List from API when available.)</p>
          )}
          {tab === 'Choice' && (
            <>
              {choiceEligible.length === 0 ? (
                <p className="text-sm text-gray-500">No choice rewards available right now. Complete a level or goal to become eligible.</p>
              ) : (
                <div className="space-y-4">
                  {choiceEligible.map((c) => (
                    <div key={c.choice_group_id} className="rounded-lg border border-gray-200 bg-white p-4">
                      <p className="font-medium text-gray-900">{c.title}</p>
                      <p className="text-sm text-gray-600 mt-1">Choose one reward:</p>
                      <ul className="mt-2 space-y-1">
                        {c.reward_options.map((opt) => (
                          <li key={opt.reward_id} className="text-sm text-gray-700">{opt.name}{opt.effect ? ` — ${opt.effect}` : ''}</li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedChoiceGroup(c);
                          setSelectedRewardId(null);
                          setChoiceModalOpen(true);
                        }}
                        className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Select reward
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <ChoiceRewardModal
            open={choiceModalOpen}
            onClose={() => { setChoiceModalOpen(false); setSelectedChoiceGroup(null); setSelectedRewardId(null); }}
            title={selectedChoiceGroup?.title ?? 'Choose your reward'}
            subtitle="Pick one reward from this group. Your choice will be granted immediately."
            options={selectedChoiceGroup?.reward_options.map((o) => ({ id: o.reward_id, name: o.name, effect: o.effect ?? '' })) ?? []}
            selectedId={selectedRewardId}
            onSelect={setSelectedRewardId}
            onConfirm={() => selectedChoiceGroup && selectedRewardId && selectReward({ choiceGroupId: selectedChoiceGroup.choice_group_id, rewardId: selectedRewardId })}
            confirmLabel="Grant reward"
            isLoading={selectingReward}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function RewardsCenterPage() {
  return (
    <ProtectedRoute requiredRole="cleaner">
      <RewardsCenterContent />
    </ProtectedRoute>
  );
}
