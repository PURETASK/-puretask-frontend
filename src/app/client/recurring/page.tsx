'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Badge } from '@/components/ui/Badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { clientEnhancedService } from '@/services/clientEnhanced.service';
import { useToast } from '@/contexts/ToastContext';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Pause, Play, Trash2, Plus, Sparkles, TrendingUp, SkipForward, DollarSign } from 'lucide-react';

export default function RecurringBookingsPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <RecurringBookingsContent />
    </ProtectedRoute>
  );
}

function RecurringBookingsContent() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Get recurring bookings
  const { data: recurringData, isLoading } = useQuery({
    queryKey: ['recurring-bookings'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/client/recurring-bookings');
        return (res ?? {}) as { recurringBookings?: unknown[] };
      } catch {
        return { recurringBookings: [] };
      }
    },
  });

  const recurringBookings = recurringData?.recurringBookings || [];

  // Get insights for recurring bookings
  const { data: insightsData } = useQuery({
    queryKey: ['recurring-bookings', 'insights'],
    queryFn: async () => {
      try {
        const bookings = recurringData?.recurringBookings || [];
        if (bookings.length === 0) return null;
        // Calculate insights from bookings
        const totalSavings = bookings.reduce((sum: number, b: any) => sum + (b.savings || 0), 0);
        const totalBookings = bookings.reduce((sum: number, b: any) => sum + (b.total_instances || 0), 0);
        return {
          total_savings: totalSavings,
          total_bookings: totalBookings,
          consistency_score: bookings.length > 0 ? 95 : 0, // Placeholder
        };
      } catch {
        return null;
      }
    },
    enabled: recurringBookings.length > 0,
  });

  if (isLoading) {
    return <Loading size="lg" text="Loading recurring bookings..." fullScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recurring Bookings</h1>
              <p className="text-gray-600 mt-1">Manage your scheduled recurring cleaning services.</p>
            </div>
            <Button variant="primary" onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Recurring Booking
            </Button>
          </div>

          {/* Insights Card */}
          {insightsData && (
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-900 mb-2">Recurring Booking Insights</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      {insightsData.total_savings > 0 && (
                        <div>
                          <p className="text-green-700">Total Savings</p>
                          <p className="text-lg font-bold text-green-900">
                            ${insightsData.total_savings.toFixed(2)}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-green-700">Total Bookings</p>
                        <p className="text-lg font-bold text-green-900">{insightsData.total_bookings}</p>
                      </div>
                      <div>
                        <p className="text-green-700">Consistency Score</p>
                        <p className="text-lg font-bold text-green-900">{insightsData.consistency_score}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {recurringBookings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No recurring bookings
                </h3>
                <p className="text-gray-600 mb-6">
                  Set up recurring bookings to automatically schedule cleanings on a regular basis.
                </p>
                <Button variant="primary" onClick={() => setShowCreateForm(true)}>
                  Create Your First Recurring Booking
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {recurringBookings.map((booking: any) => (
                <RecurringBookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}

          {/* Create Form Modal */}
          {showCreateForm && (
            <CreateRecurringBookingModal onClose={() => setShowCreateForm(false)} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Recurring Booking Card Component
function RecurringBookingCard({ booking }: { booking: any }) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Get smart suggestions for this booking
  const { data: suggestionsData } = useQuery({
    queryKey: ['recurring-bookings', booking.id, 'suggestions'],
    queryFn: async () => {
      const res = await clientEnhancedService.getRecurringSuggestions(booking.id);
      return (res ?? {}) as { suggestions?: { optimal_day?: string; optimal_time?: string; cleaner_availability?: string[] } };
    },
    enabled: showSuggestions,
  });

  const { mutate: pauseBooking, isPending: isPausing } = useMutation({
    mutationFn: () => apiClient.patch(`/client/recurring-bookings/${booking.id}`, { status: 'paused' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-bookings'] });
      showToast('Recurring booking paused', 'success');
    },
  });

  const { mutate: resumeBooking, isPending: isResuming } = useMutation({
    mutationFn: () => apiClient.patch(`/client/recurring-bookings/${booking.id}`, { status: 'active' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-bookings'] });
      showToast('Recurring booking resumed', 'success');
    },
  });

  const { mutate: cancelBooking, isPending: isCancelling } = useMutation({
    mutationFn: () => apiClient.delete(`/client/recurring-bookings/${booking.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-bookings'] });
      showToast('Recurring booking cancelled', 'success');
    },
  });

  const { mutate: skipNext, isPending: isSkipping } = useMutation({
    mutationFn: () => clientEnhancedService.skipRecurringBooking(booking.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-bookings'] });
      showToast('Next booking skipped', 'success');
    },
    onError: (error: any) => {
      showToast(error.response?.data?.error?.message || 'Failed to skip booking', 'error');
    },
  });

  const frequencyLabels: Record<string, string> = {
    weekly: 'Weekly',
    biweekly: 'Bi-weekly',
    monthly: 'Monthly',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {booking.cleaner?.name || 'Cleaner'}
              </h3>
              <Badge
                variant={booking.status === 'active' ? 'success' : booking.status === 'paused' ? 'warning' : 'error'}
              >
                {booking.status}
              </Badge>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Frequency:</span>
                <span className="font-medium">{frequencyLabels[booking.frequency] || booking.frequency}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Next booking:</span>
                <span className="font-medium">
                  {booking.next_booking_date
                    ? format(new Date(booking.next_booking_date), 'MMM d, yyyy')
                    : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{booking.address}</span>
              </div>
            </div>
            {booking.savings && booking.savings > 0 && (
              <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
                <DollarSign className="h-4 w-4" />
                <span>You've saved ${booking.savings.toFixed(2)} with recurring bookings</span>
              </div>
            )}
            {suggestionsData?.suggestions && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">Smart Suggestion</p>
                    <p className="text-sm text-blue-700 mt-1">
                      {suggestionsData.suggestions.optimal_day && (
                        <>Based on your history, we suggest {suggestionsData.suggestions.optimal_day} at {suggestionsData.suggestions.optimal_time}</>
                      )}
                      {suggestionsData.suggestions.cleaner_availability && (
                        <>Your cleaner is usually available on {suggestionsData.suggestions.cleaner_availability.join(', ')}</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            {booking.status === 'active' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => skipNext()}
                isLoading={isSkipping}
                title="Skip next booking"
              >
                <SkipForward className="h-4 w-4 mr-1" />
                Skip Next
              </Button>
            )}
            {booking.status === 'active' ? (
              <Button variant="outline" size="sm" onClick={() => pauseBooking()} isLoading={isPausing}>
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </Button>
            ) : booking.status === 'paused' ? (
              <Button variant="outline" size="sm" onClick={() => resumeBooking()} isLoading={isResuming}>
                <Play className="h-4 w-4 mr-1" />
                Resume
              </Button>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSuggestions(!showSuggestions)}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Suggestions
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm('Cancel this recurring booking?')) {
                  cancelBooking();
                }
              }}
              isLoading={isCancelling}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Create Recurring Booking Modal
function CreateRecurringBookingModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    cleaner_id: '',
    service_type: 'standard',
    frequency: 'weekly',
    start_date: '',
    time: '09:00',
    address: '',
    duration_hours: 2,
  });
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createRecurring, isPending } = useMutation({
    mutationFn: (data: any) => apiClient.post('/client/recurring-bookings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-bookings'] });
      showToast('Recurring booking created!', 'success');
      onClose();
    },
    onError: (error: any) => {
      showToast(error.response?.data?.error?.message || 'Failed to create recurring booking', 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRecurring(formData);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Create Recurring Booking</CardTitle>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <select
                value={formData.service_type}
                onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="standard">Standard Cleaning</option>
                <option value="deep">Deep Clean</option>
                <option value="move_in_out">Move In/Out</option>
                <option value="airbnb">Airbnb Cleaning</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter service address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
              <Input
                type="number"
                value={formData.duration_hours}
                onChange={(e) => setFormData({ ...formData, duration_hours: parseInt(e.target.value) || 2 })}
                min="1"
                max="8"
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isPending} className="flex-1">
                Create Recurring Booking
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
