// src/app/client/appointments/[bookingId]/live-trust/page.tsx
// Simple live appointment page using Trust-Fintech hooks (fetch + /api/appointments/*)

'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import {
  useLiveAppointment,
  usePostAppointmentEvent,
} from '@/hooks/useLiveAppointmentTrust';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function LiveTrustContent() {
  const params = useParams();
  const bookingId = params.bookingId as string;

  const liveQ = useLiveAppointment(bookingId);
  const postEvent = usePostAppointmentEvent(bookingId);

  const send = (type: 'en_route' | 'arrived' | 'check_in' | 'check_out') => {
    postEvent.mutate({ type, source: 'device' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Service (Trust API)</h1>
        <p className="text-gray-600 mb-6">
          Using fetch + /api/appointments/* • Booking: {bookingId}
        </p>

        {liveQ.isLoading ? (
          <p>Loading…</p>
        ) : liveQ.isError ? (
          <p className="text-red-600">Failed to load live appointment.</p>
        ) : liveQ.data ? (
          <>
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">State</h2>
              <p>{liveQ.data.state}</p>
              {liveQ.data.etaISO ? (
                <p className="mt-2">
                  ETA: {new Date(liveQ.data.etaISO).toLocaleString()}
                </p>
              ) : null}
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Actions (demo)</h2>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => send('en_route')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  En route
                </button>
                <button
                  onClick={() => send('arrived')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Arrived
                </button>
                <button
                  onClick={() => send('check_in')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Check in
                </button>
                <button
                  onClick={() => send('check_out')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Check out
                </button>
              </div>
              {postEvent.isPending ? <p className="mt-2">Posting…</p> : null}
              {postEvent.isError ? (
                <p className="mt-2 text-red-600">Failed to post event.</p>
              ) : null}
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">GPS Evidence</h2>
              <ul className="list-disc list-inside space-y-1">
                {liveQ.data.gps.map((g) => (
                  <li key={g.id}>
                    {g.event} • {new Date(g.atISO).toLocaleString()} • ±
                    {g.accuracyM ?? '?'}m • {g.source}
                  </li>
                ))}
                {liveQ.data.gps.length === 0 && (
                  <li className="text-gray-500">No GPS events yet</li>
                )}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Timeline</h2>
              <ul className="list-disc list-inside space-y-1">
                {liveQ.data.events.map((ev) => (
                  <li key={ev.id}>
                    {new Date(ev.atISO).toLocaleString()} — {ev.type}: {ev.summary}
                  </li>
                ))}
                {liveQ.data.events.length === 0 && (
                  <li className="text-gray-500">No events yet</li>
                )}
              </ul>
            </section>
          </>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}

export default function LiveTrustPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <LiveTrustContent />
    </ProtectedRoute>
  );
}
