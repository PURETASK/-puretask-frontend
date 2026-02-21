import { apiClient } from '@/lib/api';
import type { Job } from '@/types/api';

export interface CreateBookingData {
  cleaner_id: string;
  service_type: 'standard' | 'deep' | 'move_in_out';
  scheduled_start_at: string;
  scheduled_end_at: string;
  address: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip_code: string;
  special_instructions?: string;
  add_ons?: string[];
  payment_method_id?: string;
}

export interface BookingResponse {
  booking: Job;
  payment_intent?: {
    client_secret: string;
    amount: number;
  };
}

export const bookingService = {
  // Create a new booking
  createBooking: async (data: CreateBookingData): Promise<BookingResponse> => {
    return apiClient.post<BookingResponse>('/bookings', data);
  },

  // Get booking by ID
  getBooking: async (bookingId: string) => {
    return apiClient.get<{ booking: Job }>(`/bookings/${bookingId}`);
  },

  // Get user bookings
  getMyBookings: async (params?: {
    status?: 'upcoming' | 'completed' | 'cancelled' | 'all';
    page?: number;
    per_page?: number;
  }) => {
    return apiClient.get<{ bookings: Job[] }>('/bookings/me', { params });
  },

  // Cancel booking
  cancelBooking: async (bookingId: string, reason?: string) => {
    return apiClient.post(`/bookings/${bookingId}/cancel`, { reason });
  },

  // Complete booking
  completeBooking: async (bookingId: string) => {
    return apiClient.post(`/bookings/${bookingId}/complete`);
  },

  // Add review
  addReview: async (bookingId: string, rating: number, comment?: string) => {
    return apiClient.post(`/bookings/${bookingId}/review`, { rating, comment });
  },

  // Get price estimate
  getPriceEstimate: async (data: {
    cleaner_id: string;
    service_type: string;
    duration_hours: number;
    add_ons?: string[];
  }) => {
    return apiClient.post<{ price: number; breakdown: any }>('/bookings/estimate', data);
  },
};

