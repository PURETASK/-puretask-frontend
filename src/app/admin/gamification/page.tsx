'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

function GamificationOverviewContent() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-6xl mx-auto">
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
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Goals Library
              </button>
            </Link>
            <Link href="/admin/gamification/rewards">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                Rewards Manager
              </button>
            </Link>
            <Link href="/admin/gamification/choices">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                Choice Groups
              </button>
            </Link>
            <Link href="/admin/gamification/flags">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                Feature Flags
              </button>
            </Link>
            <Link href="/admin/gamification/governor">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                Governor Console
              </button>
            </Link>
            <Link href="/admin/gamification/abuse">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                Abuse Monitor
              </button>
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
