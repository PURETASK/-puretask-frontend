'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock, Repeat, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface RecurringBooking {
  id: string;
  cleanerId: string;
  cleanerName: string;
  serviceType: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek?: string;
  dayOfMonth?: number;
  time: string;
  address: string;
  pricePerVisit: number;
  status: 'active' | 'paused' | 'cancelled';
  nextOccurrence: string;
  startedAt: string;
}

interface RecurringBookingCardProps {
  booking: RecurringBooking;
  onEdit?: (id: string) => void;
  onPause?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export function RecurringBookingCard({
  booking,
  onEdit,
  onPause,
  onCancel,
}: RecurringBookingCardProps) {
  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      weekly: 'Weekly',
      biweekly: 'Bi-weekly',
      monthly: 'Monthly',
    };
    return labels[frequency] || frequency;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
      active: 'success',
      paused: 'warning',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Repeat className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {booking.serviceType}
              </h3>
              {getStatusBadge(booking.status)}
            </div>
            <p className="text-sm text-gray-600">with {booking.cleanerName}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">
              ${booking.pricePerVisit}
              <span className="text-sm text-gray-600 font-normal">/visit</span>
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">
              {getFrequencyLabel(booking.frequency)}
            </span>
            {booking.dayOfWeek && <span>• {booking.dayOfWeek}</span>}
            {booking.dayOfMonth && <span>• Day {booking.dayOfMonth}</span>}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{booking.time}</span>
          </div>
          <div className="text-sm text-gray-600">{booking.address}</div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <p className="text-sm text-blue-900">
            <strong>Next service:</strong>{' '}
            {format(new Date(booking.nextOccurrence), 'MMMM d, yyyy')} at {booking.time}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {booking.status === 'active' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(booking.id)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPause?.(booking.id)}
              >
                Pause
              </Button>
            </>
          )}
          {booking.status === 'paused' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onPause?.(booking.id)}
            >
              Resume
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCancel?.(booking.id)}
            className="text-red-600 hover:text-red-700 ml-auto"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface RecurringBookingFormProps {
  cleanerId: string;
  cleanerName: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function RecurringBookingForm({
  cleanerId,
  cleanerName,
  onSubmit,
  onCancel,
}: RecurringBookingFormProps) {
  const [formData, setFormData] = useState({
    frequency: 'weekly' as 'weekly' | 'biweekly' | 'monthly',
    dayOfWeek: 'Monday',
    dayOfMonth: 1,
    time: '10:00',
    serviceType: 'standard',
    address: '',
    specialInstructions: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      cleanerId,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Up Recurring Booking with {cleanerName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Frequency Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'weekly', label: 'Weekly' },
                { value: 'biweekly', label: 'Bi-weekly' },
                { value: 'monthly', label: 'Monthly' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, frequency: option.value as any })
                  }
                  className={`p-4 border-2 rounded-lg text-center transition-colors ${
                    formData.frequency === option.value
                      ? 'border-blue-600 bg-blue-50 text-blue-600 font-medium'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Day Selection */}
          {(formData.frequency === 'weekly' || formData.frequency === 'biweekly') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Day of Week *
              </label>
              <select
                value={formData.dayOfWeek}
                onChange={(e) =>
                  setFormData({ ...formData, dayOfWeek: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {[
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday',
                ].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.frequency === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Day of Month *
              </label>
              <input
                type="number"
                min="1"
                max="28"
                value={formData.dayOfMonth}
                onChange={(e) =>
                  setFormData({ ...formData, dayOfMonth: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Days 1-28 (avoiding end-of-month issues)
              </p>
            </div>
          )}

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time *
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type *
            </label>
            <select
              value={formData.serviceType}
              onChange={(e) =>
                setFormData({ ...formData, serviceType: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="standard">Standard Cleaning</option>
              <option value="deep">Deep Cleaning</option>
              <option value="move_in_out">Move In/Out Cleaning</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St, Apt 4B"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              value={formData.specialInstructions}
              onChange={(e) =>
                setFormData({ ...formData, specialInstructions: e.target.value })
              }
              rows={3}
              placeholder="Gate code, parking, pets, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
            <p className="text-sm text-gray-700">
              {formData.serviceType} cleaning every{' '}
              {formData.frequency === 'biweekly' ? 'two weeks' : formData.frequency}{' '}
              {formData.frequency !== 'monthly' && `on ${formData.dayOfWeek}s`}
              {formData.frequency === 'monthly' && `on day ${formData.dayOfMonth}`} at{' '}
              {formData.time}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" variant="primary" className="flex-1">
              Create Recurring Booking
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

