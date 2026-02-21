'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import type { DataTableColumn } from '@/components/ui/DataTable';
import { Plus, DollarSign, Link2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { gamificationAdminService, type AdminRewardRow } from '@/services/gamificationAdmin.service';

const placeholderRewards: AdminRewardRow[] = [
  { id: 'r1', kind: 'visibility', name: 'Priority Visibility', duration_days: 14, stacking: 'replace', permanent: false, enabled: true, updated_at: '2026-02-10' },
  { id: 'r2', kind: 'cash', name: 'Bonus $10', duration_days: undefined, usage_limit: 1, stacking: 'none', permanent: false, enabled: true, updated_at: '2026-02-09' },
  { id: 'r3', kind: 'badge', name: 'Level 5 Badge', permanent: true, enabled: true, updated_at: '2026-02-01' },
];

export default function AdminRewardsPage() {
  const { data: apiRewards } = useQuery({
    queryKey: ['admin', 'gamification', 'rewards'],
    queryFn: () => gamificationAdminService.getRewards(),
  });
  const rewards = (apiRewards && apiRewards.length > 0 ? apiRewards : placeholderRewards) as AdminRewardRow[];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const columns: DataTableColumn<AdminRewardRow>[] = [
    { key: 'id', label: 'ID', render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'kind', label: 'Kind', sortable: true },
    { key: 'duration_days', label: 'Duration (days)', render: (v) => v != null ? String(v) : '—' },
    { key: 'usage_limit', label: 'Uses', render: (v) => v != null ? String(v) : '—' },
    { key: 'stacking', label: 'Stacking' },
    {
      key: 'permanent',
      label: 'Permanent',
      render: (v) => (v ? 'Yes' : 'No'),
    },
    {
      key: 'enabled',
      label: 'Enabled',
      render: (v) => <span className={v ? 'text-green-600 font-medium' : 'text-gray-500'}>{v ? 'Yes' : 'No'}</span>,
    },
    { key: 'updated_at', label: 'Updated', sortable: true },
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
                <h1 className="text-2xl font-bold text-gray-900">Rewards Manager</h1>
                <p className="text-gray-600 mt-1">Edit reward definitions, durations/uses, stacking, attach to goals, set budget caps.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" className="inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create reward
                </Button>
                <Button variant="outline" size="sm" className="inline-flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  Attach to goal
                </Button>
                <Button variant="outline" size="sm" className="inline-flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Set budget cap
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <DataTable<AdminRewardRow>
                  columns={columns}
                  data={rewards}
                  keyField="id"
                  onRowClick={(row) => setSelectedId(row.id)}
                  emptyMessage="No rewards. Create one to get started."
                />
                {selectedId && (
                  <div className="p-3 border-t flex gap-2">
                    <Link href={`/admin/gamification/rewards/${selectedId}`}>
                      <Button variant="primary" size="sm">Edit reward</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
