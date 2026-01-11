'use client';

import React from 'react';
import { useToast } from '@/contexts/ToastContext';
import { cn } from '@/lib/utils';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'min-w-[300px] max-w-md p-4 rounded-lg shadow-lg border-2 animate-slide-in flex items-start gap-3',
            toast.type === 'success' && 'bg-green-50 border-green-500 text-green-900',
            toast.type === 'error' && 'bg-red-50 border-red-500 text-red-900',
            toast.type === 'warning' && 'bg-yellow-50 border-yellow-500 text-yellow-900',
            toast.type === 'info' && 'bg-blue-50 border-blue-500 text-blue-900'
          )}
        >
          <div className="flex-shrink-0 text-2xl">
            {toast.type === 'success' && '✓'}
            {toast.type === 'error' && '✕'}
            {toast.type === 'warning' && '⚠'}
            {toast.type === 'info' && 'ℹ'}
          </div>
          <div className="flex-1">
            <p className="font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-xl opacity-70 hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

