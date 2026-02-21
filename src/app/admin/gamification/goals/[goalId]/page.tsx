'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationAdminService, type AdminGoalRow } from '@/services/gamificationAdmin.service';
import { ArrowLeft, Save, Eye, RotateCcw } from 'lucide-react';

export default function AdminGoalEditPage() {
  const params = useParams();
  const router = useRouter();
  const goalId = params.goalId as string;
  const queryClient = useQueryClient();

  const { data: goal, isLoading } = useQuery({
    queryKey: ['admin', 'gamification', 'goals', goalId],
    queryFn: () => gamificationAdminService.getGoal(goalId),
    enabled: !!goalId,
  });

  const [form, setForm] = useState<Partial<AdminGoalRow>>({
    title: '',
    description: '',
    level: 1,
    type: 'core',
    metric_key: '',
    operator: 'gte',
    target: '',
    window: '',
    enabled: true,
  });

  React.useEffect(() => {
    if (goal) {
      setForm({
        title: goal.title,
        description: goal.description ?? '',
        level: goal.level,
        type: goal.type,
        metric_key: goal.metric_key ?? '',
        operator: goal.operator ?? 'gte',
        target: typeof goal.target === 'number' ? String(goal.target) : goal.target,
        window: goal.window ?? '',
        enabled: goal.enabled,
      });
    }
  }, [goal]);

  const { mutate: updateGoal, isPending: saving } = useMutation({
    mutationFn: (payload: Partial<AdminGoalRow>) => gamificationAdminService.updateGoal(goalId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gamification', 'goals'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'gamification', 'goals', goalId] });
    },
  });

  const handleSave = () => {
    const payload = {
      ...form,
      target: form.target === undefined ? undefined : (isNaN(Number(form.target)) ? form.target : Number(form.target)),
    };
    updateGoal(payload);
  };

  if (isLoading || !goalId) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1 py-8 px-6">
            <div className="max-w-2xl mx-auto">
              <p className="text-gray-500">Loading goal...</p>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (!goal) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1 py-8 px-6">
            <div className="max-w-2xl mx-auto">
              <p className="text-gray-500 mb-4">Goal not found. It may not exist yet in the backend.</p>
              <Link href="/admin/gamification/goals" className="text-blue-600 hover:underline">
                ← Back to Goals
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
              href="/admin/gamification/goals"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4"
            >
              <ArrowLeft className="h-4 w-4" /> Gamification Goals
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit goal: {goal.title}</h1>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <Input
                    value={form.title ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Complete 45 add-ons"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    rows={2}
                    value={form.description ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Optional description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={form.level ?? 1}
                      onChange={(e) => setForm((p) => ({ ...p, level: parseInt(e.target.value, 10) || 1 }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      value={form.type ?? 'core'}
                      onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as AdminGoalRow['type'] }))}
                    >
                      <option value="core">Core</option>
                      <option value="stretch">Stretch</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Metric key</label>
                    <Input
                      value={form.metric_key ?? ''}
                      onChange={(e) => setForm((p) => ({ ...p, metric_key: e.target.value }))}
                      placeholder="e.g. add_on_completions"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
                    <select
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      value={form.operator ?? 'gte'}
                      onChange={(e) => setForm((p) => ({ ...p, operator: e.target.value }))}
                    >
                      <option value="gte">≥</option>
                      <option value="lte">≤</option>
                      <option value="eq">=</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                  <Input
                    value={form.target ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, target: e.target.value }))}
                    placeholder="e.g. 45 or 90%"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Window</label>
                  <Input
                    value={form.window ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, window: e.target.value }))}
                    placeholder="e.g. last_30_days, last_jobs_10"
                  />
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

            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={handleSave} isLoading={saving} className="inline-flex items-center gap-2">
                <Save className="h-4 w-4" /> Save
              </Button>
              <Link href={`/cleaner/goals/${goalId}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="inline-flex items-center gap-2">
                  <Eye className="h-4 w-4" /> Preview as cleaner
                </Button>
              </Link>
              <Button variant="outline" className="inline-flex items-center gap-2">
                <RotateCcw className="h-4 w-4" /> Rollback version
              </Button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
