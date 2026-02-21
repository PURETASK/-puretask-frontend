'use client';

import React from 'react';
import Link from 'next/link';
import { Sheet, SheetContent } from '@/components/ui/Sheet';
import { ReliabilityScoreCard } from '@/components/reliability/ReliabilityScoreCard';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { reliabilityService } from '@/services/reliability.service';

interface BookingDetailsDrawerProps {
  booking: {
    id: string;
    address?: string;
    service_type?: string;
    scheduled_start_at?: string;
    scheduled_end_at?: string;
    status?: string;
    total_price?: number;
    cleaner_id?: string;
    cleaner?: { full_name?: string };
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingDetailsDrawer({
  booking,
  open,
  onOpenChange,
}: BookingDetailsDrawerProps) {
  const cleanerId = booking?.cleaner_id;
  const { data: reliabilityData } = useQuery({
    queryKey: ['reliability', cleanerId],
    queryFn: () => reliabilityService.getCleanerReliability(cleanerId!),
    enabled: !!cleanerId && open,
  });

  const isToday =
    booking?.scheduled_start_at &&
    new Date(booking.scheduled_start_at).toDateString() === new Date().toDateString();

  if (!booking) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        title="Booking details"
        description={`${booking.service_type || 'Cleaning'} · ${booking.status || '—'}`}
        side="right"
      >
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Cleaner</h4>
            <p className="text-gray-600">{booking.cleaner?.full_name || 'TBD'}</p>
          </div>

          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Date:</span> {booking.scheduled_start_at ? format(new Date(booking.scheduled_start_at), 'PPpp') : '—'}</p>
            <p><span className="text-gray-500">Address:</span> {booking.address || '—'}</p>
            <p><span className="text-gray-500">Amount:</span> {booking.total_price != null ? formatCurrency(booking.total_price) : '—'}</p>
          </div>

          {reliabilityData?.reliability && (
            <ReliabilityScoreCard score={reliabilityData.reliability} compact showBreakdown={false} />
          )}

          <div className="flex flex-col gap-2 pt-4 border-t">
            {isToday && (
              <Link
                href={`/client/appointments/${booking.id}/live`}
                className="inline-flex h-12 min-h-[44px] items-center justify-center rounded-lg bg-blue-600 px-4 text-base font-medium text-white transition-colors hover:bg-blue-700"
              >
                View live service
              </Link>
            )}
            <Link
              href={`/client/bookings/${booking.id}`}
              className="inline-flex h-12 min-h-[44px] items-center justify-center rounded-lg border-2 border-blue-600 px-4 text-base font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              View full details
            </Link>
            <Link
              href={`/messages?job=${booking.id}`}
              className="inline-flex h-12 min-h-[44px] items-center justify-center rounded-lg border-2 border-blue-600 px-4 text-base font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              Message cleaner
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
