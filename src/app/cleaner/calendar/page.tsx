'use client';
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
export default function CalendarPage() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const bookings = [
    { day: 15, time: '10:00 AM', client: 'Sarah J.', service: 'Standard' },
    { day: 18, time: '2:00 PM', client: 'Mike C.', service: 'Deep' },
    { day: 22, time: '9:00 AM', client: 'Emily D.', service: 'Standard' },
  ];
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Calendar</h1>
            <div className="flex gap-2">
              <Button variant="outline">??? Previous</Button>
              <Button variant="outline">Next ???</Button>
            </div>
          </div>
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
                  return (
                    <div
                      key={day}
                      className={`min-h-24 p-2 border rounded-lg ${
                        booking ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{day}</div>
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
