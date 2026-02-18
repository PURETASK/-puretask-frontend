'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export default function MessageHistoryPage() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const messages = [
    {
      id: 'mh1',
      type: 'auto-sent',
      time: 'Today 9:45 AM',
      client: 'Sarah M.',
      question: 'What time can you come tomorrow?',
      aiResponse: "I'm available from 9 AM onwards! What time works best for you?",
      template: 'Availability',
      reaction: 'liked',
    },
    {
      id: 'mh2',
      type: 'escalated',
      time: 'Today 8:30 AM',
      client: 'Mike K.',
      question: 'I need to reschedule urgently',
      aiResponse: 'I understand this is urgent. Let me check my availability...',
      reason: 'Urgent request',
      yourResponse: 'No problem! I have openings on...',
    },
    {
      id: 'mh3',
      type: 'auto-sent',
      time: 'Yesterday 3:15 PM',
      client: 'Emily D.',
      question: 'What is your hourly rate?',
      aiResponse: 'My standard cleaning rate is $45/hour with a 3-hour minimum.',
      template: 'Pricing',
      reaction: null,
    },
    {
      id: 'mh4',
      type: 'manual',
      time: 'Yesterday 11:00 AM',
      client: 'John S.',
      question: 'Do you clean commercial spaces?',
      yourResponse: 'Yes, I do! I have experience with offices and retail spaces...',
    },
  ];

  const filteredMessages =
    filter === 'all' ? messages : messages.filter((m) => m.type === filter);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Message History</h1>
              <p className="text-gray-600">View all AI-sent and manual messages</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => (window.location.href = '/cleaner/ai-assistant')}>
                ← Back
              </Button>
              <Button variant="primary">📊 View Analytics</Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {['all', 'auto-sent', 'manual', 'escalated'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors capitalize',
                  filter === tab ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                )}
              >
                {tab.replace('-', ' ')} ({messages.filter((m) => tab === 'all' || m.type === tab).length})
              </button>
            ))}
          </div>

          {/* Search & Date Filter */}
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="this-week">This Week</option>
              <option value="last-week">Last Week</option>
              <option value="this-month">This Month</option>
              <option value="all-time">All Time</option>
            </select>
          </div>

          {/* Messages List */}
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <Card key={message.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {message.type === 'auto-sent' && <span className="text-2xl">🤖</span>}
                      {message.type === 'escalated' && <span className="text-2xl">⚠️</span>}
                      {message.type === 'manual' && <span className="text-2xl">👤</span>}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {message.type === 'auto-sent' ? 'Auto-sent' : message.type === 'escalated' ? 'Escalated' : 'Manual'} • {message.time}
                        </p>
                        <p className="text-sm text-gray-600">To: {message.client}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Full Thread
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Q: &quot;{message.question}&quot;</p>
                    </div>

                    {message.aiResponse && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-900">AI Response: &quot;{message.aiResponse}&quot;</p>
                        {message.template && (
                          <p className="text-xs text-gray-600 mt-2">Template used: {message.template}</p>
                        )}
                        {message.reaction === 'liked' && (
                          <div className="mt-2">
                            <Badge variant="info">👍 Client liked response</Badge>
                          </div>
                        )}
                      </div>
                    )}

                    {message.type === 'escalated' && message.reason && (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-800">Reason: {message.reason}</p>
                        {message.yourResponse && (
                          <p className="text-sm text-gray-900 mt-2">Your response: &quot;{message.yourResponse}&quot;</p>
                        )}
                      </div>
                    )}

                    {message.type === 'manual' && message.yourResponse && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-900">Your response: &quot;{message.yourResponse}&quot;</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Export */}
          <div className="mt-8 flex justify-center gap-4">
            <Button variant="outline">📥 Export Data</Button>
            <Button variant="outline">📊 View Analytics</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

