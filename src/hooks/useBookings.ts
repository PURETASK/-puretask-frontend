import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService, CreateBookingData } from '@/services/booking.service';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';

export function useBookings(status?: string) {
  return useQuery({
    queryKey: ['bookings', status],
    queryFn: () => bookingService.getMyBookings({ status: status as 'upcoming' | 'completed' | 'cancelled' | 'all' | undefined }),
  });
}

export function useBooking(bookingId: string) {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingService.getBooking(bookingId),
    enabled: !!bookingId,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateBookingData) => bookingService.createBooking(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      showToast('Booking created successfully!', 'success');
      router.push(`/booking/confirm/${response.booking.id}`);
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to create booking', 'error');
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason?: string }) =>
      bookingService.cancelBooking(bookingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      showToast('Booking cancelled successfully', 'success');
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to cancel booking', 'error');
    },
  });
}

export function usePriceEstimate() {
  return useMutation({
    mutationFn: bookingService.getPriceEstimate,
  });
}

