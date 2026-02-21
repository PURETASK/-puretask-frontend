'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import type { DataTableColumn } from '@/components/ui/DataTable';
import { Plus, Copy, Eye, RotateCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { gamificationAdminService, type AdminGoalRow } from '@/services/gamificationAdmin.service';

const placeholderGoals: AdminGoalRow[] = [
  { id: 'g1', title: 'Complete 30 add-ons', level: 2, type: 'core', target: '30', enabled: true, updated_at: '2026-02-10' },
  { id: 'g2', title: 'On-time rate ≥ 90%', level: 2, type: 'core', target: '90%', enabled: true, updated_at: '2026-02-09' },
  { id: 'g3', title: 'Complete 45 add-ons', level: 4, type: 'core', target: '45', enabled: true, updated_at: '2026-02-08' },
  { id: 'g4', title: 'Stretch: 10 same-day messages', level: 4, type: 'stretch', target: '10', enabled: true, updated_at: '2026-02-07' },
  { id: 'g5', title: 'Maintenance: dispute-free window', level: 4, type: 'maintenance', target: '5 jobs', enabled: true, updated_at: '2026-02-05' },
];

function toGoalRow(g: AdminGoalRow): AdminGoalRow {
  return {
    ...g,
    target: typeof g.target === 'number' ? String(g.target) : g.target,
  };
}

export default function AdminGoalsPage() {
  const { data: apiGoals } = useQuery({
    queryKey: ['admin', 'gamification', 'goals'],
    queryFn: () => gamificationAdminService.getGoals(),
  });
  const goals = (apiGoals && apiGoals.length > 0 ? apiGoals.map(toGoalRow) : placeholderGoals) as AdminGoalRow[];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const columns: DataTableColumn<AdminGoalRow>[] = [
    { key: 'id', label: 'ID', render: (v) => <span className="font-mono text-xs">{String(v)}</span> },
    { key: 'title', label: 'Title', sortable: true },
    { key: 'level', label: 'Level', sortable: true },
    { key: 'type', label: 'Type', sortable: true, render: (v) => <span className="capitalize">{String(v)}</span> },
    { key: 'target', label: 'Target' },
    {
      key: 'enabled',
      label: 'Enabled',
      render: (v) => (
        <span className={v ? 'text-green-600 font-medium' : 'text-gray-500'}>
          {v ? 'Yes' : 'No'}
        </span>
      ),
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
                <h1 className="text-2xl font-bold text-gray-900">Goals Library</h1>
                <p className="text-gray-600 mt-1">Create and edit goals, enable/disable, move levels, bind rewards.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" className="inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create goal
                </Button>
                <Button variant="outline" size="sm" className="inline-flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm" className="inline-flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Rollback version
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <DataTable<AdminGoalRow>
                  columns={columns}
                  data={goals}
                  keyField="id"
                  onRowClick={(row) => setSelectedId(row.id)}
                  emptyMessage="No goals. Create one to get started."
                />
              </CardContent>
            </Card>

            {selectedId && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Preview & edit</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Link href={`/admin/gamification/goals/${selectedId}`}>
                    <Button variant="primary" size="sm" className="inline-flex items-center gap-2">
                      Edit goal
                    </Button>
                  </Link>
                  <Link href={`/cleaner/goals/${selectedId}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="inline-flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Preview as cleaner
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
