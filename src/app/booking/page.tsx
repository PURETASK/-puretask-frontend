'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useCleaner } from '@/hooks/useCleaners';
import { useCreateBooking, usePriceEstimate } from '@/hooks/useBookings';
import { useDraftBooking, useSaveDraftBooking } from '@/hooks/useClientEnhanced';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SkeletonList } from '@/components/ui/Skeleton';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';
import { DateTimePicker } from '@/components/features/booking/DateTimePicker';
import { ServiceSelection } from '@/components/features/booking/ServiceSelection';
import { formatCurrency } from '@/lib/utils';
import { holidayService, Holiday } from '@/services/holiday.service';
import { useToast } from '@/contexts/ToastContext';
import { Save } from 'lucide-react';

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cleanerId = searchParams.get('cleaner');

  const { data: cleanerData, isLoading: loadingCleaner } = useCleaner(cleanerId || '');
  const { mutate: createBooking, isPending: isCreating } = useCreateBooking();
  const { mutate: estimatePrice, data: priceEstimate, isPending: estimating } = usePriceEstimate();
  const { data: draftData } = useDraftBooking();
  const { mutate: saveDraft, isPending: isSavingDraft } = useSaveDraftBooking();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    service_type: 'standard' as 'standard' | 'deep' | 'move_in_out',
    duration_hours: 3,
    scheduled_date: '',
    scheduled_time: '',
    address: '',
    address_line_2: '',
    city: '',
    state: '',
    zip_code: '',
    special_instructions: '',
    add_ons: [] as string[],
  });
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [holidayLoading, setHolidayLoading] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState<any>(null);

  // Load draft on mount
  useEffect(() => {
    if (draftData?.draft) {
      setBookingData({ ...bookingData, ...draftData.draft });
      showToast('Draft booking loaded', 'info');
    }
  }, [draftData]);

  // Auto-save draft when booking data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (bookingData.address || bookingData.scheduled_date) {
        saveDraft(bookingData);
      }
    }, 2000); // Debounce 2 seconds

    return () => clearTimeout(timer);
  }, [bookingData]);

  // Auto-estimate price when service details change (real-time)
  useEffect(() => {
    if (cleanerId && bookingData.service_type && bookingData.duration_hours) {
      estimatePrice({
        cleaner_id: cleanerId,
        service_type: bookingData.service_type,
        duration_hours: bookingData.duration_hours,
        add_ons: bookingData.add_ons,
      });
    }
  }, [cleanerId, bookingData.service_type, bookingData.duration_hours, bookingData.add_ons]);

  // Calculate detailed price breakdown
  useEffect(() => {
    if (priceEstimate && cleaner) {
      const baseRate = cleaner.price_per_hour || 0;
      const baseCost = baseRate * bookingData.duration_hours;
      const addOnCost = bookingData.add_ons.length * 10; // $10 per add-on
      const holidayMultiplier = selectedHoliday ? 1.15 : 1.0;
      const subtotal = (baseCost + addOnCost) * holidayMultiplier;
      const platformFee = subtotal * 0.1; // 10% platform fee
      const total = subtotal + platformFee;

      setPriceBreakdown({
        baseRate,
        baseCost,
        addOnCost,
        holidayMultiplier,
        holidayRate: selectedHoliday ? subtotal - (baseCost + addOnCost) : 0,
        subtotal,
        platformFee,
        total,
      });
    }
  }, [priceEstimate, cleaner, bookingData, selectedHoliday]);

  useEffect(() => {
    const fetchHoliday = async () => {
      if (!bookingData.scheduled_date) {
        setSelectedHoliday(null);
        return;
      }

      setHolidayLoading(true);
      try {
        const response = await holidayService.getHolidayByDate(bookingData.scheduled_date);
        setSelectedHoliday(response.holiday ?? null);
      } catch {
        setSelectedHoliday(null);
      } finally {
        setHolidayLoading(false);
      }
    };

    fetchHoliday();
  }, [bookingData.scheduled_date]);

  const handleSubmit = () => {
    if (!cleanerId) return;

    const scheduledDateTime = `${bookingData.scheduled_date}T${bookingData.scheduled_time}:00Z`;
    const endDateTime = new Date(scheduledDateTime);
    endDateTime.setHours(endDateTime.getHours() + bookingData.duration_hours);

    createBooking({
      cleaner_id: cleanerId,
      service_type: bookingData.service_type,
      scheduled_start_at: scheduledDateTime,
      scheduled_end_at: endDateTime.toISOString(),
      address: bookingData.address,
      address_line_2: bookingData.address_line_2,
      city: bookingData.city,
      state: bookingData.state,
      zip_code: bookingData.zip_code,
      special_instructions: bookingData.special_instructions,
      add_ons: bookingData.add_ons,
    });
  };

  if (loadingCleaner) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <SkeletonList items={6} />
          </div>
        </main>
      </div>
    );
  }

  if (!cleanerId || !cleanerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Invalid Booking</h2>
            <p className="text-gray-600 mb-4">Please select a cleaner first</p>
            <Button onClick={() => router.push('/search')}>Find Cleaners</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cleaner = cleanerData.cleaner;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step >= s
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 4 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step > s ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Service</span>
              <span>Date & Time</span>
              <span>Address</span>
              <span>Confirm</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {step === 1 && 'Choose Your Service'}
                    {step === 2 && 'Select Date & Time'}
                    {step === 3 && 'Enter Your Address'}
                    {step === 4 && 'Review & Confirm'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Step 1: Service Selection */}
                  {step === 1 && (
                    <ServiceSelection
                      value={bookingData}
                      onChange={(data) => setBookingData({ ...bookingData, ...data })}
                    />
                  )}

                  {/* Step 2: Date & Time */}
                  {step === 2 && (
                    <DateTimePicker
                      cleanerId={cleanerId}
                      onSelect={(date, time) =>
                        setBookingData({
                          ...bookingData,
                          scheduled_date: date,
                          scheduled_time: time,
                        })
                      }
                    />
                  )}
                  {step === 2 && !holidayLoading && selectedHoliday && (
                    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                      <div className="font-semibold">Federal Holiday</div>
                      <div>
                        Cleaner availability may be limited today. Some cleaners may charge higher holiday
                        rates. All pricing is shown upfront.
                      </div>
                      {selectedHoliday.support_limited && (
                        <div className="mt-2">
                          Holiday support hours may be limited. Disputes are reviewed the next business day.
                        </div>
                      )}
                      <div className="mt-2">
                        PureTask does not guarantee cleaner availability on federal holidays.
                      </div>
                    </div>
                  )}

                  {/* Step 3: Address */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <Input
                        label="Street Address"
                        type="text"
                        inputMode="text"
                        autoComplete="street-address"
                        value={bookingData.address}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, address: e.target.value })
                        }
                        placeholder="123 Main St"
                        required
                      />
                      <Input
                        label="Apt, Suite, etc. (Optional)"
                        type="text"
                        inputMode="text"
                        autoComplete="address-line2"
                        value={bookingData.address_line_2}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, address_line_2: e.target.value })
                        }
                        placeholder="Apt 4B"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="City"
                          type="text"
                          inputMode="text"
                          autoComplete="address-level2"
                          value={bookingData.city}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, city: e.target.value })
                          }
                          required
                        />
                        <Input
                          label="State"
                          type="text"
                          inputMode="text"
                          autoComplete="address-level1"
                          value={bookingData.state}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, state: e.target.value })
                          }
                          placeholder="NY"
                          required
                        />
                      </div>
                      <Input
                        label="ZIP Code"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="postal-code"
                        value={bookingData.zip_code}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, zip_code: e.target.value })
                        }
                        placeholder="10001"
                        required
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Special Instructions (Optional)
                        </label>
                        <textarea
                          value={bookingData.special_instructions}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              special_instructions: e.target.value,
                            })
                          }
                          placeholder="Gate code, parking instructions, pet info, etc."
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[44px] text-base"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 4: Review */}
                  {step === 4 && (
                    <div className="space-y-6">
                      {!holidayLoading && selectedHoliday && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                          <div className="font-semibold">Holiday booking notice</div>
                          <div>
                            You’re booking on a federal holiday. Availability may be limited and rates may
                            be higher. All pricing is shown upfront.
                          </div>
                          {selectedHoliday.support_limited && (
                            <div className="mt-2">
                              Holiday support hours may be limited. Disputes are reviewed the next business
                              day.
                            </div>
                          )}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Service:</span>
                            <span className="font-medium capitalize">
                              {bookingData.service_type.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">
                              {bookingData.duration_hours} hours
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date & Time:</span>
                            <span className="font-medium">
                              {bookingData.scheduled_date} at {bookingData.scheduled_time}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Address:</span>
                            <span className="font-medium text-right">
                              {bookingData.address}
                              {bookingData.address_line_2 && `, ${bookingData.address_line_2}`}
                              <br />
                              {bookingData.city}, {bookingData.state} {bookingData.zip_code}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    <div className="flex gap-2">
                      {step > 1 && (
                        <Button variant="outline" onClick={() => setStep(step - 1)}>
                          Back
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        onClick={() => {
                          saveDraft(bookingData);
                          showToast('Draft saved', 'success');
                        }}
                        isLoading={isSavingDraft}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save Draft
                      </Button>
                    </div>
                    {step < 4 ? (
                      <Button
                        variant="primary"
                        onClick={() => setStep(step + 1)}
                        className="ml-auto"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={handleSubmit}
                        isLoading={isCreating}
                        className="ml-auto"
                      >
                        {isCreating ? 'Creating Booking...' : 'Confirm & Book'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cleaner Info */}
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                      {cleaner.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{cleaner.name}</p>
                      <p className="text-sm text-gray-600">
                        ⭐ {cleaner.rating} ({cleaner.reviews_count} reviews)
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Real-Time Price Breakdown */}
                  <div className="space-y-2">
                    {priceBreakdown ? (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Base Rate</span>
                          <span className="font-medium">
                            {formatCurrency(priceBreakdown.baseRate)}/hr
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-medium">{bookingData.duration_hours} hours</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Base Cost</span>
                          <span className="font-medium">
                            {formatCurrency(priceBreakdown.baseCost)}
                          </span>
                        </div>
                        {bookingData.add_ons.length > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Add-ons ({bookingData.add_ons.length})</span>
                            <span className="font-medium">
                              {formatCurrency(priceBreakdown.addOnCost)}
                            </span>
                          </div>
                        )}
                        {selectedHoliday && priceBreakdown.holidayRate > 0 && (
                          <div className="flex justify-between text-sm text-amber-600">
                            <span>Holiday Rate ({((priceBreakdown.holidayMultiplier - 1) * 100).toFixed(0)}%)</span>
                            <span className="font-medium">
                              +{formatCurrency(priceBreakdown.holidayRate)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm pt-2 border-t">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">
                            {formatCurrency(priceBreakdown.subtotal)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Platform Fee (10%)</span>
                          <span>{formatCurrency(priceBreakdown.platformFee)}</span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-900">Total</span>
                            <span className="text-xl font-bold text-blue-600">
                              {formatCurrency(priceBreakdown.total)}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Base Rate</span>
                          <span className="font-medium">
                            {formatCurrency(cleaner.price_per_hour)}/hr
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-medium">{bookingData.duration_hours} hours</span>
                        </div>
                        {priceEstimate && (
                          <div className="pt-2 border-t">
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-900">Total</span>
                              <span className="text-xl font-bold text-blue-600">
                                {formatCurrency(priceEstimate.price)}
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    {estimating && (
                      <div className="text-xs text-gray-500 text-center">Calculating...</div>
                    )}
                  </div>

                  {/* Trust Badges */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>✓</span>
                      <span>Satisfaction Guaranteed</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>✓</span>
                      <span>Easy Cancellation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>✓</span>
                      <span>Secure Payment</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
