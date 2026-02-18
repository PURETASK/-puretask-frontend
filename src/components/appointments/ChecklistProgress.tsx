'use client';

import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { ChecklistItem } from '@/types/appointment';
import { Check } from 'lucide-react';

interface ChecklistProgressProps {
  items: ChecklistItem[];
}

export function ChecklistProgress({ items }: ChecklistProgressProps) {
  const completed = items.filter((i) => i.completed).length;
  const total = items.length;
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex justify-between">
        <h3 className="font-semibold text-gray-900">Checklist</h3>
        <span className="text-sm text-gray-500">
          {completed}/{total} completed
        </span>
      </div>
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-green-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              'flex items-center gap-3 rounded-lg border p-2',
              item.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
            )}
          >
            {item.completed ? (
              <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
            ) : (
              <div className="h-5 w-5 flex-shrink-0 rounded border border-gray-300" />
            )}
            <span className={item.completed ? 'text-gray-600 line-through' : ''}>{item.label}</span>
            {item.completedAtISO && (
              <span className="ml-auto text-xs text-gray-500">
                {format(new Date(item.completedAtISO), 'h:mm a')}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
