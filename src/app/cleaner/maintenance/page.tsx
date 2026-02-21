'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { PausedProgressBanner } from '@/components/gamification';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { cleanerGamificationService } from '@/services/cleanerGamification.service';

function MaintenanceContent() {
  const { data: maintenanceData } = useQuery({
    queryKey: ['cleaner', 'maintenance'],
    queryFn: () => cleanerGamificationService.getMaintenance(),
  });
  const { data: progressData } = useQuery({
    queryKey: ['cleaner', 'progress'],
    queryFn: () => cleanerGamificationService.getProgress(),
  });

  const isPaused = maintenanceData?.progress_paused ?? progressData?.progress_paused ?? false;
  const reason = maintenanceData?.progress_paused_reason ?? progressData?.progress_paused_reason ?? 'On-time rate below 85% for last 30 jobs';
  const recoverySteps = maintenanceData?.recovery_steps ?? ['Do 3 dispute-free jobs', 'Improve on-time over next 10 jobs'];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Maintenance</h1>
          <p className="text-gray-600 mb-6">
            On-time %, disputes, acceptance fairness. If paused: reason + recovery steps.
          </p>

          {isPaused ? (
            <PausedProgressBanner
              reason={reason}
              recoverySteps={recoverySteps}
              onSeeWhatCounts={() => {}}
              onViewMyStats={() => (window.location.href = '/cleaner/stats')}
            />
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="font-medium text-green-700">All good — you&apos;re in compliance.</p>
                <p className="text-sm text-gray-600 mt-1">
                  On-time rate, disputes, acceptance rate, photo compliance (from API when available).
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2 mt-4">
            <Link href="/cleaner/stats" className="text-sm text-blue-600 hover:underline">
              View my stats
            </Link>
            <a href="/support" className="text-sm text-blue-600 hover:underline">Contact support</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function MaintenancePage() {
  return (
    <ProtectedRoute requiredRole="cleaner">
      <MaintenanceContent />
    </ProtectedRoute>
  );
}
