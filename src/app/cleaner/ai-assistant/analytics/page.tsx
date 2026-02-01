'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function AIAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'templates', label: 'Templates', icon: '📝' },
    { id: 'impact', label: 'Impact', icon: '💰' },
  ];

  const monthStats = {
    messagesHandled: 187,
    autoReplied: 142,
    avgResponseTime: '3.2 min',
    satisfaction: 96,
  };

  const topTemplates = [
    { name: 'Booking Confirmation', satisfaction: 98, usedCount: 45 },
    { name: 'Availability Response', satisfaction: 95, usedCount: 56 },
    { name: 'Thank You Message', satisfaction: 97, usedCount: 34 },
  ];

  const businessImpact = {
    timeSaved: 18,
    bookingsConverted: 34,
    clientRetention: 12,
    reviewsSent: 47,
    reviewRate: 68,
    reviewIncrease: 15,
  };

  const messageBreakdown = [
    { category: 'Availability', percentage: 35, color: 'bg-blue-500' },
    { category: 'Pricing', percentage: 22, color: 'bg-green-500' },
    { category: 'Confirmations', percentage: 18, color: 'bg-purple-500' },
    { category: 'Follow-ups', percentage: 15, color: 'bg-yellow-500' },
    { category: 'Other', percentage: 10, color: 'bg-gray-500' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Performance Analytics</h1>
              <p className="text-gray-600">Detailed metrics and insights</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => (window.location.href = '/cleaner/ai-assistant')}>
                ← Back
              </Button>
              <Button variant="primary">📥 Export Report</Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-6 py-3 font-medium transition-colors border-b-2',
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                )}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* This Month Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-4xl font-bold text-blue-600 mb-2">{monthStats.messagesHandled}</div>
                      <div className="text-sm text-gray-600">Messages Handled</div>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-4xl font-bold text-green-600">
                        {monthStats.autoReplied} ({Math.round((monthStats.autoReplied / monthStats.messagesHandled) * 100)}%)
                      </div>
                      <div className="text-sm text-gray-600">Auto-replied</div>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <div className="text-4xl font-bold text-purple-600">{monthStats.avgResponseTime}</div>
                      <div className="text-sm text-gray-600">Avg Response Time</div>
                    </div>
                    <div className="text-center p-6 bg-yellow-50 rounded-lg">
                      <div className="text-4xl font-bold text-yellow-600">{monthStats.satisfaction}%</div>
                      <div className="text-sm text-gray-600">Client Satisfaction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Response Time Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-600 mb-2">📈 Response Time Chart</p>
                      <p className="text-sm text-gray-500">Average response improving week over week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Performing Templates */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Templates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {topTemplates.map((template, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{index + 1}. {template.name}</p>
                          <p className="text-sm text-gray-600">Used {template.usedCount} times</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">{template.satisfaction}%</p>
                          <p className="text-xs text-gray-600">satisfaction</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Business Impact */}
                <Card>
                  <CardHeader>
                    <CardTitle>Business Impact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">~{businessImpact.timeSaved} hours</p>
                      <p className="text-sm text-gray-600">Time Saved This Month</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{businessImpact.bookingsConverted}</p>
                        <p className="text-xs text-gray-600">Bookings Converted</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">+{businessImpact.clientRetention}%</p>
                        <p className="text-xs text-gray-600">Client Retention</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">{businessImpact.reviewsSent}</p>
                        <p className="text-xs text-gray-600">Review Requests Sent</p>
                      </div>
                      <div className="p-3 bg-pink-50 rounded-lg">
                        <p className="text-2xl font-bold text-pink-600">{businessImpact.reviewRate}%</p>
                        <p className="text-xs text-gray-600">Review Rate (+{businessImpact.reviewIncrease}%)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Message Breakdown by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {messageBreakdown.map((category) => (
                      <div key={category.category}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-900 font-medium">{category.category}</span>
                          <span className="text-gray-600">{category.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`${category.color} h-3 rounded-full transition-all`}
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TEMPLATES TAB */}
          {activeTab === 'templates' && (
            <Card>
              <CardHeader>
                <CardTitle>Template Performance Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Detailed analytics for each template coming soon...</p>
              </CardContent>
            </Card>
          )}

          {/* IMPACT TAB */}
          {activeTab === 'impact' && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Business Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">ROI calculations and business metrics coming soon...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

