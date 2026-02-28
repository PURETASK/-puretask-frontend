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
import { gamificationAdminService, type AdminChoiceRow } from '@/services/gamificationAdmin.service';
import { ArrowLeft, Save } from 'lucide-react';

export default function AdminChoiceEditPage() {
  const params = useParams();
  const choiceId = params.choiceId as string;
  const queryClient = useQueryClient();

  const { data: choice, isLoading } = useQuery({
    queryKey: ['admin', 'gamification', 'choices', choiceId],
    queryFn: () => gamificationAdminService.getChoice(choiceId),
    enabled: !!choiceId && choiceId !== 'new',
  });

  const [form, setForm] = useState<Partial<AdminChoiceRow>>({
    title: '',
    reward_ids: [],
    eligibility_window_days: 14,
    expires_at: '',
    enabled: true,
  });

  React.useEffect(() => {
    if (choice) {
      setForm({
        title: choice.title,
        reward_ids: choice.reward_ids ?? [],
        eligibility_window_days: choice.eligibility_window_days ?? 14,
        expires_at: choice.expires_at ?? '',
        enabled: choice.enabled,
      });
    }
  }, [choice]);

  const { mutate: updateChoice, isPending: saving } = useMutation({
    mutationFn: (payload: Partial<AdminChoiceRow>) => gamificationAdminService.updateChoice(choiceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gamification', 'choices'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'gamification', 'choices', choiceId] });
    },
  });

  const handleSave = () => {
    updateChoice(form);
  };

  if (isLoading || !choiceId) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1 py-8 px-6">
            <div className="max-w-2xl mx-auto">
              <p className="text-gray-500">Loading choice group...</p>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (!choice) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1 py-8 px-6">
            <div className="max-w-2xl mx-auto">
              <p className="text-gray-500 mb-4">Choice group not found.</p>
              <Link href="/admin/gamification/choices" className="text-blue-600 hover:underline">
                ← Back to Choice Groups
              </Link>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen flex flex-col bg-app">
        <Header />
        <main className="flex-1 py-8 px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <Link href="/admin/gamification/choices" className="inline-flex items-center gap-1 text-sm font-medium mb-4" style={{ color: 'var(--brand-blue)' }}>
              <ArrowLeft className="h-4 w-4" /> Back to Choice Groups
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Choice Group</h1>

            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Title"
                  value={form.title ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Level 4 completion reward"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reward IDs (comma-separated)</label>
                  <Input
                    value={Array.isArray(form.reward_ids) ? form.reward_ids.join(', ') : ''}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        reward_ids: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      }))
                    }
                    placeholder="r1, r2, r3"
                  />
                </div>
                <Input
                  label="Eligibility window (days)"
                  type="number"
                  value={form.eligibility_window_days ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, eligibility_window_days: e.target.value ? Number(e.target.value) : undefined }))}
                  placeholder="14"
                />
                <Input
                  label="Expires at (ISO date)"
                  value={form.expires_at ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value || undefined }))}
                  placeholder="2026-03-01T00:00:00Z"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={form.enabled ?? true}
                    onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="enabled" className="text-sm font-medium text-gray-700">Enabled</label>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2 mt-6">
              <Button variant="primary" onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2">
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Link href="/admin/gamification/choices">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
