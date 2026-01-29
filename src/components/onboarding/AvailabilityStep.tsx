// src/components/onboarding/AvailabilityStep.tsx
// Step 8: Availability Schedule

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface AvailabilityStepProps {
  onNext: (blocks: Array<{
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
  }>) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const TEMPLATES = {
  weekdays: {
    label: 'Weekdays 9-5',
    blocks: DAYS.filter((d) => d.value >= 1 && d.value <= 5).map((d) => ({
      day_of_week: d.value,
      start_time: '09:00',
      end_time: '17:00',
      is_active: true,
    })),
  },
  flexible: {
    label: 'Flexible (All Days 8 AM - 8 PM)',
    blocks: DAYS.map((d) => ({
      day_of_week: d.value,
      start_time: '08:00',
      end_time: '20:00',
      is_active: true,
    })),
  },
  weekends: {
    label: 'Weekends Only',
    blocks: DAYS.filter((d) => d.value === 0 || d.value === 6).map((d) => ({
      day_of_week: d.value,
      start_time: '09:00',
      end_time: '17:00',
      is_active: true,
    })),
  },
};

export function AvailabilityStep({ onNext, onBack, isLoading }: AvailabilityStepProps) {
  const [blocks, setBlocks] = useState<Array<{
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
  }>>(
    DAYS.map((day) => ({
      day_of_week: day.value,
      start_time: day.value >= 1 && day.value <= 5 ? '09:00' : '',
      end_time: day.value >= 1 && day.value <= 5 ? '17:00' : '',
      is_active: day.value >= 1 && day.value <= 5,
    }))
  );

  const applyTemplate = (template: keyof typeof TEMPLATES) => {
    const templateBlocks = TEMPLATES[template].blocks;
    setBlocks(
      DAYS.map((day) => {
        const templateBlock = templateBlocks.find((b) => b.day_of_week === day.value);
        return templateBlock || {
          day_of_week: day.value,
          start_time: '',
          end_time: '',
          is_active: false,
        };
      })
    );
  };

  const updateBlock = (dayOfWeek: number, updates: Partial<typeof blocks[0]>) => {
    setBlocks(
      blocks.map((block) =>
        block.day_of_week === dayOfWeek ? { ...block, ...updates } : block
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activeBlocks = blocks.filter((b) => b.is_active);
    if (activeBlocks.length > 0) {
      onNext(blocks);
    }
  };

  const activeDays = blocks.filter((b) => b.is_active).length;
  const canContinue = activeDays > 0;

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Set your availability</h2>
          <p className="text-gray-600">
            Choose the days and times you're available to work. You can always update this later.
          </p>
        </div>

        {/* Holiday notice */}
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          <div className="font-semibold">Federal holidays are optional</div>
          <div>Cleaners are independent contractors and are never required to work holidays.</div>
          <div className="mt-2">You control your availability on all federal holidays.</div>
        </div>

        {/* Quick templates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quick Templates</label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => applyTemplate('weekdays')}
            >
              Weekdays 9-5
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => applyTemplate('flexible')}
            >
              Flexible
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => applyTemplate('weekends')}
            >
              Weekends Only
            </Button>
          </div>
        </div>

        {/* Day-by-day schedule */}
        <div className="space-y-3">
          {DAYS.map((day) => {
            const block = blocks.find((b) => b.day_of_week === day.value);
            return (
              <div key={day.value} className="flex items-center gap-4 p-3 border rounded-lg">
                <input
                  type="checkbox"
                  checked={block?.is_active || false}
                  onChange={(e) =>
                    updateBlock(day.value, {
                      is_active: e.target.checked,
                      start_time: e.target.checked ? block?.start_time || '09:00' : '',
                      end_time: e.target.checked ? block?.end_time || '17:00' : '',
                    })
                  }
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded"
                />
                <span className="w-24 text-gray-900 font-medium">{day.label}</span>
                {block?.is_active ? (
                  <>
                    <Input
                      type="time"
                      value={block.start_time}
                      onChange={(e) => updateBlock(day.value, { start_time: e.target.value })}
                      className="flex-1 min-h-[44px]"
                    />
                    <span className="text-gray-600">to</span>
                    <Input
                      type="time"
                      value={block.end_time}
                      onChange={(e) => updateBlock(day.value, { end_time: e.target.value })}
                      className="flex-1 min-h-[44px]"
                    />
                  </>
                ) : (
                  <span className="flex-1 text-gray-400 text-sm">Not available</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          {onBack && (
            <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
              ← Back
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={!canContinue || isLoading}
          >
            {isLoading ? 'Saving...' : 'Continue →'}
          </Button>
        </div>
      </div>
    </form>
  );
}
