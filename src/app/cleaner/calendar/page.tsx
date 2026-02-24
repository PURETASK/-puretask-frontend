'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SkeletonList } from '@/components/ui/Skeleton';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { holidayService, CleanerHolidayOverride, CleanerHolidaySettings, Holiday } from '@/services/holiday.service';
import { useCleanerSchedule, useTimeOff, useAddTimeOff, useDeleteTimeOff } from '@/hooks/useCleanerAvailability';
import { useAssignedJobs } from '@/hooks/useCleanerJobs';
import { useQuery, useMutation } from '@tanstack/react-query';
import { cleanerEnhancedService } from '@/services/cleanerEnhanced.service';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay } from 'date-fns';
import { AlertTriangle, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { formatCurrency } from '@/lib/utils';

type HolidayStatus = 'unavailable' | 'available' | 'custom';

export default function CalendarPage() {
  return (
    <ProtectedRoute requiredRole="cleaner">
      <CalendarPageContent />
    </ProtectedRoute>
  );
}

function CalendarPageContent() {
  const [viewDate, setViewDate] = useState(new Date());
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [settings, setSettings] = useState<CleanerHolidaySettings | null>(null);
  const [overrides, setOverrides] = useState<Record<string, CleanerHolidayOverride>>({});
  const [savingOverrides, setSavingOverrides] = useState<Record<string, boolean>>({});
  const { showToast } = useToast();

  // Detect conflicts for current month
  type ConflictsResponse = { conflicts?: unknown[] };
  const { data: conflictsData } = useQuery<ConflictsResponse>({
    queryKey: ['cleaner', 'calendar', 'conflicts', viewYear, viewMonth],
    queryFn: async () => {
      const monthStart = startOfMonth(viewDate);
      const monthEnd = endOfMonth(viewDate);
      return cleanerEnhancedService.detectConflicts(
        format(monthStart, 'yyyy-MM-dd'),
        format(monthEnd, 'yyyy-MM-dd')
      ) as Promise<ConflictsResponse>;
    },
    enabled: true,
  });

  // Get schedule optimization suggestions
  type OptimizationResponse = { suggestions?: { recommendation?: string; optimalTimes?: unknown[] } };
  const { mutate: optimizeSchedule, data: optimizationData } = useMutation<OptimizationResponse, Error, string>({
    mutationFn: (date: string) => cleanerEnhancedService.optimizeSchedule(date) as Promise<OptimizationResponse>,
    onSuccess: () => {
      showToast('Schedule optimized!', 'success');
    },
  });

  const { data: assignedJobs = [] } = useAssignedJobs();
  const bookings = useMemo(() => {
    return assignedJobs
      .filter((job) => {
        const d = new Date(job.scheduled_start_at);
        return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
      })
      .map((job) => {
        const d = new Date(job.scheduled_start_at);
        const clientName = (job as { client?: { full_name?: string } }).client?.full_name ?? `Client`;
        return {
          day: d.getDate(),
          time: format(d, 'HH:mm'),
          client: clientName,
        };
      });
  }, [assignedJobs, viewYear, viewMonth]);

  const calendarHolidays = useMemo(() => {
    const map = new Map<number, Holiday>();
    holidays.forEach((holiday) => {
      const holidayDate = new Date(`${holiday.holiday_date}T00:00:00`);
      if (holidayDate.getUTCFullYear() === viewYear && holidayDate.getUTCMonth() === viewMonth) {
        map.set(holidayDate.getUTCDate(), holiday);
      }
    });
    return map;
  }, [holidays, viewMonth, viewYear]);

  useEffect(() => {
    const fetchData = async () => {
      const monthStart = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-01`;
      const monthEndDate = new Date(viewYear, viewMonth + 1, 0);
      const monthEnd = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(
        monthEndDate.getDate()
      ).padStart(2, '0')}`;

      const [holidayResponse, settingsResponse, overridesResponse] = await Promise.allSettled([
        holidayService.listHolidays({ from: monthStart, to: monthEnd }),
        holidayService.getCleanerHolidaySettings(),
        holidayService.listCleanerHolidayOverrides({ from: monthStart, to: monthEnd }),
      ]);

      if (holidayResponse.status === 'fulfilled') {
        setHolidays(holidayResponse.value.holidays ?? []);
      }

      if (settingsResponse.status === 'fulfilled') {
        setSettings(settingsResponse.value.settings);
      }

      if (overridesResponse.status === 'fulfilled') {
        const overrideMap: Record<string, CleanerHolidayOverride> = {};
        overridesResponse.value.overrides.forEach((override) => {
          overrideMap[override.holiday_date] = override;
        });
        setOverrides(overrideMap);
      }
    };

    fetchData();
  }, [viewMonth, viewYear]);

  const updateSettings = async (updates: Partial<CleanerHolidaySettings>) => {
    const response = await holidayService.updateCleanerHolidaySettings(updates);
    setSettings(response.settings);
  };

  const resolveStatus = (override?: CleanerHolidayOverride): HolidayStatus => {
    if (!override) {
      return settings?.available_on_federal_holidays ? 'available' : 'unavailable';
    }
    if (!override.available) return 'unavailable';
    if (override.start_time_local && override.end_time_local) return 'custom';
    return 'available';
  };

  const saveOverride = async (holiday: Holiday, override: CleanerHolidayOverride) => {
    setSavingOverrides((prev) => ({ ...prev, [holiday.holiday_date]: true }));
    try {
      const response = await holidayService.upsertCleanerHolidayOverride(holiday.holiday_date, {
        available: override.available,
        start_time_local: override.start_time_local,
        end_time_local: override.end_time_local,
        use_holiday_rate: override.use_holiday_rate,
        min_job_hours: override.min_job_hours,
        notes: override.notes,
      });
      setOverrides((prev) => ({ ...prev, [holiday.holiday_date]: response.override }));
    } finally {
      setSavingOverrides((prev) => ({ ...prev, [holiday.holiday_date]: false }));
    }
  };

  const ensureOverride = (holiday: Holiday): CleanerHolidayOverride => {
    return (
      overrides[holiday.holiday_date] ?? {
        holiday_date: holiday.holiday_date,
        name: holiday.name,
        available: settings?.available_on_federal_holidays ?? false,
        start_time_local: null,
        end_time_local: null,
        use_holiday_rate: settings?.holiday_rate_enabled ?? false,
        min_job_hours: null,
        notes: null,
      }
    );
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Calendar</h1>
              <p className="text-gray-600 mt-1">Manage your availability and schedule</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setViewDate(subMonths(viewDate, 1))}
              >
                ← Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  optimizeSchedule(format(viewDate, 'yyyy-MM-dd'));
                }}
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Optimize
              </Button>
              <Button
                variant="outline"
                onClick={() => setViewDate(addMonths(viewDate, 1))}
              >
                Next →
              </Button>
            </div>
          </div>

          {/* Conflict Alerts */}
          {conflictsData?.conflicts && conflictsData.conflicts.length > 0 && (
            <Card className="mb-6 border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-900 mb-1">
                      Scheduling Conflicts Detected
                    </h3>
                    <p className="text-sm text-amber-800">
                      You have {conflictsData.conflicts.length} overlapping job(s) this month. Please review and adjust your schedule.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        // Scroll to conflicts or show details
                        showToast(`${conflictsData.conflicts?.length ?? 0} conflicts found`, 'warning');
                      }}
                    >
                      View Conflicts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Optimization Suggestions */}
          {optimizationData?.suggestions && (
            <Card className="mb-6 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-2">Schedule Optimization Suggestions</h3>
                    <p className="text-sm text-blue-800 mb-3">{optimizationData.suggestions?.recommendation}</p>
                    <div className="space-y-2">
                      {(optimizationData.suggestions?.optimalTimes ?? []).slice(0, 3).map((time: any, idx: number) => (
                        <div key={idx} className="text-sm text-blue-700">
                          <span className="font-medium">
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][time.dayOfWeek]} at {time.hour}:00
                          </span>
                          {' - '}
                          <span>Avg: {formatCurrency(time.avgEarnings)} ({time.jobCount} jobs)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Holiday Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                <div className="font-semibold">Federal holidays are optional</div>
                <div>Cleaners are independent contractors and are never required to work federal holidays.</div>
                <div className="mt-2">You control your availability and holiday pricing.</div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={settings?.available_on_federal_holidays ?? false}
                    onChange={(e) =>
                      updateSettings({ available_on_federal_holidays: e.target.checked })
                    }
                  />
                  <div>
                    <div className="font-medium text-gray-900">Available on federal holidays</div>
                    <div className="text-sm text-gray-600">
                      If off, you won’t receive requests on federal holidays.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={settings?.holiday_rate_enabled ?? false}
                    onChange={(e) => updateSettings({ holiday_rate_enabled: e.target.checked })}
                  />
                  <div>
                    <div className="font-medium text-gray-900">Enable holiday rate</div>
                    <div className="text-sm text-gray-600">
                      Clients see pricing upfront. Pricing power reflects your performance and reliability.
                    </div>
                  </div>
                </label>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-4 py-3 font-medium text-gray-900">
                  Upcoming Federal Holidays
                </div>
                <div className="divide-y divide-gray-200">
                  {holidays.length === 0 && (
                    <div className="px-4 py-6 text-sm text-gray-600">No holidays found.</div>
                  )}
                  {holidays.map((holiday) => {
                    const override = ensureOverride(holiday);
                    const status = resolveStatus(overrides[holiday.holiday_date]);
                    return (
                      <div key={holiday.holiday_date} className="px-4 py-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{holiday.name}</div>
                            <div className="text-sm text-gray-600">
                              {holiday.holiday_date} · Federal Holiday
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <select
                              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                              value={status}
                              onChange={(e) => {
                                const nextStatus = e.target.value as HolidayStatus;
                                const next = { ...override };
                                next.available = nextStatus !== 'unavailable';
                                if (nextStatus !== 'custom') {
                                  next.start_time_local = null;
                                  next.end_time_local = null;
                                }
                                setOverrides((prev) => ({ ...prev, [holiday.holiday_date]: next }));
                              }}
                            >
                              <option value="unavailable">Unavailable</option>
                              <option value="available">Available</option>
                              <option value="custom">Custom hours</option>
                            </select>
                            <label className="flex items-center gap-2 text-sm text-gray-700">
                              <input
                                type="checkbox"
                                checked={override.use_holiday_rate ?? false}
                                onChange={(e) =>
                                  setOverrides((prev) => ({
                                    ...prev,
                                    [holiday.holiday_date]: {
                                      ...override,
                                      use_holiday_rate: e.target.checked,
                                    },
                                  }))
                                }
                              />
                              Use holiday rate
                            </label>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={savingOverrides[holiday.holiday_date]}
                              onClick={() => saveOverride(holiday, override)}
                            >
                              {savingOverrides[holiday.holiday_date] ? 'Saving...' : 'Save'}
                            </Button>
                          </div>
                        </div>

                        {status === 'custom' && (
                          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                            <label className="flex items-center gap-2">
                              <span className="text-gray-600">Start</span>
                              <input
                                type="time"
                                className="rounded-md border border-gray-300 px-2 py-1"
                                value={override.start_time_local ?? ''}
                                onChange={(e) =>
                                  setOverrides((prev) => ({
                                    ...prev,
                                    [holiday.holiday_date]: {
                                      ...override,
                                      start_time_local: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </label>
                            <label className="flex items-center gap-2">
                              <span className="text-gray-600">End</span>
                              <input
                                type="time"
                                className="rounded-md border border-gray-300 px-2 py-1"
                                value={override.end_time_local ?? ''}
                                onChange={(e) =>
                                  setOverrides((prev) => ({
                                    ...prev,
                                    [holiday.holiday_date]: {
                                      ...override,
                                      end_time_local: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-sm text-gray-600">
                GPS check-in/out and before/after photos are required on holiday jobs. If a federal
                holiday affects bank processing, payouts are sent the prior business day. Instant payouts
                are always available (fee applies).
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>January 2026</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {days.map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-700 p-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const booking = bookings.find(b => b.day === day);
                  const holiday = calendarHolidays.get(day);
                  return (
                    <div
                      key={day}
                      className={`min-h-24 p-2 border rounded-lg ${
                        booking ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-gray-900">{day}</div>
                        {holiday && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                            Federal Holiday
                          </span>
                        )}
                      </div>
                      {holiday && (
                        <div className="mt-1 text-xs text-amber-800">{holiday.name}</div>
                      )}
                      {booking && (
                        <div className="mt-1 text-xs">
                          <div className="font-medium text-blue-600">{booking.time}</div>
                          <div className="text-gray-700">{booking.client}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
