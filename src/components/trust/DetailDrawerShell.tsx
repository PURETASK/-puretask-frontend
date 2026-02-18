'use client';

import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/Sheet';
import { cn } from '@/lib/utils';

interface DetailDrawerShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  side?: 'left' | 'right';
}

export function DetailDrawerShell({
  open,
  onOpenChange,
  title,
  description,
  children,
  actions,
  side = 'right',
}: DetailDrawerShellProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={title} description={description} side={side}>
        <div className="space-y-6">
          {children}
          {actions && (
            <div className="border-t pt-4 flex gap-2 justify-end flex-wrap">{actions}</div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
