'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotifications, useMarkAllAsRead, useMarkAsRead } from '@/hooks/useNotifications';
import { EmptyNotifications } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/contexts/ToastContext';
import { Calendar, MessageCircle, CreditCard, Bell, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { usePageTitle } from '@/hooks/usePageTitle';

function getIcon(type: string) {
  switch (type) {
    case 'booking':
      return <Calendar className="h-6 w-6 text-blue-600 shrink-0" />;
    case 'message':
      return <MessageCircle className="h-6 w-6 text-green-600 shrink-0" />;
    case 'payment':
      return <CreditCard className="h-6 w-6 text-amber-600 shrink-0" />;
    default:
      return <Bell className="h-6 w-6 text-gray-600 shrink-0" />;
  }
}

export default function NotificationsPage() {
  usePageTitle('Notifications');
  const { showToast } = useToast();
  const { data, isLoading, error, refetch } = useNotifications();
  const markAllAsRead = useMarkAllAsRead();
  const markAsRead = useMarkAsRead();

  const notifications = (data?.notifications ?? []) as Array<{
    id: string;
    type?: string;
    title?: string;
    message?: string;
    read?: boolean;
    created_at?: string;
    action_url?: string;
  }>;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    markAllAsRead.mutate(undefined, {
      onSuccess: () => showToast('All notifications marked as read', 'success'),
      onError: () => showToast('Failed to mark all as read', 'error'),
    });
  };

  const handleMarkRead = (id: string) => {
    markAsRead.mutate(id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMarkAllRead()}
                disabled={markAllAsRead.isPending}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <p className="text-red-700 mb-4">Failed to load notifications.</p>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : notifications.length === 0 ? (
            <EmptyNotifications />
          ) : (
            <div className="space-y-2">
              {notifications.map((notif) => (
                <Card
                  key={notif.id}
                  className={notif.read ? 'opacity-75' : ''}
                  onClick={() => !notif.read && handleMarkRead(notif.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5">{getIcon(notif.type ?? '')}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{notif.title ?? 'Notification'}</h3>
                          {!notif.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-1.5" aria-hidden />
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">{notif.message ?? ''}</p>
                        <p className="text-sm text-gray-500">
                          {notif.created_at ? formatDistanceToNow(new Date(notif.created_at), { addSuffix: true }) : ''}
                        </p>
                        {notif.action_url && (
                          <a href={notif.action_url} className="text-sm font-medium text-blue-600 hover:underline mt-2 inline-block">
                            View
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
