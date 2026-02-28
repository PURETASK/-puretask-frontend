'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { HelpCircle, MessageSquare, FileText, Mail } from 'lucide-react';

function SupportContent() {
  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <a href="/client" className="text-sm font-medium text-gray-600 hover:text-gray-900 mb-2 inline-block">← Back to home</a>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Help & support</h1>
            <p className="text-gray-600 mt-1">Get help with bookings, payments, or open a dispute.</p>
          </div>

          <div className="grid gap-4 mb-8">
            <Card className="rounded-2xl border-gray-200 card-interactive">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--brand-cloud)', color: 'var(--brand-blue)' }}>
                    <HelpCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Help Center</h2>
                    <p className="text-gray-600 text-sm mb-4">
                      FAQs, how-to guides, and articles on bookings, payments, and account.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/help">Visit Help Center</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-gray-200 card-interactive">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-[var(--brand-mint)]/20 text-[var(--brand-mint)]">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Message your cleaner</h2>
                    <p className="text-gray-600 text-sm mb-4">
                      For questions about a specific booking, message your cleaner from the booking detail page.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/client/bookings">My Bookings</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-gray-200 card-interactive">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Disputes</h2>
                    <p className="text-gray-600 text-sm mb-4">
                      If something went wrong with a booking or payment, we can help resolve it. Contact support with your booking ID and details.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="mailto:support@puretask.com?subject=Dispute%20-%20Booking%20ID">Email support (dispute)</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-gray-200 card-interactive">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Contact support</h2>
                    <p className="text-gray-600 text-sm mb-4">
                      support@puretask.com · We typically respond within 24 hours.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="mailto:support@puretask.com">Email support</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ClientSupportPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <SupportContent />
    </ProtectedRoute>
  );
}
