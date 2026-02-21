'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface NextBestActionCardProps {
  title: string;
  description?: string;
  actionHref: string;
  actionLabel: string;
  unlockPreview?: string;
  className?: string;
}

export function NextBestActionCard({
  title,
  description,
  actionHref,
  actionLabel,
  unlockPreview,
  className,
}: NextBestActionCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
        {unlockPreview && (
          <p className="text-xs text-blue-600 mt-1">Do this next → {unlockPreview}</p>
        )}
        <Link
          href={actionHref}
          className="mt-3 inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          {actionLabel}
        </Link>
      </CardContent>
    </Card>
  );
}
