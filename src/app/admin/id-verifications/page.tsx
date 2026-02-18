// src/app/admin/id-verifications/page.tsx
// Admin ID Verification Dashboard

'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';

interface IDVerification {
  id: string;
  cleaner_id: string;
  document_type: string;
  document_url: string | null;
  status: 'pending' | 'verified' | 'failed';
  reviewed_at: string | null;
  reviewed_by: string | null;
  notes: string | null;
  created_at: string;
  expires_at: string | null;
  cleaner_profile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    user_id: string;
    profile_photo_url: string | null;
  } | null;
}

interface IDVerificationsResponse {
  verifications: IDVerification[];
  count: number;
}

/**
 * Get ID verifications
 */
async function getIDVerifications(status?: string, search?: string): Promise<IDVerificationsResponse> {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.append('status', status);
  if (search) params.append('search', search);
  
  return apiClient.get(`/admin/id-verifications?${params.toString()}`);
}

/**
 * Get document URL (signed URL)
 */
async function getDocumentUrl(id: string): Promise<{ document_url: string; expires_in: number }> {
  return apiClient.get(`/admin/id-verifications/${id}/document-url`);
}

/**
 * Update verification status
 */
async function updateVerificationStatus(
  id: string,
  status: 'pending' | 'verified' | 'failed',
  notes?: string
): Promise<{ success: boolean; status: string }> {
  return apiClient.patch(`/admin/id-verifications/${id}/status`, { status, notes });
}

export default function AdminIDVerificationsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerification, setSelectedVerification] = useState<IDVerification | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);

  // Fetch verifications
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-id-verifications', statusFilter, searchQuery],
    queryFn: () => getIDVerifications(statusFilter, searchQuery),
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: 'pending' | 'verified' | 'failed'; notes?: string }) =>
      updateVerificationStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-id-verifications'] });
      setSelectedVerification(null);
      setDocumentUrl(null);
      setReviewNotes('');
    },
  });

  // Load document URL when verification is selected
  React.useEffect(() => {
    if (selectedVerification?.document_url) {
      getDocumentUrl(selectedVerification.id)
        .then((result) => setDocumentUrl(result.document_url))
        .catch((error) => {
          console.error('Failed to load document URL:', error);
          setDocumentUrl(selectedVerification.document_url || null);
        });
    }
  }, [selectedVerification]);

  const verifications = data?.verifications || [];

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getDocumentTypeName = (type: string) => {
    const names: Record<string, string> = {
      drivers_license: "Driver's License",
      passport: 'Passport',
      state_id: 'State ID',
    };
    return names[type] || type;
  };

  const handleReview = (verification: IDVerification) => {
    setSelectedVerification(verification);
    setReviewNotes(verification.notes || '');
  };

  const handleApprove = () => {
    if (!selectedVerification) return;
    updateStatusMutation.mutate({
      id: selectedVerification.id,
      status: 'verified',
      notes: reviewNotes || undefined,
    });
  };

  const handleReject = () => {
    if (!selectedVerification) return;
    updateStatusMutation.mutate({
      id: selectedVerification.id,
      status: 'failed',
      notes: reviewNotes || undefined,
    });
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ID Verification Dashboard</h1>
          <p className="text-gray-600">Review and approve cleaner identity documents</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search by name or document type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-base min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="w-full sm:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-base min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="failed">Rejected</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verifications Table */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">
              Verifications ({verifications.length})
            </h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            ) : verifications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No verifications found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Cleaner</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Document Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Submitted</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifications.map((verification) => (
                      <tr key={verification.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {verification.cleaner_profile?.profile_photo_url && (
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                <img
                                  src={verification.cleaner_profile.profile_photo_url}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900">
                                {verification.cleaner_profile?.first_name || ''}{' '}
                                {verification.cleaner_profile?.last_name || ''}
                              </div>
                              <div className="text-sm text-gray-500">
                                {verification.cleaner_profile?.user_id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getDocumentTypeName(verification.document_type)}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(verification.status)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(verification.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReview(verification)}
                          >
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Review Dialog */}
        {selectedVerification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Review ID Verification</h2>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedVerification(null);
                      setDocumentUrl(null);
                      setReviewNotes('');
                    }}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cleaner Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  {selectedVerification.cleaner_profile?.profile_photo_url && (
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                      <img
                        src={selectedVerification.cleaner_profile.profile_photo_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-lg">
                      {selectedVerification.cleaner_profile?.first_name || ''}{' '}
                      {selectedVerification.cleaner_profile?.last_name || ''}
                    </div>
                    <div className="text-sm text-gray-600">
                      Document: {getDocumentTypeName(selectedVerification.document_type)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Submitted: {new Date(selectedVerification.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Document Preview */}
                {documentUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document Preview
                    </label>
                    <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                      {selectedVerification.document_url?.endsWith('.pdf') ? (
                        <iframe
                          src={documentUrl}
                          className="w-full h-96 border-0 rounded"
                          title="Document Preview"
                        />
                      ) : (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-white">
                          <img
                            src={documentUrl}
                            alt="ID Document"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      URL expires in 5 minutes. Refresh if needed.
                    </p>
                  </div>
                )}

                {/* Review Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Notes (Optional)
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add any notes about this verification..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedVerification(null);
                      setDocumentUrl(null);
                      setReviewNotes('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReject}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 bg-red-50 text-red-700 hover:bg-red-100"
                  >
                    {updateStatusMutation.isPending ? 'Processing...' : 'Reject'}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleApprove}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1"
                  >
                    {updateStatusMutation.isPending ? 'Processing...' : 'Approve'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}
