'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { getJobStatusLabel, getJobStatusBadgeClass } from '@/constants';
import { Calendar, MapPin, DollarSign } from 'lucide-react';
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
  return (
    <Card className="card-interactive rounded-2xl border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar alt={cleanerName} size="md" fallback={cleanerName.charAt(0)} />
            <div>
              <h3 className="font-semibold text-gray-900">{cleanerName}</h3>
              <p className="text-sm text-gray-600">{service}</p>
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getJobStatusBadgeClass(status)}`}>
            {getJobStatusLabel(status)}
          </span>
        </div>
        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden />
            <span>{date} at {time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden />
            <span>{address}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden />
            <span className="font-semibold">{price ? `$${price}` : '—'}</span>
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
          <Link href={`/messages?job=${id}`} className="inline-flex h-11 min-h-[44px] items-center justify-center rounded-lg border-2 border-blue-600 px-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50">
            Message
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
