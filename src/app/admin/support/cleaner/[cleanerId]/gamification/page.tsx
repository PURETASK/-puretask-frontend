'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LevelBadge } from '@/components/gamification';
import {
  gamificationAdminService,
  type SupportGamificationResponse,
} from '@/services/gamificationAdmin.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/contexts/ToastContext';
import {
  RefreshCw,
  Gift,
  Trash2,
  Copy,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

const placeholderData: SupportGamificationResponse = {
  cleaner_id: '',
  current_level: 4,
  level_label: 'Trusted Pro',
  progress_paused: false,
  progress_paused_reason: null,
  core_completion_percent: 72,
  stretch_selected: true,
  maintenance_ok: true,
  goal_progress: [
    { goal_id: 'g1', title: 'Complete 45 add-ons', current: 27, target: 45, window: 'last_30_days', status: 'in_progress' },
    { goal_id: 'g2', title: 'On-time rate ≥ 90%', current: 92, target: 90, window: 'last_30_days', status: 'completed' },
  ],
  active_rewards: [
    { reward_id: 'r1', name: 'Priority Visibility', granted_at: '2026-02-01T00:00:00Z', expires_at: '2026-02-15T00:00:00Z' },
  ],
  reward_grant_history: [
    { reward_id: 'r1', name: 'Priority Visibility', granted_at: '2026-02-01T00:00:00Z', trigger: 'goal_completed', goal_id: 'g2' },
  ],
  computed_metrics_debug: {
    on_time_rate_last_30: 0.92,
    acceptance_rate_non_good_faith: 0.88,
    add_on_completions_in_window: 27,
    dispute_free_jobs_in_window: 12,
  },
  support_explanation:
    'Level 4 (Trusted Pro). Core 72% complete. Stretch selected. Maintenance OK. Progress not paused. Active reward: Priority Visibility until 2026-02-15.',
};

export default function SupportCleanerGamificationPage() {
  const params = useParams();
  const cleanerId = (params?.cleanerId as string) || '';
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [grantRewardId, setGrantRewardId] = useState('');
  const [grantReason, setGrantReason] = useState('');
  const [removeRewardId, setRemoveRewardId] = useState('');
  const [removeReason, setRemoveReason] = useState('');

  const { data: apiData, isLoading } = useQuery({
    queryKey: ['admin', 'support', 'gamification', cleanerId],
    queryFn: () => gamificationAdminService.getSupportGamification(cleanerId),
    enabled: !!cleanerId,
  });

  const data: SupportGamificationResponse = apiData
    ? { ...placeholderData, ...apiData, cleaner_id: cleanerId }
    : { ...placeholderData, cleaner_id: cleanerId };

  const { mutate: recompute, isPending: recomputing } = useMutation({
    mutationFn: () => gamificationAdminService.recomputeSupportGamification(cleanerId),
    onSuccess: (result) => {
      if (result) queryClient.setQueryData(['admin', 'support', 'gamification', cleanerId], result);
      queryClient.invalidateQueries({ queryKey: ['admin', 'support', 'gamification', cleanerId] });
      showToast('Recompute requested.', 'success');
    },
    onError: () => showToast('Recompute failed. Backend may not support this yet.', 'error'),
  });

  const { mutate: grantReward, isPending: granting } = useMutation({
    mutationFn: () =>
      gamificationAdminService.grantSupportReward(cleanerId, {
        reward_id: grantRewardId,
        reason: grantReason || undefined,
        duration_days: 7,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'support', 'gamification', cleanerId] });
      setGrantRewardId('');
      setGrantReason('');
      showToast('Reward granted.', 'success');
    },
    onError: () => showToast('Grant failed. Backend may not support this yet.', 'error'),
  });

  const { mutate: removeReward, isPending: removing } = useMutation({
    mutationFn: () =>
      gamificationAdminService.removeSupportReward(cleanerId, {
        reward_id: removeRewardId,
        reason: removeReason || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'support', 'gamification', cleanerId] });
      setRemoveRewardId('');
      setRemoveReason('');
      showToast('Reward removed.', 'success');
    },
    onError: () => showToast('Remove failed. Backend may not support this yet.', 'error'),
  });

  const handleCopyExplanation = () => {
    const text = data.support_explanation || 'No explanation available.';
    navigator.clipboard.writeText(text).then(
      () => showToast('Support explanation copied to clipboard.', 'success'),
      () => showToast('Copy failed.', 'error')
    );
  };

  if (isLoading && !apiData) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1 py-8 px-6">
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-500">Loading...</p>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/admin/gamification"
              className="inline-block text-sm text-blue-600 hover:underline mb-4"
            >
              ← Gamification
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Support: Cleaner {cleanerId} — Gamification
            </h1>
            <p className="text-gray-600 mb-6">
              Goal progress, why paused, reward history. Recompute, grant/remove reward (guarded), copy explanation.
            </p>

            {/* Summary + Copy */}
            <Card className="mb-6">
              <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <LevelBadge level={data.current_level} label={data.level_label} size="lg" />
                  {data.progress_paused ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                      <AlertTriangle className="h-4 w-4" /> Progress paused
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                      <CheckCircle className="h-4 w-4" /> OK
                    </span>
                  )}
                  {typeof data.core_completion_percent === 'number' && (
                    <span className="text-sm text-gray-600">
                      Core: {data.core_completion_percent}%
                    </span>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={handleCopyExplanation} className="inline-flex items-center gap-2">
                  <Copy className="h-4 w-4" /> Copy support explanation
                </Button>
              </CardContent>
            </Card>

            {/* Why paused */}
            {data.progress_paused && data.progress_paused_reason && (
              <Card className="mb-6 border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="text-amber-900">Why progress is paused</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-800">{data.progress_paused_reason}</p>
                </CardContent>
              </Card>
            )}

            {/* Goal progress */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Goal progress (raw)</CardTitle>
              </CardHeader>
              <CardContent>
                {data.goal_progress && data.goal_progress.length > 0 ? (
                  <ul className="space-y-2">
                    {data.goal_progress.map((g) => (
                      <li
                        key={g.goal_id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
                      >
                        <span className="font-medium text-gray-900">{g.title}</span>
                        <span className="text-sm text-gray-600">
                          {g.current} / {g.target} {g.window && `(${g.window})`} — {g.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No goal progress data.</p>
                )}
              </CardContent>
            </Card>

            {/* Active rewards */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Active rewards</CardTitle>
              </CardHeader>
              <CardContent>
                {data.active_rewards && data.active_rewards.length > 0 ? (
                  <ul className="space-y-2">
                    {data.active_rewards.map((r) => (
                      <li
                        key={r.reward_id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
                      >
                        <span className="font-medium text-gray-900">{r.name}</span>
                        <span className="text-xs text-gray-500">
                          until {r.expires_at ? new Date(r.expires_at).toLocaleDateString() : '—'}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No active rewards.</p>
                )}
              </CardContent>
            </Card>

            {/* Reward grant history */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Reward grant history</CardTitle>
              </CardHeader>
              <CardContent>
                {data.reward_grant_history && data.reward_grant_history.length > 0 ? (
                  <ul className="space-y-2">
                    {data.reward_grant_history.map((r, i) => (
                      <li
                        key={`${r.reward_id}-${i}`}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-sm"
                      >
                        <span className="font-medium text-gray-900">{r.name}</span>
                        <span className="text-gray-500">
                          {new Date(r.granted_at).toLocaleString()}
                          {r.trigger && ` · ${r.trigger}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No history.</p>
                )}
              </CardContent>
            </Card>

            {/* Computed metrics debug */}
            {data.computed_metrics_debug && Object.keys(data.computed_metrics_debug).length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Computed metrics (debug)</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(data.computed_metrics_debug).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <dt className="text-gray-600">{k}</dt>
                        <dd className="font-mono text-gray-900">{typeof v === 'number' ? v.toFixed(2) : String(v)}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Actions (guarded)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => recompute()}
                    isLoading={recomputing}
                    className="inline-flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" /> Recompute now
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Grant reward manually</p>
                  <div className="flex flex-wrap gap-2 items-end">
                    <input
                      type="text"
                      placeholder="Reward ID"
                      value={grantRewardId}
                      onChange={(e) => setGrantRewardId(e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-40"
                    />
                    <input
                      type="text"
                      placeholder="Reason (optional)"
                      value={grantReason}
                      onChange={(e) => setGrantReason(e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-48"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => grantRewardId && grantReward()}
                      disabled={!grantRewardId}
                      isLoading={granting}
                      className="inline-flex items-center gap-2"
                    >
                      <Gift className="h-4 w-4" /> Grant
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Remove reward</p>
                  <div className="flex flex-wrap gap-2 items-end">
                    <input
                      type="text"
                      placeholder="Reward ID"
                      value={removeRewardId}
                      onChange={(e) => setRemoveRewardId(e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-40"
                    />
                    <input
                      type="text"
                      placeholder="Reason (optional)"
                      value={removeReason}
                      onChange={(e) => setRemoveReason(e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-48"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeRewardId && removeReward()}
                      disabled={!removeRewardId}
                      isLoading={removing}
                      className="inline-flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
