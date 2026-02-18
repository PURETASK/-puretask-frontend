import { apiClient } from '@/lib/api';
import type { LiveAppointment } from '@/types/appointment';

export const appointmentService = {
  getLiveAppointment: async (bookingId: string): Promise<LiveAppointment | null> => {
    try {
      const res = await apiClient.get<{ appointment?: LiveAppointment }>(
        `/client/jobs/${bookingId}/live`
      );
      if (res.appointment) return res.appointment;
    } catch {
      // Fall through to mock
    }
    // Mock when backend not ready
    return {
      bookingId,
      state: 'scheduled',
      gps: [],
      photos: [],
      checklist: [
        { id: '1', label: 'Kitchen cleaned', completed: false },
        { id: '2', label: 'Bathrooms cleaned', completed: false },
        { id: '3', label: 'Living areas vacuumed', completed: false },
      ],
      events: [],
    };
  },
};
