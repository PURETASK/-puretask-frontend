'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SkeletonList } from '@/components/ui/Skeleton';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { apiClient } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/contexts/ToastContext';
import { adminEnhancedService } from '@/services/adminEnhanced.service';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { MobileTable } from '@/components/mobile/MobileTable';
import { useMobile } from '@/hooks/useMobile';

type DisputesResponse = { disputes?: unknown[] };

export default function AdminDisputesPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDisputesContent />
    </ProtectedRoute>
  );
}

function AdminDisputesContent() {
  const router = useRouter();
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [filters, setFilters] = useState({
    status: 'all' as 'all' | 'pending' | 'reviewing' | 'resolved',
  });

  // Get disputes with AI insights
  const { data: disputesData, isLoading } = useQuery<DisputesResponse>({
    queryKey: ['admin', 'disputes', filters],
    queryFn: async (): Promise<DisputesResponse> => {
      try {
        const response = await adminEnhancedService.getDisputesWithInsights(filters);
        return response as DisputesResponse;
      } catch {
        // Fallback to basic endpoint
        try {
          const jobs = await apiClient.get<{ jobs?: unknown[] }>('/admin/jobs', {
            params: { status: 'disputed' },
          });
          return { disputes: jobs.jobs || [] };
        } catch {
          return { disputes: [] };
        }
      }
    },
  });

  const disputes = disputesData?.disputes || [];

  const filteredDisputes = filters.status === 'all'
    ? disputes
    : disputes.filter((d: any) => d.status === filters.status);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <SkeletonList items={6} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Disputes Management</h1>
              <p className="text-gray-600 mt-1">Review and resolve job disputes.</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
              ← Back to Dashboard
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex gap-2">
                {(['all', 'pending', 'reviewing', 'resolved'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilters({ ...filters, status })}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors min-h-[44px] ${
                      filters.status === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({disputes.filter((d: any) => status === 'all' || d.status === status).length})
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Disputes Table */}
          {filteredDisputes.length > 0 ? (
            <div className="space-y-4">
              {filteredDisputes.map((dispute: any) => (
                <Card key={dispute.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">Job #{dispute.id}</h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              dispute.status === 'resolved'
                                ? 'bg-green-100 text-green-800'
                                : dispute.status === 'reviewing'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {dispute.status || 'pending'}
                          </span>
                          {dispute.risk_score && (
                            <Badge
                              variant={
                                dispute.risk_score >= 7
                                  ? 'error'
                                  : dispute.risk_score >= 4
                                  ? 'warning'
                                  : 'success'
                              }
                              className="flex items-center gap-1"
                            >
                              <AlertTriangle className="h-3 w-3" />
                              Risk: {dispute.risk_score}/10
                            </Badge>
                          )}
                          {dispute.ai_insights && (
                            <Badge variant="info" className="flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              AI Insights
                            </Badge>
                          )}
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Client:</span>
                            <p className="font-medium">{dispute.client?.name || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Cleaner:</span>
                            <p className="font-medium">{dispute.cleaner?.name || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Amount:</span>
                            <p className="font-medium">{formatCurrency((dispute.credit_amount || 0) * 10)}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Date:</span>
                            <p className="font-medium">
                              {format(new Date(dispute.scheduled_start_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Created:</span>
                            <p className="font-medium">
                              {format(new Date(dispute.created_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        {dispute.dispute_reason && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm font-medium text-red-900">Dispute Reason:</p>
                            <p className="text-sm text-red-700 mt-1">{dispute.dispute_reason}</p>
                          </div>
                        )}
                        {dispute.ai_insights && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="h-4 w-4 text-blue-600" />
                              <p className="text-sm font-medium text-blue-900">AI Analysis</p>
                            </div>
                            <p className="text-sm text-blue-700">{dispute.ai_insights.summary}</p>
                            {dispute.ai_insights.recommended_action && (
                              <div className="mt-2 pt-2 border-t border-blue-200">
                                <p className="text-xs font-medium text-blue-900 mb-1">Recommended Action:</p>
                                <p className="text-xs text-blue-700">{dispute.ai_insights.recommended_action}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <Button
                          variant="primary"
                          onClick={() => setSelectedDispute(dispute)}
                        >
                          Review Dispute
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Disputes</h3>
                <p className="text-gray-600">
                  {filters.status === 'all'
                    ? 'There are no disputes at the moment.'
                    : `No ${filters.status} disputes found.`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Dispute Details Modal */}
      {selectedDispute && (
        <DisputeDetailsModal
          dispute={selectedDispute}
          onClose={() => setSelectedDispute(null)}
        />
      )}

      <Footer />
    </div>
  );
}

// Dispute Details Modal Component
function DisputeDetailsModal({ dispute, onClose }: { dispute: any; onClose: () => void }) {
  const [resolutionType, setResolutionType] = useState<'full_refund' | 'partial_refund' | 'no_refund' | 'adjust_earnings'>('full_refund');
  const [refundAmount, setRefundAmount] = useState(dispute.credit_amount * 10);
  const [adminNotes, setAdminNotes] = useState('');
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: resolveDispute, isPending } = useMutation({
    mutationFn: (data: any) => {
      // TODO: Create /admin/disputes/:id/resolve endpoint
      return apiClient.post(`/admin/jobs/${dispute.id}/resolve-dispute`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'disputes'] });
      showToast('Dispute resolved successfully!', 'success');
      onClose();
    },
    onError: (error: any) => {
      showToast(error.response?.data?.error?.message || 'Failed to resolve dispute', 'error');
    },
  });

  const handleResolve = () => {
    if (!adminNotes.trim()) {
      showToast('Please provide admin notes', 'error');
      return;
    }

    resolveDispute({
      resolution_type: resolutionType,
      refund_amount: resolutionType === 'partial_refund' ? refundAmount : undefined,
      admin_notes: adminNotes,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Review Dispute - Job #{dispute.id}</CardTitle>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Job Information */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Job Information</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Service Type:</span>
                <p className="font-medium capitalize">{dispute.service_type?.replace('_', ' ')}</p>
              </div>
              <div>
                <span className="text-gray-600">Date & Time:</span>
                <p className="font-medium">
                  {format(new Date(dispute.scheduled_start_at), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Address:</span>
                <p className="font-medium">{dispute.address}</p>
              </div>
              <div>
                <span className="text-gray-600">Amount:</span>
                <p className="font-medium">{formatCurrency((dispute.credit_amount || 0) * 10)}</p>
              </div>
            </div>
          </div>

          {/* Dispute Details */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Dispute Details</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-900 mb-2">Dispute Reason:</p>
              <p className="text-sm text-red-700">{dispute.dispute_reason || 'No reason provided'}</p>
            </div>
          </div>

          {/* Resolution Options */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Resolution</h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="resolution"
                  value="full_refund"
                  checked={resolutionType === 'full_refund'}
                  onChange={(e) => setResolutionType(e.target.value as any)}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium">Full Refund to Client</p>
                  <p className="text-sm text-gray-600">
                    Refund {formatCurrency((dispute.credit_amount || 0) * 10)} to client
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="resolution"
                  value="partial_refund"
                  checked={resolutionType === 'partial_refund'}
                  onChange={(e) => setResolutionType(e.target.value as any)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium">Partial Refund</p>
                  <div className="mt-2">
                    <input
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                      min="0"
                      max={dispute.credit_amount * 10}
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Refund amount"
                    />
                  </div>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="resolution"
                  value="no_refund"
                  checked={resolutionType === 'no_refund'}
                  onChange={(e) => setResolutionType(e.target.value as any)}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium">No Refund</p>
                  <p className="text-sm text-gray-600">Dispute dismissed, no refund issued</p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="resolution"
                  value="adjust_earnings"
                  checked={resolutionType === 'adjust_earnings'}
                  onChange={(e) => setResolutionType(e.target.value as any)}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium">Adjust Cleaner Earnings</p>
                  <p className="text-sm text-gray-600">Reduce cleaner payout amount</p>
                </div>
              </label>
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes (Required)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Explain your resolution decision..."
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleResolve}
              isLoading={isPending}
              className="flex-1"
            >
              Resolve Dispute
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
