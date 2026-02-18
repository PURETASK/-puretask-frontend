// src/hooks/useLiveAppointmentTrust.ts
// TanStack Query hooks for live appointments (Trust-Fintech REST)

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/apiClient';
import type { LiveAppointment } from '@/types/trust';

export type AppointmentEventCreate = {
  type: 'en_route' | 'arrived' | 'check_in' | 'check_out' | 'note';
  note?: string;
  gps?: { lat: number; lng: number; accuracyM?: number };
  source?: 'device' | 'manual_override';
};

export function useLiveAppointment(bookingId: string) {
  return useQuery({
    queryKey: ['appointments', 'live', bookingId],
    queryFn: () =>
      apiGet<LiveAppointment>(
        `/api/appointments/${encodeURIComponent(bookingId)}/live`
      ),
    enabled: Boolean(bookingId),
    refetchInterval: 3_000,
  });
}

export function usePostAppointmentEvent(bookingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: AppointmentEventCreate) =>
      apiPost<AppointmentEventCreate, { ok: true }>(
        `/api/appointments/${encodeURIComponent(bookingId)}/events`,
        payload
      ),
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: ['appointments', 'live', bookingId],
      });
    },
  });
}
