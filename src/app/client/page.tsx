'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import {
  CalendarPlus,
  CalendarCheck,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  ChevronRight,
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useBookings } from '@/hooks/useBookings';
import { format } from 'date-fns';

export default function ClientHubPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <ClientHubContent />
    </ProtectedRoute>
  );
}

function ClientHubContent() {
  usePageTitle('My PureTask');
  const { data: bookingsData } = useBookings();
  const bookings = bookingsData?.bookings || [];
  const nextBooking = bookings.find(
    (b: any) => b.status === 'scheduled' || b.status === 'confirmed'
  );

  const cards = [
    {
      href: '/client/book',
      title: 'Book a clean',
      description: 'One-time, recurring, or book your favorite cleaner again.',
      icon: CalendarPlus,
      accent: 'blue',
    },
    {
      href: '/client/bookings',
      title: 'My bookings',
      description: 'View upcoming and past cleans, approve payments, get receipts.',
      icon: CalendarCheck,
      accent: 'green',
    },
    {
      href: '/client/credits-trust',
      title: 'Credits & payment',
      description: 'Add credits, see balance, view invoices. Payment is held until you approve.',
      icon: CreditCard,
      accent: 'purple',
    },
    {
      href: '/client/support',
      title: 'Help & support',
      description: 'FAQs, contact us, and how payments and disputes work.',
      icon: HelpCircle,
      accent: 'gray',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-app">
      <Header />
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-gray-600 mt-1">
              Book a clean, manage your bookings, or top up credits.
            </p>
          </div>

          {nextBooking && (
            <Link
              href={`/client/bookings/${nextBooking.id}`}
              className="mb-8 block rounded-2xl border border-[var(--brand-blue)]/20 p-5 transition-all duration-200 card-interactive"
              style={{
                background: 'linear-gradient(135deg, rgba(0,120,255,0.08) 0%, rgba(0,212,255,0.04) 100%)',
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-blue)]">
                    Next clean
                  </p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {nextBooking.service_type?.replace('_', ' ') || 'Cleaning'} ·{' '}
                    {format(new Date(nextBooking.scheduled_start_at), 'EEE, MMM d')}
                  </p>
                  <p className="text-sm text-gray-600 truncate max-w-md">{nextBooking.address}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
              </div>
            </Link>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 card-interactive"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={
                      card.accent === 'blue'
                        ? { background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-aqua))' }
                        : card.accent === 'green'
                          ? { backgroundColor: 'var(--brand-mint)', color: 'white' }
                          : card.accent === 'purple'
                            ? { backgroundColor: '#8B5CF6', color: 'white' }
                            : { backgroundColor: '#6B7280', color: 'white' }
                    }
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-[var(--brand-blue)] transition-colors">
                    {card.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 flex-1">{card.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-blue)] mt-3">
                    Open
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-8">
            <Link
              href="/client/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Full dashboard (stats, insights, recommendations)
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
