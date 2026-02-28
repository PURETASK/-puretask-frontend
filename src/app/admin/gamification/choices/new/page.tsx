'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationAdminService, type AdminChoiceRow } from '@/services/gamificationAdmin.service';
import { ArrowLeft, Save } from 'lucide-react';

export default function AdminChoiceNewPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Partial<AdminChoiceRow>>({
    title: '',
    reward_ids: [],
    eligibility_window_days: 14,
    expires_at: '',
    enabled: true,
  });

  const { mutate: createChoice, isPending: saving } = useMutation({
    mutationFn: (payload: Partial<AdminChoiceRow>) => gamificationAdminService.createChoice(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gamification', 'choices'] });
      if (data?.id) router.push(`/admin/gamification/choices/${data.id}`);
      else router.push('/admin/gamification/choices');
    },
  });

  const handleCreate = () => {
    createChoice(form);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen flex flex-col bg-app">
        <Header />
        <main className="flex-1 py-8 px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <Link href="/admin/gamification/choices" className="inline-flex items-center gap-1 text-sm font-medium mb-4" style={{ color: 'var(--brand-blue)' }}>
              <ArrowLeft className="h-4 w-4" /> Back to Choice Groups
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Choice Group</h1>

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
              <Button variant="primary" onClick={handleCreate} disabled={saving} className="inline-flex items-center gap-2">
                <Save className="h-4 w-4" />
                {saving ? 'Creating...' : 'Create'}
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
