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
import { useAvailableJobs, useAcceptJob } from '@/hooks/useCleanerJobs';
import { useQuery } from '@tanstack/react-query';
import { cleanerEnhancedService } from '@/services/cleanerEnhanced.service';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp, MapPin, Clock, DollarSign, Star } from 'lucide-react';

export default function CleanerJobRequestsPage() {
  return (
    <ProtectedRoute requiredRole="cleaner">
      <CleanerJobRequestsContent />
    </ProtectedRoute>
  );
}

function CleanerJobRequestsContent() {
  const router = useRouter();
  const { data: availableJobs, isLoading, error } = useAvailableJobs();
  const { mutate: acceptJob, isPending: isAccepting } = useAcceptJob();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    serviceType: '',
    dateRange: '',
    sortBy: 'date' as 'date' | 'credits' | 'distance',
  });

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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <ErrorDisplay
              error={error}
              onRetry={() => window.location.reload()}
              variant="card"
              title="Failed to load jobs"
            />
          </div>
        </main>
      </div>
    );
  }

  const jobs = availableJobs || [];

  // Filter jobs
  let filteredJobs = jobs;
  if (filters.serviceType) {
    filteredJobs = filteredJobs.filter((job: any) => job.service_type === filters.serviceType);
  }

  // Sort jobs
  filteredJobs = [...filteredJobs].sort((a: any, b: any) => {
    if (filters.sortBy === 'date') {
      return new Date(a.scheduled_start_at).getTime() - new Date(b.scheduled_start_at).getTime();
    }
    if (filters.sortBy === 'credits') {
      return (b.credit_amount || 0) - (a.credit_amount || 0);
    }
    if (filters.sortBy === 'distance') {
      return (a.distance_miles || 0) - (b.distance_miles || 0);
    }
    return 0;
  });

  const handleAccept = (jobId: string) => {
    setSelectedJobId(jobId);
    acceptJob(jobId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
              <p className="text-gray-600 mt-1">Accept jobs that match your schedule and preferences.</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/cleaner/dashboard')}>
              ← Back to Dashboard
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={filters.serviceType}
                    onChange={(e) => setFilters({ ...filters, serviceType: e.target.value })}
                  >
                    <option value="">All Services</option>
                    <option value="standard">Standard Cleaning</option>
                    <option value="deep">Deep Clean</option>
                    <option value="move_in_out">Move In/Out</option>
                    <option value="airbnb">Airbnb Cleaning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                  >
                    <option value="date">Date</option>
                    <option value="credits">Credits (High to Low)</option>
                    <option value="distance">Distance</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    onClick={() => setFilters({ serviceType: '', dateRange: '', sortBy: 'date' })}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Jobs List */}
          {filteredJobs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job: any) => (
                <JobRequestCard
                  key={job.id}
                  job={job}
                  onAccept={handleAccept}
                  isAccepting={isAccepting && selectedJobId === job.id}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Available</h3>
                <p className="text-gray-600">There are no available jobs matching your filters right now.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Enhanced Job Request Card with Matching Score
function JobRequestCard({
  job,
  onAccept,
  isAccepting,
}: {
  job: any;
  onAccept: (id: string) => void;
  isAccepting: boolean;
}) {
  const { data: matchingScore } = useQuery({
    queryKey: ['cleaner', 'jobs', job.id, 'matching-score'],
    queryFn: () => cleanerEnhancedService.getMatchingScore(job.id),
    enabled: !!job.id,
  });

  const score = matchingScore?.matchingScore || 0;
  const recommendation = matchingScore?.recommendation || 'medium';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg capitalize">
                {job.service_type?.replace('_', ' ') || 'Standard Cleaning'}
              </CardTitle>
              {matchingScore && (
                <Badge
                  variant={recommendation === 'high' ? 'success' : recommendation === 'medium' ? 'primary' : 'default'}
                  className="text-xs"
                >
                  {score}% Match
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {format(new Date(job.scheduled_start_at), 'MMM d, yyyy')} at{' '}
              {format(new Date(job.scheduled_start_at), 'h:mm a')}
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {formatCurrency((job.credit_amount || 0) * 10)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Matching Score Breakdown */}
        {matchingScore && matchingScore.factors && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs font-medium text-blue-900 mb-2">Match Breakdown:</p>
            <div className="space-y-1">
              {matchingScore.factors.map((factor: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-blue-700">{factor.name}</span>
                  <span className="font-medium text-blue-900">{Math.round(factor.score)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Client Info */}
        {job.client && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              {job.client.full_name?.[0] || 'C'}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{job.client.full_name || 'Client'}</p>
              {job.client.rating && (
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {job.client.rating.toFixed(1)} rating
                </p>
              )}
            </div>
          </div>
        )}

        {/* Job Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Duration:
            </span>
            <span className="font-medium">
              {Math.round(
                (new Date(job.scheduled_end_at).getTime() -
                  new Date(job.scheduled_start_at).getTime()) /
                  (1000 * 60 * 60)
              )}{' '}
              hours
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Credits:
            </span>
            <span className="font-medium">{job.credit_amount || 0} credits</span>
          </div>
          {job.distance_miles && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Distance:
              </span>
              <span className="font-medium">{job.distance_miles.toFixed(1)} miles</span>
            </div>
          )}
          <div className="pt-2 border-t">
            <span className="text-gray-600">Address:</span>
            <p className="font-medium text-gray-900 mt-1">{job.address}</p>
          </div>
        </div>

        {/* Special Instructions */}
        {job.client_notes && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-1">Special Instructions:</p>
            <p className="text-xs text-gray-600">{job.client_notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="primary"
            onClick={() => onAccept(job.id)}
            isLoading={isAccepting}
            className="flex-1"
            disabled={recommendation === 'low'}
          >
            {recommendation === 'high' ? 'Great Match!' : 'Accept Job'}
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = `/cleaner/jobs/${job.id}`)}
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
