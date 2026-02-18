'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { DollarSign } from 'lucide-react';

interface CreditsBalanceCardProps {
  balance: number;
  lastUpdatedISO: string;
  className?: string;
}

export function CreditsBalanceCard({
  balance,
  lastUpdatedISO,
  className,
}: CreditsBalanceCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-6 shadow-sm',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <DollarSign className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Available balance</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(balance)}</p>
          <p className="text-xs text-gray-400">Updated {format(new Date(lastUpdatedISO), 'MMM d, yyyy')}</p>
        </div>
      </div>
    </div>
  );
}
