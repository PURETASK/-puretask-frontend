'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface LegacyToolPageProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function LegacyToolPage({ title, description, children }: LegacyToolPageProps) {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8 px-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-yellow-700">
                      Legacy Tool - Testing Only
                    </p>
                    <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                    {description && (
                      <p className="text-sm text-gray-700 mt-1">{description}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = '/admin/tools')}
                  >
                    Back to Tools
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {children}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
