'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

function GamificationOverviewContent() {
  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              ← Back to Admin
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gamification Overview</h1>
          <p className="text-gray-600 mb-6">
            Level distribution, time-to-level, reward burn, disputes by level, governor status, flags.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-medium text-gray-600">Level distribution</p>
                <p className="text-lg font-bold text-gray-900 mt-1">(Chart from API)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-medium text-gray-600">Time-to-level (median)</p>
                <p className="text-lg font-bold text-gray-900 mt-1">(From API)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-medium text-gray-600">Reward burn + caps</p>
                <p className="text-lg font-bold text-gray-900 mt-1">(From API)</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/admin/gamification/goals">
              <Button variant="primary">Goals Library</Button>
            </Link>
            <Link href="/admin/gamification/rewards">
              <Button variant="outline">Rewards Manager</Button>
            </Link>
            <Link href="/admin/gamification/choices">
              <Button variant="outline">Choice Groups</Button>
            </Link>
            <Link href="/admin/gamification/flags">
              <Button variant="outline">Feature Flags</Button>
            </Link>
            <Link href="/admin/gamification/governor">
              <Button variant="outline">Governor Console</Button>
            </Link>
            <Link href="/admin/gamification/abuse">
              <Button variant="outline">Abuse Monitor</Button>
            </Link>
            <Link href="/admin/support" className="inline-flex">
              <Button variant="outline" className="inline-flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Support (cleaner gamification)
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function GamificationOverviewPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <GamificationOverviewContent />
    </ProtectedRoute>
  );
}
