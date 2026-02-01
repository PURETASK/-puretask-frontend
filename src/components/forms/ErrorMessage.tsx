'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  className?: string;
  id?: string;
}

export function ErrorMessage({ message, className, id }: ErrorMessageProps) {
  return (
    <div
      className={cn('flex items-center gap-2 text-sm text-red-600', className)}
      role="alert"
      id={id}
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
