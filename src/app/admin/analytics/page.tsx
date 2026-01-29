'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { adminEnhancedService } from '@/services/adminEnhanced.service';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Sparkles, TrendingUp } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [timeframe, setTimeframe] = useState('month');
  const [activeTab, setActiveTab] = useState('platform');

  // Get advanced analytics insights
  const { data: insightsData } = useQuery({
    queryKey: ['admin', 'analytics', 'insights', timeframe],
    queryFn: () => adminEnhancedService.getAnalyticsInsights(),
  });

  const platformMetrics = {
    totalUsers: 1247,
    activeUsers: 892,
    totalBookings: 3521,
    completedBookings: 3340,
    revenue: 87500,
    growth: 15,
  };

  const userMetrics = {
    newClients: 124,
    newCleaners: 43,
    retentionRate: 87,
    churnRate: 13,
  };

  const financialMetrics = {
    gmv: 87500,
    commission: 13125,
    avgBookingValue: 135,
    topServiceRevenue: 52500,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Advanced Analytics</h1>
              <p className="text-gray-600">Deep dive into platform metrics and insights</p>
            </div>
            <div className="flex gap-3">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
              <Button variant="outline" onClick={() => (window.location.href = '/admin/dashboard')}>
                ← Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {['platform', 'users', 'financial', 'performance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-6 py-3 font-medium transition-colors border-b-2 capitalize',
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Analytics Insights */}
          {insightsData?.insights && (
            <Card className="mb-6 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-2">Key Insights</h3>
                    <div className="space-y-2 text-sm text-blue-700">
                      {insightsData.insights.growth_trend && (
                        <p>• {insightsData.insights.growth_trend}</p>
                      )}
                      {insightsData.insights.top_performing_service && (
                        <p>• Top performing service: <strong>{insightsData.insights.top_performing_service}</strong></p>
                      )}
                      {insightsData.insights.recommendations && insightsData.insights.recommendations.length > 0 && (
                        <div>
                          <p className="font-medium mb-1">Recommendations:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {insightsData.insights.recommendations.map((rec: string, idx: number) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* PLATFORM TAB */}
          {activeTab === 'platform' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-sm text-gray-600 mb-1">Total Users</div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{platformMetrics.totalUsers.toLocaleString()}</div>
                    <div className="text-sm text-green-600">+{platformMetrics.growth}% vs last {timeframe}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-sm text-gray-600 mb-1">Total Bookings</div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{platformMetrics.totalBookings.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">
                      {platformMetrics.completedBookings} completed ({Math.round((platformMetrics.completedBookings / platformMetrics.totalBookings) * 100)}%)
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
                    <div className="text-3xl font-bold text-green-600 mb-2">${platformMetrics.revenue.toLocaleString()}</div>
                    <div className="text-sm text-green-600">+{platformMetrics.growth}% growth</div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-600">
                        <p className="text-lg font-medium mb-2">📈 Revenue Growth Chart</p>
                        <p className="text-sm">Chart visualization placeholder</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-600">
                        <p className="text-lg font-medium mb-2">👥 User Acquisition Chart</p>
                        <p className="text-sm">Chart visualization placeholder</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Activity Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Active Users', value: platformMetrics.activeUsers, color: 'text-blue-600' },
                      { label: 'Bookings Today', value: 47, color: 'text-green-600' },
                      { label: 'Messages Sent', value: 312, color: 'text-purple-600' },
                      { label: 'Reviews Posted', value: 89, color: 'text-yellow-600' },
                    ].map((stat, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{userMetrics.newClients}</div>
                    <div className="text-sm text-gray-600">New Clients</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">{userMetrics.newCleaners}</div>
                    <div className="text-sm text-gray-600">New Cleaners</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">{userMetrics.retentionRate}%</div>
                    <div className="text-sm text-gray-600">Retention Rate</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-red-600 mb-1">{userMetrics.churnRate}%</div>
                    <div className="text-sm text-gray-600">Churn Rate</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>User Acquisition Channels</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Acquisition channel analytics coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* FINANCIAL TAB */}
          {activeTab === 'financial' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">${financialMetrics.gmv.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">GMV (Gross)</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">${financialMetrics.commission.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Commission</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">${financialMetrics.avgBookingValue}</div>
                    <div className="text-sm text-gray-600">Avg Booking</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-1">${financialMetrics.topServiceRevenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Top Service</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Forecasting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Revenue projections and forecasting coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* PERFORMANCE TAB */}
          {activeTab === 'performance' && (
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Average Response Time', value: '240ms', status: 'Excellent' },
                    { metric: 'Uptime', value: '99.98%', status: 'Excellent' },
                    { metric: 'API Error Rate', value: '0.02%', status: 'Good' },
                    { metric: 'Database Query Time', value: '45ms', status: 'Excellent' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.metric}</p>
                        <p className="text-sm text-gray-600">{item.status}</p>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{item.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

