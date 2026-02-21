'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationAdminService, type AdminRewardRow } from '@/services/gamificationAdmin.service';
import { ArrowLeft, Save } from 'lucide-react';

export default function AdminRewardEditPage() {
  const params = useParams();
  const rewardId = params.rewardId as string;
  const queryClient = useQueryClient();

  const { data: reward, isLoading } = useQuery({
    queryKey: ['admin', 'gamification', 'rewards', rewardId],
    queryFn: () => gamificationAdminService.getReward(rewardId),
    enabled: !!rewardId,
  });

  const [form, setForm] = useState<Partial<AdminRewardRow>>({
    kind: 'visibility',
    name: '',
    duration_days: undefined,
    usage_limit: undefined,
    stacking: 'replace',
    permanent: false,
    enabled: true,
  });

  React.useEffect(() => {
    if (reward) {
      setForm({
        kind: reward.kind,
        name: reward.name ?? '',
        duration_days: reward.duration_days,
        usage_limit: reward.usage_limit,
        stacking: reward.stacking ?? 'replace',
        permanent: reward.permanent ?? false,
        enabled: reward.enabled,
      });
    }
  }, [reward]);

  const { mutate: updateReward, isPending: saving } = useMutation({
    mutationFn: (payload: Partial<AdminRewardRow>) => gamificationAdminService.updateReward(rewardId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gamification', 'rewards'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'gamification', 'rewards', rewardId] });
    },
  });

  const handleSave = () => {
    updateReward(form);
  };

  if (isLoading || !rewardId) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1 py-8 px-6">
            <div className="max-w-2xl mx-auto">
              <p className="text-gray-500">Loading reward...</p>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (!reward) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1 py-8 px-6">
            <div className="max-w-2xl mx-auto">
              <p className="text-gray-500 mb-4">Reward not found. It may not exist yet in the backend.</p>
              <Link href="/admin/gamification/rewards" className="text-blue-600 hover:underline">
                ← Back to Rewards
              </Link>
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
          <div className="max-w-2xl mx-auto">
            <Link
              href="/admin/gamification/rewards"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4"
            >
              <ArrowLeft className="h-4 w-4" /> Gamification Rewards
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit reward: {reward.name || rewardId}</h1>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input
                    value={form.name ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Priority Visibility"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kind</label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={form.kind ?? 'visibility'}
                    onChange={(e) => setForm((p) => ({ ...p, kind: e.target.value }))}
                  >
                    <option value="visibility">Visibility</option>
                    <option value="cash">Cash</option>
                    <option value="badge">Badge</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                    <Input
                      type="number"
                      min={0}
                      value={form.duration_days ?? ''}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          duration_days: e.target.value === '' ? undefined : parseInt(e.target.value, 10),
                        }))
                      }
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usage limit</label>
                    <Input
                      type="number"
                      min={0}
                      value={form.usage_limit ?? ''}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          usage_limit: e.target.value === '' ? undefined : parseInt(e.target.value, 10),
                        }))
                      }
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stacking</label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    value={form.stacking ?? 'replace'}
                    onChange={(e) => setForm((p) => ({ ...p, stacking: e.target.value }))}
                  >
                    <option value="replace">Replace</option>
                    <option value="stack">Stack</option>
                    <option value="none">None</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="permanent"
                    checked={form.permanent ?? false}
                    onChange={(e) => setForm((p) => ({ ...p, permanent: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="permanent" className="text-sm font-medium text-gray-700">Permanent</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={form.enabled ?? true}
                    onChange={(e) => setForm((p) => ({ ...p, enabled: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="enabled" className="text-sm font-medium text-gray-700">Enabled</label>
                </div>
              </CardContent>
            </Card>

            <Button variant="primary" onClick={handleSave} isLoading={saving} className="inline-flex items-center gap-2">
              <Save className="h-4 w-4" /> Save
            </Button>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
