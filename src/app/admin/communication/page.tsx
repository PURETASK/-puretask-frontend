'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { adminEnhancedService } from '@/services/adminEnhanced.service';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Sparkles, TrendingUp, Mail, MessageSquare, Bell } from 'lucide-react';

type CommunicationAnalytics = {
  open_rate?: number;
  click_rate?: number;
  total_sent?: number;
  response_rate?: number;
};

export default function AdminCommunicationPage() {
  const [activeTab, setActiveTab] = useState('broadcast');

  // Get communication analytics
  const { data: analyticsData } = useQuery({
    queryKey: ['admin', 'communication', 'analytics'],
    queryFn: () => adminEnhancedService.getCommunicationAnalytics() as Promise<CommunicationAnalytics>,
  });

  // Get templates
  const { data: templatesData } = useQuery({
    queryKey: ['admin', 'communication', 'templates'],
    queryFn: () => adminEnhancedService.getTemplates(),
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">📢 Communication Hub</h1>
              <p className="text-gray-600">Broadcast messages and manage support tickets</p>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = '/admin/dashboard')}>
              ← Back to Dashboard
            </Button>
          </div>

          {/* Communication Analytics */}
          {analyticsData && (
            <Card className="mb-6 border-purple-200 bg-purple-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-purple-900 mb-2">Communication Analytics</h3>
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      {analyticsData.open_rate !== undefined && (
                        <div>
                          <p className="text-purple-700">Email Open Rate</p>
                          <p className="text-lg font-bold text-purple-900">{analyticsData.open_rate}%</p>
                        </div>
                      )}
                      {analyticsData.click_rate !== undefined && (
                        <div>
                          <p className="text-purple-700">Click Rate</p>
                          <p className="text-lg font-bold text-purple-900">{analyticsData.click_rate}%</p>
                        </div>
                      )}
                      {analyticsData.total_sent && (
                        <div>
                          <p className="text-purple-700">Total Sent</p>
                          <p className="text-lg font-bold text-purple-900">{analyticsData.total_sent}</p>
                        </div>
                      )}
                      {analyticsData.response_rate !== undefined && (
                        <div>
                          <p className="text-purple-700">Response Rate</p>
                          <p className="text-lg font-bold text-purple-900">{analyticsData.response_rate}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {['broadcast', 'templates', 'support'].map((tab) => (
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

          {/* BROADCAST TAB */}
          {activeTab === 'broadcast' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Send Message to Users</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                    <div className="space-y-2">
                      {['All users', 'Clients only', 'Cleaners only', 'Active users (last 30 days)', 'Custom segment'].map(
                        (option) => (
                          <label key={option} className="flex items-center gap-2">
                            <input type="radio" name="recipients" className="form-radio" />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Channel</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-gray-700">Email</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-gray-700">SMS</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-gray-700">Push</span>
                      </label>
                    </div>
                  </div>

                  <Input label="Subject" placeholder="Enter message subject" />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Type your message here..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="schedule" defaultChecked className="form-radio" />
                        <span className="text-gray-700">Send now</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="schedule" className="form-radio" />
                        <span className="text-gray-700">Schedule for:</span>
                        <Input type="datetime-local" className="ml-2" />
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline">Preview</Button>
                    <Button variant="outline">Send to Test Email</Button>
                    <Button variant="primary">Send Message</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Broadcasts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">&quot;Holiday Hours Update&quot;</p>
                        <p className="text-sm text-gray-600">Sent to 1,247 users • 2 days ago</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">&quot;New Features!&quot;</p>
                        <p className="text-sm text-gray-600">Sent to 345 cleaners • 5 days ago</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TEMPLATES TAB */}
          {activeTab === 'templates' && (
            <Card>
              <CardHeader>
                <CardTitle>Message Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Message templates coming soon...</p>
              </CardContent>
            </Card>
          )}

          {/* SUPPORT TAB */}
          {activeTab === 'support' && (
            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Support ticket system coming soon...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

