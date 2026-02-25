'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'outline';
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className="p-12 text-center">
        {icon && (
          <div className="flex justify-center mb-4">
            <div className="text-6xl">{icon}</div>
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
        )}
        {action && (
          <Button variant={action.variant || 'primary'} onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Pre-built empty states for common use cases
export function EmptyBookings() {
  return (
    <EmptyState
      icon="📅"
      title="No bookings yet"
      description="Start by booking your first cleaning service"
      action={{
        label: 'Book a Service',
        onClick: () => (window.location.href = '/booking'),
      }}
    />
  );
}

export function EmptyCleaners() {
  return (
    <EmptyState
      icon="🧹"
      title="No cleaners found"
      description="Try adjusting your search filters or check back later"
      action={{
        label: 'Clear Filters',
        onClick: () => window.location.reload(),
        variant: 'outline',
      }}
    />
  );
}

export function EmptyMessages() {
  return (
    <EmptyState
      icon="💬"
      title="No messages yet"
      description="Start a conversation with your cleaner or client"
    />
  );
}

export function EmptyFavorites() {
  return (
    <EmptyState
      icon="⭐"
      title="No favorite cleaners yet"
      description="Add cleaners to your favorites for quick booking"
      action={{
        label: 'Browse Cleaners',
        onClick: () => (window.location.href = '/search'),
      }}
    />
  );
}

export function EmptyReviews() {
  return (
    <EmptyState
      icon="⭐"
      title="No reviews yet"
      description="Reviews will appear here after you complete bookings"
    />
  );
}

export function EmptyInvoices() {
  return (
    <EmptyState
      icon="📄"
      title="No invoices yet"
      description="Invoices will appear here when you have bookings or purchases"
    />
  );
}

export function EmptyLedger() {
  return (
    <EmptyState
      icon="📋"
      title="No transactions yet"
      description="Your credit transactions will show here"
      action={{
        label: 'Buy credits',
        onClick: () => (window.location.href = '/client/credits-trust'),
      }}
    />
  );
}

export function EmptyAdminBookings() {
  return (
    <EmptyState
      icon="📅"
      title="No bookings match"
      description="Try adjusting filters or check back later."
    />
  );
}

export function EmptyAdminUsers() {
  return (
    <EmptyState
      icon="👤"
      title="No users match"
      description="Try adjusting search or filters."
    />
  );
}

export function EmptyNotifications() {
  return (
    <EmptyState
      icon="🔔"
      title="No notifications"
      description="When you get booking updates or messages, they'll show here."
    />
  );
}
