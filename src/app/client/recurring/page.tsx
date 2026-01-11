'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export default function RecurringBookingsPage() {
  const [showNewSchedule, setShowNewSchedule] = useState(false);

  const recurringBookings = [
    {
      id: 'rb1',
      cleaner: 'Jane Doe',
      service: 'Standard Cleaning',
      frequency: 'Weekly',
      dayOfWeek: 'Monday',
      time: '9:00 AM',
      nextDate: 'Jan 15, 2026',
      status: 'Active',
      totalBookings: 12,
      price: 135,
    },
    {
      id: 'rb2',
      cleaner: 'Mike Smith',
      service: 'Deep Cleaning',
      frequency: 'Bi-weekly',
      dayOfWeek: 'Saturday',
      time: '10:00 AM',
      nextDate: 'Jan 20, 2026',
      status: 'Active',
      totalBookings: 6,
      price: 195,
    },
    {
      id: 'rb3',
      cleaner: 'Lisa Brown',
      service: 'Standard Cleaning',
      frequency: 'Monthly',
      dayOfWeek: 'First Tuesday',
      time: '2:00 PM',
      nextDate: 'Feb 4, 2026',
      status: 'Paused',
      totalBookings: 3,
      price: 135,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">🔄 Recurring Bookings</h1>
              <p className="text-gray-600">Manage your automated cleaning schedules</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => (window.location.href = '/client/dashboard')}>
                ← Back to Dashboard
              </Button>
              <Button variant="primary" onClick={() => setShowNewSchedule(true)}>
                + New Schedule
              </Button>
            </div>
          </div>

          {/* Benefits Banner */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <span className="text-4xl">✨</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Save 10% with Recurring Bookings!</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ Automatic scheduling - never forget a cleaning</li>
                    <li>✓ Priority booking with your favorite cleaners</li>
                    <li>✓ Flexible - pause or modify anytime</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Schedules */}
          <div className="space-y-4">
            {recurringBookings.map((booking) => (
              <Card key={booking.id} className={booking.status === 'Paused' ? 'opacity-60' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{booking.cleaner}</h3>
                        <Badge variant={booking.status === 'Active' ? 'primary' : 'secondary'}>
                          {booking.status}
                        </Badge>
                        <Badge variant="secondary">{booking.frequency}</Badge>
                      </div>
                      <p className="text-gray-700 mb-1">{booking.service} - ${booking.price}</p>
                      <p className="text-sm text-gray-600">
                        Every {booking.dayOfWeek} at {booking.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Next cleaning:</p>
                      <p className="text-lg font-semibold text-gray-900">{booking.nextDate}</p>
                      <p className="text-xs text-gray-500 mt-1">{booking.totalBookings} completed</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {booking.status === 'Active' ? (
                      <Button variant="outline" size="sm">
                        ⏸️ Pause
                      </Button>
                    ) : (
                      <Button variant="primary" size="sm">
                        ▶️ Resume
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      ✏️ Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      📅 View History
                    </Button>
                    <Button variant="danger" size="sm">
                      🗑️ Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* New Schedule Modal/Card */}
          {showNewSchedule && (
            <Card className="mt-8 border-2 border-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Create New Recurring Schedule</CardTitle>
                  <Button variant="ghost" onClick={() => setShowNewSchedule(false)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Cleaner</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option>Jane Doe - $45/hr</option>
                    <option>Mike Smith - $50/hr</option>
                    <option>Lisa Brown - $48/hr</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option>Standard Cleaning</option>
                    <option>Deep Cleaning</option>
                    <option>Move In/Out</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Weekly', 'Bi-weekly', 'Monthly'].map((freq) => (
                      <button
                        key={freq}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50"
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                      <option>Saturday</option>
                      <option>Sunday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <Input type="time" defaultValue="09:00" />
                  </div>
                </div>

                <Input label="Duration (hours)" type="number" defaultValue="3" />

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-700">Estimated cost per cleaning:</span>
                    <span className="text-2xl font-bold text-gray-900">$135</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setShowNewSchedule(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" className="flex-1">
                      Create Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

