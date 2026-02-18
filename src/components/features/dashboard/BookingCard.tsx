'use client';
import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
interface BookingCardProps {
  id: string;
  cleanerName: string;
  cleanerPhoto?: string;
  date: string;
  time: string;
  service: string;
  address: string;
  status: string;
  price: number;
  onViewDetails?: () => void;
}
export function BookingCard({
  id,
  cleanerName,
  cleanerPhoto,
  date,
  time,
  service,
  address,
  status,
  price,
  onViewDetails,
}: BookingCardProps) {
  const statusKey = ['scheduled', 'confirmed', 'pending', 'accepted'].includes(status)
    ? 'upcoming'
    : status === 'completed'
    ? 'completed'
    : 'cancelled';
  const statusColors = {
    upcoming: 'primary',
    completed: 'success',
    cancelled: 'error',
  };
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar alt={cleanerName} size="md" fallback={cleanerName.charAt(0)} />
            <div>
              <h3 className="font-semibold text-gray-900">{cleanerName}</h3>
              <p className="text-sm text-gray-600">{service}</p>
            </div>
          </div>
          <Badge variant={statusColors[statusKey] as any}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <div className="flex items-center gap-2">
            <span>????</span>
            <span>{date} at {time}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>????</span>
            <span>{address}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>????</span>
            <span className="font-semibold"></span>
          </div>
        </div>
        <div className="flex gap-2">
          {statusKey === 'upcoming' && (
            <>
              <Button variant="outline" size="sm" className="flex-1">
                Reschedule
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Cancel
              </Button>
            </>
          )}
          {statusKey === 'completed' && (
            <Button variant="primary" size="sm" className="flex-1">
              Leave Review
            </Button>
          )}
          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              View details
            </Button>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link href={`/messages?job=${id}`}>Message</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
