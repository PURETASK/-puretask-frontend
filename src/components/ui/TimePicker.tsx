'use client';

import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface TimePickerProps {
  value?: string; // HH:mm format
  onChange: (time: string) => void;
  className?: string;
  placeholder?: string;
  step?: number; // minutes
}

export function TimePicker({
  value,
  onChange,
  className,
  placeholder = 'Select time',
  step = 15,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Generate time options
  const timeOptions: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += step) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(timeString);
    }
  }

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start text-left font-normal"
      >
        <Clock className="mr-2 h-4 w-4" />
        {value ? formatTime(value) : <span className="text-gray-500">{placeholder}</span>}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 w-48 max-h-64 overflow-y-auto">
            {timeOptions.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => {
                  onChange(time);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                  value === time
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                )}
              >
                {formatTime(time)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
