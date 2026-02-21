'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'booking_created' | 'booking_completed' | 'payment_received' | 'review_received' | 'message_received' | 'profile_updated';
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
  user?: {
    name: string;
    avatar?: string;
  };
  meta?: {
    amount?: number;
    rating?: number;
    status?: string;
  };
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  maxItems?: number;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
}

const activityIcons = {
  booking_created: '📅',
  booking_completed: '✅',
  payment_received: '💰',
  review_received: '⭐',
  message_received: '💬',
  profile_updated: '👤',
};

const activityColors = {
  booking_created: 'bg-blue-50 text-blue-600',
  booking_completed: 'bg-green-50 text-green-600',
  payment_received: 'bg-purple-50 text-purple-600',
  review_received: 'bg-yellow-50 text-yellow-600',
  message_received: 'bg-pink-50 text-pink-600',
  profile_updated: 'bg-gray-50 text-gray-600',
};

export function ActivityFeed({
  activities,
  title = 'Recent Activity',
  maxItems,
  showLoadMore = false,
  onLoadMore,
}: ActivityFeedProps) {
  const displayedActivities = maxItems ? activities.slice(0, maxItems) : activities;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedActivities.map((activity, index) => (
              <div key={activity.id} className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activityColors[activity.type] || 'bg-gray-50 text-gray-600'
                  }`}
                >
                  <span className="text-lg">
                    {activity.icon || activityIcons[activity.type] || '📌'}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>

                      {/* User info if present */}
                      {activity.user && (
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar
                            src={activity.user.avatar}
                            fallback={activity.user.name[0]}
                            size="sm"
                          />
                          <span className="text-xs text-gray-500">{activity.user.name}</span>
                        </div>
                      )}

                      {/* Meta information */}
                      {activity.meta && (
                        <div className="flex items-center gap-2 mt-2">
                          {activity.meta.amount && (
                            <Badge variant="success">
                              ${activity.meta.amount.toFixed(2)}
                            </Badge>
                          )}
                          {activity.meta.rating && (
                            <Badge variant="warning">
                              ⭐ {activity.meta.rating.toFixed(1)}
                            </Badge>
                          )}
                          {activity.meta.status && (
                            <Badge
                              variant={
                                activity.meta.status === 'completed'
                                  ? 'success'
                                  : activity.meta.status === 'pending'
                                  ? 'warning'
                                  : 'default'
                              }
                            >
                              {activity.meta.status}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDistanceToNow(new Date(activity.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {showLoadMore && activities.length > displayedActivities.length && (
              <button
                onClick={onLoadMore}
                className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Load more activity
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

