'use client';
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
export default function NotificationsPage() {
  const notifications = [
    {
      id: '1',
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your booking with Jane Doe for Jan 15 has been confirmed.',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message',
      message: 'Jane Doe sent you a message about your upcoming booking.',
      time: '5 hours ago',
      read: false,
    },
    {
      id: '3',
      type: 'review',
      title: 'Review Reminder',
      message: 'How was your experience with John Smith? Leave a review!',
      time: '1 day ago',
      read: true,
    },
  ];
  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return '????';
      case 'message': return '????';
      case 'review': return '???';
      default: return '????';
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Mark all as read
            </button>
          </div>
          <div className="space-y-2">
            {notifications.map((notif) => (
              <Card key={notif.id} className={notif.read ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{getIcon(notif.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{notif.message}</p>
                      <p className="text-sm text-gray-500">{notif.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
