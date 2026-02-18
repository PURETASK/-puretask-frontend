'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface NextActionCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function NextActionCard({ title, description, action, className }: NextActionCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border-2 border-blue-200 bg-blue-50 p-4',
        className
      )}
    >
      <h4 className="font-semibold text-blue-900">Next action</h4>
      <p className="mt-1 text-sm text-blue-800">{title}</p>
      {description && <p className="mt-1 text-sm text-blue-700">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
