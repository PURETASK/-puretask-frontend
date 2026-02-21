'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import type { DataTableColumn } from '@/components/ui/DataTable';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { gamificationAdminService, type AdminChoiceRow } from '@/services/gamificationAdmin.service';

const placeholderChoices: AdminChoiceRow[] = [
  { id: 'c1', title: 'Level 4 completion reward', reward_ids: ['r1', 'r2'], eligibility_window_days: 14, enabled: true, updated_at: '2026-02-10T12:00:00Z' },
];

export default function AdminChoicesPage() {
  const { data: apiChoices } = useQuery({
    queryKey: ['admin', 'gamification', 'choices'],
    queryFn: () => gamificationAdminService.getChoices(),
  });
  const choices = (apiChoices && apiChoices.length > 0 ? apiChoices : placeholderChoices) as AdminChoiceRow[];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const columns: DataTableColumn<AdminChoiceRow>[] = [
    { key: 'id', label: 'ID', render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
    { key: 'title', label: 'Title', sortable: true },
    {
      key: 'reward_ids',
      label: 'Options',
      render: (v) => (Array.isArray(v) ? v.length : 0),
    },
    { key: 'eligibility_window_days', label: 'Window (days)', render: (v) => (v != null ? String(v) : '—') },
    { key: 'expires_at', label: 'Expires', render: (v) => (v ? new Date(v).toLocaleDateString() : '—') },
    {
      key: 'enabled',
      label: 'Enabled',
      render: (v) => <span className={v ? 'text-green-600 font-medium' : 'text-gray-500'}>{v ? 'Yes' : 'No'}</span>,
    },
    { key: 'updated_at', label: 'Updated', render: (v) => (v ? new Date(v).toLocaleDateString() : '—') },
  ];

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <Link href="/admin/gamification" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
              ← Gamification Overview
            </Link>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Choice Reward Groups</h1>
                <p className="text-gray-600 mt-1">Define &quot;choose 1 of these&quot;, eligibility window, expiry.</p>
              </div>
              <Link href="/admin/gamification/choices/new">
                <Button variant="primary" size="sm" className="inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create choice group
                </Button>
              </Link>
            </div>

            {choices.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600">No choice groups yet.</p>
                  <Link href="/admin/gamification/choices/new">
                    <Button variant="primary" size="sm" className="mt-4">Create choice group</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <DataTable<AdminChoiceRow>
                columns={columns}
                data={choices}
                keyField="id"
                onRowClick={(row) => setSelectedId(row.id)}
                emptyMessage="No choice groups. Create one to get started."
              />
            )}

            {selectedId && (
              <div className="mt-4 flex gap-2">
                <Link href={`/admin/gamification/choices/${selectedId}`}>
                  <Button variant="primary" size="sm">Edit</Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => setSelectedId(null)}>Clear selection</Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
