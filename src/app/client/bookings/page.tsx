'use client';
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BookingCard } from '@/components/features/dashboard/BookingCard';
export default function MyBookingsPage() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const allBookings = [
    {
      id: '1',
      cleanerName: 'Jane Doe',
      date: 'Jan 15, 2026',
      time: '10:00 AM',
      service: 'Standard Cleaning',
      address: '123 Main St, Apt 4B',
      status: 'upcoming' as const,
      price: 135,
    },
    {
      id: '2',
      cleanerName: 'John Smith',
      date: 'Jan 5, 2026',
      time: '2:00 PM',
      service: 'Deep Cleaning',
      address: '123 Main St, Apt 4B',
      status: 'completed' as const,
      price: 195,
    },
    {
      id: '3',
      cleanerName: 'Maria Garcia',
      date: 'Dec 28, 2025',
      time: '9:00 AM',
      service: 'Standard Cleaning',
      address: '123 Main St, Apt 4B',
      status: 'completed' as const,
      price: 135,
    },
  ];
  const filteredBookings = filter === 'all' 
    ? allBookings 
    : allBookings.filter(b => b.status === filter);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
          <div className="flex gap-2 mb-6">
            {['all', 'upcoming', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} {...booking} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
