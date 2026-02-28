'use client';

import React from 'react';
import { Calendar, Search, MessageCircle, Star, FileText, ListOrdered, User, Bell } from 'lucide-react';
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
  /** Optional gradient accent on icon container */
  accent?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  accent = false,
}: EmptyStateProps) {
  return (
    <Card className={cn('border border-dashed border-gray-200', className)}>
      <CardContent className="p-10 md:p-12 text-center">
        {icon && (
          <div
            className={cn(
              'inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5',
              accent && 'text-white'
            )}
            style={accent ? { background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-aqua))' } : undefined}
          >
            <div className={cn(!accent && 'text-gray-400')}>{icon}</div>
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-gray-600 mb-6 max-w-sm mx-auto text-sm">{description}</p>
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

// Pre-built empty states for common use cases (Lucide icons, helpful copy)
export function EmptyBookings() {
  return (
    <EmptyState
      icon={<Calendar className="h-8 w-8" />}
      title="No bookings yet"
      description="Book your first cleaning and see your appointments here."
      action={{
        label: 'Book a service',
        onClick: () => (window.location.href = '/booking'),
      }}
      accent
    />
  );
}

export function EmptyCleaners() {
  return (
    <EmptyState
      icon={<Search className="h-8 w-8" />}
      title="No cleaners found"
      description="Try different filters or a wider search area."
      action={{
        label: 'Clear filters',
        onClick: () => window.location.reload(),
        variant: 'outline',
      }}
    />
  );
}

export function EmptyMessages() {
  return (
    <EmptyState
      icon={<MessageCircle className="h-8 w-8" />}
      title="No messages yet"
      description="Conversations with your cleaner or client will appear here."
    />
  );
}

export function EmptyFavorites() {
  return (
    <EmptyState
      icon={<Star className="h-8 w-8" />}
      title="No favorite cleaners yet"
      description="Save cleaners you like to book them again quickly."
      action={{
        label: 'Find cleaners',
        onClick: () => (window.location.href = '/search'),
      }}
      accent
    />
  );
}

export function EmptyReviews() {
  return (
    <EmptyState
      icon={<Star className="h-8 w-8" />}
      title="No reviews yet"
      description="After you complete a booking, you can leave a review here."
    />
  );
}

export function EmptyInvoices() {
  return (
    <EmptyState
      icon={<FileText className="h-8 w-8" />}
      title="No invoices yet"
      description="Invoices will appear when you have bookings or credit purchases."
    />
  );
}

export function EmptyLedger() {
  return (
    <EmptyState
      icon={<ListOrdered className="h-8 w-8" />}
      title="No transactions yet"
      description="Your credit balance and transaction history will show here."
      action={{
        label: 'Buy credits',
        onClick: () => (window.location.href = '/client/credits-trust'),
      }}
      accent
    />
  );
}

export function EmptyAdminBookings() {
  return (
    <EmptyState
      icon={<Calendar className="h-8 w-8" />}
      title="No bookings match"
      description="Adjust filters or check back later."
    />
  );
}

export function EmptyAdminUsers() {
  return (
    <EmptyState
      icon={<User className="h-8 w-8" />}
      title="No users match"
      description="Try a different search or filters."
    />
  );
}

export function EmptyNotifications() {
  return (
    <EmptyState
      icon={<Bell className="h-8 w-8" />}
      title="No notifications"
      description="Booking updates and messages will show here when they arrive."
    />
  );
}
