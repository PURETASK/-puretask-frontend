'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Loading } from '@/components/ui/Loading';
import {
  useCleanerAvailability,
  useUpdateAvailability,
  useTimeOff,
  useAddTimeOff,
  useDeleteTimeOff,
} from '@/hooks/useCleanerAvailability';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { cleanerEnhancedService } from '@/services/cleanerEnhanced.service';
import type { WeeklyAvailability } from '@/services/cleanerAvailability.service';
import { useToast } from '@/contexts/ToastContext';
import { format } from 'date-fns';
import { Plus, Trash2, Calendar, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function CleanerAvailabilityPage() {
  return (
    <ProtectedRoute requiredRole="cleaner">
      <CleanerAvailabilityContent />
    </ProtectedRoute>
  );
}

function CleanerAvailabilityContent() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'timeoff' | 'preferences'>('schedule');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Availability Settings</h1>
            <p className="text-gray-600 mt-1">Manage your schedule, time off, and preferences.</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {[
              { id: 'schedule', label: 'Weekly Schedule' },
              { id: 'timeoff', label: 'Time Off' },
              { id: 'preferences', label: 'Preferences' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'schedule' && <WeeklyScheduleTab />}
          {activeTab === 'timeoff' && <TimeOffTab />}
          {activeTab === 'preferences' && <PreferencesTab />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Weekly Schedule Tab
function WeeklyScheduleTab() {
  const { data: availabilityData, isLoading } = useCleanerAvailability();
  const { mutate: updateAvailability, isPending } = useUpdateAvailability();
  const { showToast } = useToast();
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Get smart scheduling suggestions
  type SuggestionsResponse = {
    suggestions?: {
      optimal_days?: string[];
      peak_hours?: { start?: string; end?: string };
      utilization_rate?: number;
    };
  };
  const { data: suggestionsData } = useQuery({
    queryKey: ['cleaner', 'availability', 'suggestions'],
    queryFn: () => cleanerEnhancedService.getAvailabilitySuggestions() as Promise<SuggestionsResponse>,
  });

  const [schedule, setSchedule] = useState(() => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const defaultSchedule: Record<string, { enabled: boolean; start: string; end: string }> = {};
    days.forEach((day) => {
      defaultSchedule[day] = { enabled: false, start: '09:00', end: '17:00' };
    });
    return defaultSchedule;
  });

  React.useEffect(() => {
    if (availabilityData) {
      // Parse availability data and set schedule
      // This is a simplified version - actual implementation would parse the availability object
    }
  }, [availabilityData]);

  const handleSave = () => {
    // Convert schedule to API format (WeeklyAvailability)
    const availability: Record<string, Array<{ start: string; end: string }>> = {};
    Object.entries(schedule).forEach(([day, slot]) => {
      if (slot.enabled) {
        availability[day] = [{ start: slot.start, end: slot.end }];
      }
    });
    updateAvailability(availability as WeeklyAvailability, {
      onSuccess: () => {
        showToast('Schedule updated!', 'success');
      },
    });
  };

  if (isLoading) {
    return <Loading size="md" text="Loading schedule..." />;
  }

  return (
    <div className="space-y-4">
      {/* Smart Suggestions */}
      {suggestionsData?.suggestions && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-purple-900">Smart Scheduling Suggestions</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestions(!showSuggestions)}
              >
                {showSuggestions ? 'Hide' : 'Show'} Suggestions
              </Button>
            </div>
          </CardHeader>
          {showSuggestions && (
            <CardContent>
              <div className="space-y-3">
                {suggestionsData.suggestions.optimal_days && (
                  <div>
                    <p className="text-sm font-medium text-purple-900 mb-1">Optimal Days</p>
                    <p className="text-sm text-purple-700">
                      Based on your booking history, we recommend being available on:{' '}
                      <strong>{suggestionsData.suggestions.optimal_days.join(', ')}</strong>
                    </p>
                  </div>
                )}
                {suggestionsData.suggestions.peak_hours && (
                  <div>
                    <p className="text-sm font-medium text-purple-900 mb-1">Peak Hours</p>
                    <p className="text-sm text-purple-700">
                      Most bookings occur between{' '}
                      <strong>{suggestionsData.suggestions.peak_hours.start}</strong> and{' '}
                      <strong>{suggestionsData.suggestions.peak_hours.end}</strong>
                    </p>
                  </div>
                )}
                {suggestionsData.suggestions.utilization_rate !== undefined && (
                  <div>
                    <p className="text-sm font-medium text-purple-900 mb-1">Current Utilization</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-purple-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${suggestionsData.suggestions.utilization_rate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-purple-900">
                        {suggestionsData.suggestions.utilization_rate}%
                      </span>
                    </div>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      await cleanerEnhancedService.applyAvailabilityTemplate('optimal');
                      showToast('Optimal schedule applied!', 'success');
                    } catch (error: any) {
                      showToast(error.response?.data?.error?.message || 'Failed to apply template', 'error');
                    }
                  }}
                >
                  Apply Optimal Schedule
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
          {Object.entries(schedule).map(([day, times]) => (
            <div key={day} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-24">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={times.enabled}
                    onChange={(e) =>
                      setSchedule({
                        ...schedule,
                        [day]: { ...times, enabled: e.target.checked },
                      })
                    }
                    className="rounded"
                  />
                  <span className="font-medium capitalize">{day}</span>
                </label>
              </div>
              {times.enabled && (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="time"
                    value={times.start}
                    onChange={(e) =>
                      setSchedule({ ...schedule, [day]: { ...times, start: e.target.value } })
                    }
                    className="w-32"
                  />
                  <span className="text-gray-600">to</span>
                  <Input
                    type="time"
                    value={times.end}
                    onChange={(e) =>
                      setSchedule({ ...schedule, [day]: { ...times, end: e.target.value } })
                    }
                    className="w-32"
                  />
                </div>
              )}
            </div>
          ))}
          <Button variant="primary" onClick={handleSave} isLoading={isPending}>
            Save Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}

// Time Off Tab
function TimeOffTab() {
  const { data: timeOffData, isLoading } = useTimeOff();
  const { mutate: createTimeOff } = useAddTimeOff();
  const { mutate: deleteTimeOff } = useDeleteTimeOff();
  const [showAddForm, setShowAddForm] = useState(false);
  const [conflictCheck, setConflictCheck] = useState<{ hasConflict: boolean; conflicts: any[] } | null>(null);
  const { showToast } = useToast();

  const timeOffs = timeOffData || [];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Time Off</CardTitle>
            <Button variant="primary" size="sm" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Time Off
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loading size="md" text="Loading time off..." />
          ) : timeOffs.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No time off scheduled.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {timeOffs.map((timeOff: any) => (
                <div
                  key={timeOff.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {format(new Date(timeOff.start_date), 'MMM d')} -{' '}
                      {format(new Date(timeOff.end_date), 'MMM d, yyyy')}
                    </p>
                    {timeOff.reason && (
                      <p className="text-sm text-gray-600 mt-1">{timeOff.reason}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm('Remove this time off?')) {
                        deleteTimeOff(timeOff.id);
                      }
                    }}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Time Off Modal */}
      {showAddForm && (
        <AddTimeOffModal
          onClose={() => setShowAddForm(false)}
          onCreate={(data) => {
            // Check for conflicts before creating
            cleanerEnhancedService
              .detectConflicts(data.start_date, data.end_date)
              .then((result) => {
                const r = result as { conflicts?: unknown[] };
                if (r?.conflicts && r.conflicts.length > 0) {
                  setConflictCheck({ hasConflict: true, conflicts: r.conflicts });
                  if (confirm(`Warning: ${r.conflicts!.length} job(s) conflict with this time off. Continue anyway?`)) {
                    createTimeOff(data, {
                      onSuccess: () => {
                        setShowAddForm(false);
                        setConflictCheck(null);
                        showToast('Time off added!', 'success');
                      },
                    });
                  }
                } else {
                  createTimeOff(data, {
                    onSuccess: () => {
                      setShowAddForm(false);
                      setConflictCheck(null);
                      showToast('Time off added!', 'success');
                    },
                  });
                }
              })
              .catch(() => {
                // If conflict check fails, proceed anyway
                createTimeOff(data, {
                  onSuccess: () => {
                    setShowAddForm(false);
                    showToast('Time off added!', 'success');
                  },
                });
              });
          }}
        />
      )}

      {/* Conflict Warning */}
      {conflictCheck && conflictCheck.hasConflict && (
        <Card className="mt-4 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 mb-1">Scheduling Conflicts Detected</h3>
                <p className="text-sm text-orange-700">
                  {conflictCheck.conflicts.length} job(s) conflict with the selected time off period.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

// Add Time Off Modal
function AddTimeOffModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    all_day: true,
    start_time: '',
    end_time: '',
    reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Add Time Off</CardTitle>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                />
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.all_day}
                onChange={(e) => setFormData({ ...formData, all_day: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-gray-700">All day</span>
            </label>
            {!formData.all_day && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <Input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <Input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
              <Input
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Vacation, personal, etc."
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                Add Time Off
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Preferences Tab
function PreferencesTab() {
  type PreferencesResponse = {
    preferences?: {
      max_jobs_per_day?: number;
      min_job_duration?: number;
      max_job_duration?: number;
      buffer_time_minutes?: number;
      accept_same_day?: boolean;
    };
  };
  const { showToast } = useToast();
  const { data: preferencesData } = useQuery<PreferencesResponse>({
    queryKey: ['cleaner', 'preferences'],
    queryFn: () => apiClient.get('/cleaner/preferences') as Promise<PreferencesResponse>,
  });

  const [preferences, setPreferences] = useState({
    max_jobs_per_day: preferencesData?.preferences?.max_jobs_per_day || 3,
    min_job_duration: preferencesData?.preferences?.min_job_duration || 2,
    max_job_duration: preferencesData?.preferences?.max_job_duration || 8,
    buffer_time_minutes: preferencesData?.preferences?.buffer_time_minutes || 30,
    accept_same_day: preferencesData?.preferences?.accept_same_day || false,
  });

  const { mutate: updatePreferences, isPending } = useMutation({
    mutationFn: (data: any) => apiClient.put('/cleaner/preferences', data),
    onSuccess: () => {
      showToast('Preferences saved!', 'success');
    },
  });

  const handleSave = () => {
    updatePreferences(preferences);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Jobs Per Day
          </label>
          <Input
            type="number"
            value={preferences.max_jobs_per_day}
            onChange={(e) =>
              setPreferences({ ...preferences, max_jobs_per_day: parseInt(e.target.value) || 1 })
            }
            min="1"
            max="10"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Job Duration (hours)
            </label>
            <Input
              type="number"
              value={preferences.min_job_duration}
              onChange={(e) =>
                setPreferences({ ...preferences, min_job_duration: parseInt(e.target.value) || 1 })
              }
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Job Duration (hours)
            </label>
            <Input
              type="number"
              value={preferences.max_job_duration}
              onChange={(e) =>
                setPreferences({ ...preferences, max_job_duration: parseInt(e.target.value) || 8 })
              }
              min="1"
              max="12"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buffer Time Between Jobs (minutes)
          </label>
          <Input
            type="number"
            value={preferences.buffer_time_minutes}
            onChange={(e) =>
              setPreferences({ ...preferences, buffer_time_minutes: parseInt(e.target.value) || 0 })
            }
            min="0"
            max="120"
            step="15"
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={preferences.accept_same_day}
            onChange={(e) =>
              setPreferences({ ...preferences, accept_same_day: e.target.checked })
            }
            className="rounded"
          />
          <span className="text-gray-700">Accept same-day bookings</span>
        </label>
        <Button variant="primary" onClick={handleSave} isLoading={isPending}>
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
