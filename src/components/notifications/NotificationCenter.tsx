'use client';

import React, { useState } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notificationsData, isLoading } = useNotifications();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();
  const notifications = notificationsData?.notifications || [];
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <Badge
            variant="danger"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 mt-2 w-80 max-h-96 overflow-hidden z-20 shadow-lg">
            <CardContent className="p-0">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close notifications"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="overflow-y-auto max-h-80">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {notifications.map((notification: any) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'p-4 hover:bg-gray-50 transition-colors cursor-pointer',
                          !notification.read && 'bg-blue-50'
                        )}
                        onClick={() => {
                          if (!notification.read) {
                            markAsRead(notification.id);
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDistanceToNow(new Date(notification.created_at), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      markAllAsRead();
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark all as read
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
