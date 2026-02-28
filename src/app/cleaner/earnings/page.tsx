'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SkeletonList } from '@/components/ui/Skeleton';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useCleanerEarnings, useCleanerPayouts, useRequestPayout } from '@/hooks/useCleanerEarnings';
import { useBookings } from '@/hooks/useBookings';
import { useQuery } from '@tanstack/react-query';
import { cleanerEnhancedService } from '@/services/cleanerEnhanced.service';
import { BarChart, LineChart } from '@/components/ui/Charts';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Download, FileText, TrendingUp, DollarSign } from 'lucide-react';

export default function CleanerEarningsPage() {
  return (
    <ProtectedRoute requiredRole="cleaner">
      <CleanerEarningsContent />
    </ProtectedRoute>
  );
}

function CleanerEarningsContent() {
  const { data: earningsData, isLoading: earningsLoading } = useCleanerEarnings();
  const { data: payoutsData, isLoading: payoutsLoading } = useCleanerPayouts({ page: 1, per_page: 20 });
  const { data: bookingsData } = useBookings('completed');
  const { mutate: requestPayout, isPending: isRequesting } = useRequestPayout();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Get earnings breakdown
  const { data: breakdownData } = useQuery({
    queryKey: ['cleaner', 'earnings', 'breakdown', selectedPeriod],
    queryFn: async () => {
      const res = await cleanerEnhancedService.getEarningsBreakdown(selectedPeriod);
      return (res ?? {}) as { breakdown?: { byServiceType?: unknown[]; byClient?: unknown[] } };
    },
  });

  // Get tax report
  const { data: taxReportData } = useQuery({
    queryKey: ['cleaner', 'earnings', 'tax-report'],
    queryFn: () => cleanerEnhancedService.getTaxReport(new Date().getFullYear()),
  });

  const handleExportEarnings = async () => {
    try {
      const response = await cleanerEnhancedService.exportEarnings() as string | Blob;
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `earnings-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (earningsLoading || payoutsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-app">
        <Header />
        <main className="flex-1 py-8 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <SkeletonList items={6} />
          </div>
        </main>
      </div>
    );
  }

  const earnings = earningsData || {
    pendingEarnings: { credits: 0, usd: 0, jobs: 0 },
    paidOut: { credits: 0, usd: 0, jobs: 0, lastPayout: null },
    nextPayout: { date: '', estimatedCredits: 0, estimatedUsd: 0 },
    payoutSchedule: 'weekly',
  };

  const formatDateSafe = (value: string | null | undefined, fmt: string) => {
    if (value == null || value === '') return '—';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '—' : format(d, fmt);
  };

  const payouts = payoutsData?.payouts || [];
  const completedJobs = bookingsData?.bookings?.filter((b: any) => b.status === 'completed') || [];

  // Chart data - earnings over last 6 months
  const monthlyEarnings = completedJobs
    .reduce((acc: any[], job: any) => {
      const month = format(new Date(job.scheduled_start_at), 'MMM yyyy');
      const existing = acc.find((item) => item.label === month);
      const jobEarnings = (job.credit_amount || 0) * 10; // Convert credits to USD
      if (existing) {
        existing.value += jobEarnings;
      } else {
        acc.push({ label: month, value: jobEarnings });
      }
      return acc;
    }, [])
    .slice(-6)
    .reverse();

  const handleRequestPayout = () => {
    if (earnings.pendingEarnings.credits > 0) {
      requestPayout(undefined);
      setShowRequestModal(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div
            className="mb-8 rounded-2xl border border-[var(--brand-mint)]/20 px-6 py-5 shadow-sm"
            style={{ background: 'linear-gradient(135deg, rgba(40,199,111,0.06) 0%, rgba(0,212,255,0.03) 100%)' }}
          >
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Earnings & payouts</h1>
            <p className="text-gray-600 mt-1">Track your earnings and manage payouts.</p>
          </div>

          {earnings.nextPayout?.date && (earnings.pendingEarnings.credits > 0 || earnings.nextPayout.estimatedCredits > 0) && (
            <Card className="mb-6 rounded-2xl border-[var(--brand-mint)]/30 card-interactive" style={{ backgroundColor: 'rgba(40,199,111,0.06)' }}>
              <CardContent className="py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Next payout</h3>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(earnings.nextPayout.estimatedUsd || 0)} estimated on{' '}
                      {formatDateSafe(earnings.nextPayout.date, 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <Button onClick={() => setShowRequestModal(true)} disabled={earnings.pendingEarnings.credits === 0}>
                  Request payout
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="mb-6 flex flex-wrap items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleExportEarnings}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // Show tax report modal
                  window.open(`/cleaner/earnings/tax-report`, '_blank');
                }}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Tax Report
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="rounded-2xl border-gray-200 card-interactive">
              <CardHeader>
                <CardTitle className="text-base">Pending earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--brand-blue)' }}>
                  {formatCurrency(earnings.pendingEarnings.usd)}
                </div>
                <p className="text-sm text-gray-600">
                  {earnings.pendingEarnings.credits} credits · {earnings.pendingEarnings.jobs} jobs
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-gray-200 card-interactive">
              <CardHeader>
                <CardTitle className="text-base">Total paid out</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--brand-mint)' }}>
                  {formatCurrency(earnings.paidOut.usd)}
                </div>
                <p className="text-sm text-gray-600">
                  {earnings.paidOut.credits} credits · {earnings.paidOut.jobs} jobs
                </p>
                {earnings.paidOut.lastPayout && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last: {formatDateSafe(earnings.paidOut.lastPayout as string | null, 'MMM d, yyyy')}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-gray-200 card-interactive">
              <CardHeader>
                <CardTitle className="text-base">Next payout</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-500 mb-1">
                  {formatCurrency(earnings.nextPayout.estimatedUsd)}
                </div>
                <p className="text-sm text-gray-600">
                  {formatDateSafe(earnings.nextPayout.date, 'MMM d, yyyy')}
                </p>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {earnings.payoutSchedule} schedule
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Earnings Chart */}
              {monthlyEarnings.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Earnings Over Time</CardTitle>
                      <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                      </select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <BarChart data={monthlyEarnings} title="Monthly Earnings" height={300} />
                  </CardContent>
                </Card>
              )}

              {/* Earnings Breakdown */}
              {breakdownData?.breakdown && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Earnings Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* By Service Type */}
                      {breakdownData.breakdown.byServiceType && breakdownData.breakdown.byServiceType.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">By Service Type</h4>
                          <div className="space-y-2">
                            {breakdownData.breakdown.byServiceType.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium capitalize">{item.service_type?.replace('_', ' ') || 'N/A'}</p>
                                  <p className="text-sm text-gray-600">{item.job_count} jobs</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">{formatCurrency(item.total_earnings || 0)}</p>
                                  <p className="text-xs text-gray-500">Avg: {formatCurrency(item.avg_earnings_per_job || 0)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* By Client */}
                      {breakdownData.breakdown.byClient && breakdownData.breakdown.byClient.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Top Clients</h4>
                          <div className="space-y-2">
                            {breakdownData.breakdown.byClient.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium">{item.client_name || item.client_email || 'Client'}</p>
                                  <p className="text-sm text-gray-600">{item.job_count} jobs</p>
                                </div>
                                <p className="font-semibold text-gray-900">{formatCurrency(item.total_earnings || 0)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Job Earnings List */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Job Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  {completedJobs.length > 0 ? (
                    <div className="space-y-4">
                      {completedJobs.slice(0, 10).map((job: any) => (
                        <div
                          key={job.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {format(new Date(job.scheduled_start_at), 'MMM d, yyyy')}
                            </p>
                            <p className="text-sm text-gray-600">
                              {job.service_type?.replace('_', ' ') || 'Standard Cleaning'} · {job.address}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency((job.credit_amount || 0) * 10)}
                            </p>
                            <p className="text-xs text-gray-500">{job.credit_amount || 0} credits</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-600">
                      <p>No completed jobs yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Payout History & Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Request Payout */}
              {earnings.pendingEarnings.credits > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Request Payout</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Available for payout:</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(earnings.pendingEarnings.usd)}
                      </p>
                    </div>
                    {showRequestModal ? (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-700">
                          Request an instant payout? A small fee may apply.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            onClick={handleRequestPayout}
                            isLoading={isRequesting}
                            className="flex-1"
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowRequestModal(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => setShowRequestModal(true)}
                        className="w-full"
                      >
                        Request Payout
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Payout History */}
              <Card>
                <CardHeader>
                  <CardTitle>Payout History</CardTitle>
                </CardHeader>
                <CardContent>
                  {payouts.length > 0 ? (
                    <div className="space-y-3">
                      {payouts.slice(0, 5).map((payout: any) => (
                        <div key={payout.id} className="border-b border-gray-200 pb-3 last:border-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">
                              {formatCurrency(payout.amount_usd || payout.amount_credits * 10)}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                payout.status === 'paid' || payout.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : payout.status === 'failed'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {payout.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {format(new Date(payout.created_at), 'MMM d, yyyy')}
                            {payout.paid_at && ` · Paid ${format(new Date(payout.paid_at), 'MMM d')}`}
                          </p>
                          {payout.failure_reason && (
                            <p className="text-xs text-red-600 mt-1">{payout.failure_reason}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-600">
                      <p className="text-sm">No payouts yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
      </main>
      <Footer />
    </div>
  );
}
