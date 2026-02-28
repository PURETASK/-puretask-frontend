'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { HelpCircle, User } from 'lucide-react';

function AdminSupportContent() {
  const router = useRouter();
  const [cleanerId, setCleanerId] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4">
            <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              ← Back to Admin
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <HelpCircle className="h-7 w-7" />
            Support
          </h1>
          <p className="text-gray-600 mb-6">
            Access cleaner-specific support tools. Open gamification debug for a cleaner by ID.
          </p>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Cleaner gamification
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                View and debug level, goals, rewards, and metrics for a cleaner.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Cleaner ID"
                  value={cleanerId}
                  onChange={(e) => setCleanerId(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button
                  variant="primary"
                  onClick={() => {
                    const id = cleanerId.trim();
                    if (id) router.push(`/admin/support/cleaner/${id}/gamification`);
                  }}
                  disabled={!cleanerId.trim()}
                >
                  Open gamification
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Find cleaner IDs in <Link href="/admin/users" className="text-blue-600 hover:underline">Admin → Users</Link>.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function AdminSupportPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminSupportContent />
    </ProtectedRoute>
  );
}
