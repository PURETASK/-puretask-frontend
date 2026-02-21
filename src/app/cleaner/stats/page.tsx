'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import { cleanerGamificationService } from '@/services/cleanerGamification.service';

function StatsContent() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['cleaner', 'stats'],
    queryFn: () => cleanerGamificationService.getStats(),
  });

  const metrics = [
    { label: 'On-time rate (last 30 jobs)', value: stats?.on_time_rate != null ? String(stats.on_time_rate) : '—', tip: "How it's calculated" },
    { label: 'Acceptance rate', value: stats?.acceptance_rate != null ? String(stats.acceptance_rate) : '—', tip: 'Non-good-faith only' },
    { label: 'Photo compliance', value: stats?.photo_compliance != null ? String(stats.photo_compliance) : '—', tip: '' },
    { label: 'Avg rating', value: stats?.avg_rating != null ? String(stats.avg_rating) : '—', tip: '' },
    { label: 'Disputes (opened / lost)', value: stats?.disputes_opened_lost ?? '—', tip: 'Windowed' },
    { label: 'Add-on completion count', value: stats?.add_on_completions != null ? String(stats.add_on_completions) : '—', tip: '' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Stats</h1>
          <p className="text-gray-600 mb-6">
            Trust-building dashboard: on-time rate, acceptance rate, photo compliance, rating, disputes, add-ons.
          </p>

          {isLoading && <p className="text-gray-500 text-sm mb-4">Loading stats…</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metrics.map((m) => (
              <Card key={m.label}>
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-gray-700">{m.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{m.value}</p>
                  {m.tip && (
                    <button type="button" className="text-xs text-blue-600 hover:underline mt-1">
                      {m.tip}
                    </button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function StatsPage() {
  return (
    <ProtectedRoute requiredRole="cleaner">
      <StatsContent />
    </ProtectedRoute>
  );
}
