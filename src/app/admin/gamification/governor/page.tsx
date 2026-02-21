'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import type { DataTableColumn } from '@/components/ui/DataTable';
import { RefreshCw, Lock, RotateCcw, History } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { gamificationAdminService } from '@/services/gamificationAdmin.service';

type GovernorRow = {
  region: string;
  supply_score: number;
  demand_score: number;
  fill_time_hours: number;
  early_exposure_min: number;
  cap_multiplier: number;
  locked: boolean;
};

const placeholderGovernor: GovernorRow[] = [
  { region: 'North', supply_score: 72, demand_score: 85, fill_time_hours: 2.1, early_exposure_min: 10, cap_multiplier: 1.0, locked: false },
  { region: 'South', supply_score: 58, demand_score: 90, fill_time_hours: 3.5, early_exposure_min: 15, cap_multiplier: 1.2, locked: false },
  { region: 'Central', supply_score: 80, demand_score: 78, fill_time_hours: 1.8, early_exposure_min: 5, cap_multiplier: 0.9, locked: true },
];

export default function AdminGovernorPage() {
  const { data: governorData } = useQuery({
    queryKey: ['admin', 'gamification', 'governor'],
    queryFn: () => gamificationAdminService.getGovernor(),
  });
  const [regionFilter, setRegionFilter] = useState<string>('');

  const rows: GovernorRow[] = (() => {
    if (Array.isArray(governorData)) return governorData as GovernorRow[];
    if (governorData && typeof governorData === 'object' && 'regions' in governorData) return (governorData as { regions: GovernorRow[] }).regions;
    return placeholderGovernor;
  })();
  const filtered = regionFilter ? rows.filter((r) => r.region.toLowerCase().includes(regionFilter.toLowerCase())) : rows;

  const columns: DataTableColumn<GovernorRow>[] = [
    { key: 'region', label: 'Region', sortable: true },
    { key: 'supply_score', label: 'Supply', sortable: true },
    { key: 'demand_score', label: 'Demand', sortable: true },
    { key: 'fill_time_hours', label: 'Fill time (h)', sortable: true },
    { key: 'early_exposure_min', label: 'Early exposure (min)' },
    { key: 'cap_multiplier', label: 'Cap multiplier' },
    {
      key: 'locked',
      label: 'Locked',
      render: (v) => (v ? <span className="text-amber-600 font-medium">Yes</span> : 'No'),
    },
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
                <h1 className="text-2xl font-bold text-gray-900">Marketplace Health Governor</h1>
                <p className="text-gray-600 mt-1">Supply/demand per region, fill time, multipliers and caps. Apply recommended changes or manual overrides.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" className="inline-flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Apply recommended
                </Button>
                <Button variant="outline" size="sm" className="inline-flex items-center gap-2">
                  Lock region
                </Button>
                <Button variant="outline" size="sm" className="inline-flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset overrides
                </Button>
                <Button variant="outline" size="sm" className="inline-flex items-center gap-2">
                  <History className="h-4 w-4" />
                  History
                </Button>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Current state by region</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable<GovernorRow>
                  columns={columns}
                  data={filtered}
                  keyField="region"
                  emptyMessage="No governor data. Backend may not be configured yet."
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
