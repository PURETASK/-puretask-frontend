'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import type { DataTableColumn } from '@/components/ui/DataTable';
import { AlertTriangle, UserX, FileSearch, MessageSquareOff } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { gamificationAdminService } from '@/services/gamificationAdmin.service';

type AbuseRow = {
  id: string;
  cleaner_id: string;
  cleaner_name: string;
  type: 'spam_messages' | 'login_farming' | 'photo_timestamp' | 'decline_abuse';
  severity: 'low' | 'medium' | 'high';
  detail: string;
  detected_at: string;
};

const placeholderAbuse: AbuseRow[] = [
  { id: 'a1', cleaner_id: 'c1', cleaner_name: 'Jane D.', type: 'spam_messages', severity: 'medium', detail: 'High message volume, similar content', detected_at: '2026-02-13T10:00:00Z' },
  { id: 'a2', cleaner_id: 'c2', cleaner_name: 'Bob M.', type: 'photo_timestamp', severity: 'high', detail: 'After photo timestamp before job end', detected_at: '2026-02-12T14:30:00Z' },
  { id: 'a3', cleaner_id: 'c3', cleaner_name: 'Alice K.', type: 'decline_abuse', severity: 'low', detail: 'Decline rate above good-faith cap (window)', detected_at: '2026-02-11T09:00:00Z' },
];

export default function AdminAbusePage() {
  const [tab, setTab] = useState<'all' | 'spam_messages' | 'login_farming' | 'photo_timestamp' | 'decline_abuse'>('all');
  const { data: abuseData } = useQuery({
    queryKey: ['admin', 'gamification', 'abuse', tab],
    queryFn: () => gamificationAdminService.getAbuseSignals({ type: tab === 'all' ? undefined : tab }),
  });
  const items = (abuseData?.items ?? placeholderAbuse) as AbuseRow[];
  const [selectedRow, setSelectedRow] = useState<AbuseRow | null>(null);

  const columns: DataTableColumn<AbuseRow>[] = [
    { key: 'cleaner_name', label: 'Cleaner', sortable: true },
    { key: 'type', label: 'Type', sortable: true, render: (v) => String(v).replace(/_/g, ' ') },
    {
      key: 'severity',
      label: 'Severity',
      sortable: true,
      render: (v) => (
        <span
          className={
            v === 'high' ? 'text-red-600 font-medium' : v === 'medium' ? 'text-amber-600' : 'text-gray-600'
          }
        >
          {String(v)}
        </span>
      ),
    },
    { key: 'detail', label: 'Detail' },
    { key: 'detected_at', label: 'Detected', sortable: true, render: (v) => new Date(String(v)).toLocaleString() },
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
                <h1 className="text-2xl font-bold text-gray-900">Fraud / Abuse Monitor</h1>
                <p className="text-gray-600 mt-1">Spam patterns, login farming, photo timestamp violations, decline abuse. Pause rewards, require review, open case.</p>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              {(['all', 'spam_messages', 'login_farming', 'photo_timestamp', 'decline_abuse'] as const).map((t) => (
                <Button
                  key={t}
                  variant={tab === t ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setTab(t)}
                >
                  {t === 'all' ? 'All' : t.replace(/_/g, ' ')}
                </Button>
              ))}
            </div>

            <Card>
              <CardContent className="p-0">
                <DataTable<AbuseRow>
                  columns={columns}
                  data={items}
                  keyField="id"
                  onRowClick={setSelectedRow}
                  emptyMessage="No abuse signals in this category."
                />
              </CardContent>
            </Card>

            {selectedRow && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Actions for {selectedRow.cleaner_name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center gap-2"
                    onClick={() => gamificationAdminService.pauseRewardsForCleaner(selectedRow.cleaner_id)}
                  >
                    <UserX className="h-4 w-4" />
                    Pause rewards
                  </Button>
                  <Button variant="outline" size="sm" className="inline-flex items-center gap-2">
                    <FileSearch className="h-4 w-4" />
                    Require manual review
                  </Button>
                  <Button variant="outline" size="sm" className="inline-flex items-center gap-2">
                    <MessageSquareOff className="h-4 w-4" />
                    Disable templates for cleaner
                  </Button>
                  <Button variant="primary" size="sm" className="inline-flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Open case
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}