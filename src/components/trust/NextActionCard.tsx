'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface NextActionCardProps {
  /** Short title (e.g. "Review & complete") */
  title: string;
  /** One sentence explaining what happens next or what the user should do */
  description: string;
  /** Primary CTA */
  primaryAction: {
    label: string;
    onClick: () => void;
    isLoading?: boolean;
  };
  /** Optional secondary CTA (e.g. Open dispute) */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** Visual tone */
  variant?: 'default' | 'highlight' | 'success';
  className?: string;
}

export function NextActionCard({
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = 'default',
  className,
}: NextActionCardProps) {
  const variantStyles = {
    default: 'border-gray-200 bg-white',
    highlight: 'border-[var(--brand-blue)]/30 bg-[rgba(0,120,255,0.06)]',
    success: 'border-[var(--brand-mint)]/30 bg-[rgba(40,199,111,0.08)]',
  };

  return (
    <Card className={cn('rounded-xl', variantStyles[variant], className)}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        <Button
          variant="primary"
          onClick={primaryAction.onClick}
          isLoading={primaryAction.isLoading}
          className="min-w-[180px]"
        >
          {primaryAction.label}
        </Button>
        {secondaryAction && (
          <Button
            variant="outline"
            onClick={secondaryAction.onClick}
            disabled={primaryAction.isLoading}
            className="border-gray-300"
          >
            {secondaryAction.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
