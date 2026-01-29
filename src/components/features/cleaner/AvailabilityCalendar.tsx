'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useCleanerAvailability } from '@/hooks/useCleaners';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';

interface AvailabilityCalendarProps {
  cleanerId: string;
}

export function AvailabilityCalendar({ cleanerId }: AvailabilityCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date());
  const { data: availabilityData, isLoading } = useCleanerAvailability(cleanerId, format(viewDate, 'yyyy-MM-dd'));

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = monthStart.getDay();

  const availableSlots = availabilityData?.available_slots || [];

  const getDayStatus = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    // Check if there are available slots for this day
    const hasSlots = availableSlots.some((slot: string) => slot.startsWith(dayStr));
    return hasSlots ? 'available' : 'unavailable';
  };

  return (
    <Card id="availability-section">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Availability Calendar</CardTitle>
          <div className="flex gap-2">
            <button
              onClick={() => setViewDate(subMonths(viewDate, 1))}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ←
            </button>
            <span className="px-4 py-1 font-medium">
              {format(viewDate, 'MMMM yyyy')}
            </span>
            <button
              onClick={() => setViewDate(addMonths(viewDate, 1))}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              →
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-gray-600">Loading availability...</div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-semibold text-gray-700 text-sm py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfWeek }, (_, i) => (
                <div key={`empty-${i}`} className="h-10" />
              ))}
              {/* Days of month */}
              {daysInMonth.map((day) => {
                const status = getDayStatus(day);
                const isToday = isSameDay(day, new Date());
                return (
                  <div
                    key={day.toISOString()}
                    className={`h-10 flex items-center justify-center rounded-lg border ${
                      status === 'available'
                        ? 'bg-green-50 border-green-200 text-green-900'
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <span className={`text-sm font-medium ${isToday ? 'font-bold' : ''}`}>
                      {format(day, 'd')}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
                <span className="text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
                <span className="text-gray-600">Unavailable</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
