'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppointmentStatusStepper } from '@/components/appointments/AppointmentStatusStepper';
import { GpsEvidencePanel } from '@/components/appointments/GpsEvidencePanel';
import { PhotoUploadPanel } from '@/components/appointments/PhotoUploadPanel';
import { ChecklistProgress } from '@/components/appointments/ChecklistProgress';
import { NextActionCard } from '@/components/appointments/NextActionCard';
import { SupportActionCard } from '@/components/appointments/SupportActionCard';
import { Button } from '@/components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '@/services/appointment.service';
import { mergeChecklistWithLabels } from '@/constants/trustChecklist';
import type { LiveAppointment } from '@/types/appointment';

function getNextAction(state: LiveAppointment['state']) {
  switch (state) {
    case 'scheduled':
      return {
        title: 'Waiting for cleaner',
        description: 'Your cleaner will update status when they’re on the way.',
      };
    case 'en_route':
      return {
        title: 'Cleaner is on the way',
        description: 'Track arrival. Have your space ready.',
      };
    case 'arrived':
      return {
        title: 'Cleaner has arrived',
        description: 'They’ll check in and begin the service.',
      };
    case 'checked_in':
      return {
        title: 'Service in progress',
        description: 'The cleaning is underway.',
      };
    case 'completed':
      return {
        title: 'Service completed',
        description: 'Leave a review when ready.',
      };
    default:
      return { title: '—', description: '' };
  }
}

function LiveAppointmentContent() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment', 'live', bookingId],
    queryFn: () => appointmentService.getLiveAppointment(bookingId),
    enabled: !!bookingId,
  });

  const liveData = appointment;

  if (isLoading || !liveData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-8 px-6">
          <div className="max-w-2xl mx-auto text-center text-gray-500">
            {isLoading ? 'Loading...' : 'Appointment not found'}
          </div>
        </main>
      </div>
    );
  }

  const nextAction = getNextAction(liveData.state);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live service</h1>
            <p className="text-gray-600">Booking #{bookingId.slice(0, 8)}</p>
          </div>

          <AppointmentStatusStepper
            currentState={liveData.state}
            etaISO={liveData.etaISO}
          />

          <NextActionCard title={nextAction.title} description={nextAction.description} />

          <GpsEvidencePanel events={liveData.gps} />
          <PhotoUploadPanel photos={liveData.photos} />
          <ChecklistProgress items={mergeChecklistWithLabels(liveData.checklist)} />

          <SupportActionCard />

          <Button variant="outline" onClick={() => router.push('/client/dashboard')}>
            Back to dashboard
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function LiveAppointmentPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <LiveAppointmentContent />
    </ProtectedRoute>
  );
}
