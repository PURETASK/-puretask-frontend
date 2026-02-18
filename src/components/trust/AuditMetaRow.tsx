'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Copy } from 'lucide-react';

interface AuditMetaRowProps {
  label: string;
  value: string | React.ReactNode;
  copyable?: boolean;
  mono?: boolean;
  className?: string;
}

export function AuditMetaRow({
  label,
  value,
  copyable = false,
  mono = false,
  className,
}: AuditMetaRowProps) {
  const handleCopy = () => {
    if (typeof value === 'string' && navigator.clipboard) {
      navigator.clipboard.writeText(value);
    }
  };

  return (
    <div className={cn('flex justify-between gap-4 py-2 text-sm', className)}>
      <span className="text-gray-500">{label}</span>
      <span className={cn('flex items-center gap-2 text-right', mono && 'font-mono text-gray-900')}>
        {value}
        {copyable && typeof value === 'string' && (
          <button
            type="button"
            onClick={handleCopy}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Copy"
          >
            <Copy className="h-4 w-4" />
          </button>
        )}
      </span>
    </div>
  );
}
