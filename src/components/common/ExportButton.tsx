'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  onExport: (format: 'csv' | 'pdf') => void;
  formats?: ('csv' | 'pdf')[];
  disabled?: boolean;
}

export function ExportButton({
  onExport,
  formats = ['csv'],
  disabled,
}: ExportButtonProps) {
  if (formats.length === 0) return null;

  return (
    <div className="flex gap-2">
      {formats.map((fmt) => (
        <Button
          key={fmt}
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onExport(fmt)}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export {fmt.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
