'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
export function DateTimePicker() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const dates = [
    { value: '2026-01-11', label: 'Sat, Jan 11' },
    { value: '2026-01-12', label: 'Sun, Jan 12' },
    { value: '2026-01-13', label: 'Mon, Jan 13' },
    { value: '2026-01-14', label: 'Tue, Jan 14' },
    { value: '2026-01-15', label: 'Wed, Jan 15' },
  ];
  const times = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM',
  ];
  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div>
        <label className="block text-lg font-semibold text-gray-900 mb-3">
          Select Date
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {dates.map((date) => (
            <button
              key={date.value}
              onClick={() => setSelectedDate(date.value)}
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                selectedDate === date.value
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-medium">{date.label}</div>
            </button>
          ))}
        </div>
      </div>
      {/* Time Selection */}
      {selectedDate && (
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Select Time
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {times.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-3 border-2 rounded-lg text-center transition-all ${
                  selectedTime === time
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
