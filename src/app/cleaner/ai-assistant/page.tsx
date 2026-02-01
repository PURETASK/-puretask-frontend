'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import { formatDate } from '@/lib/utils';

export default function AIAssistantDashboardPage() {
  const [aiEnabled, setAiEnabled] = React.useState(true);

  const todayStats = {
    messagesHandled: 12,
    autoReplied: 8,
    escalated: 4,
    satisfaction: 98,
  };

  const weekStats = {
    messages: 47,
    autoHandled: 35,
    avgResponseTime: '3.2 min',
    satisfaction: 96,
    timeSaved: 5,
  };

  const recentResponses = [
    {
      id: 'r1',
      time: '9:45 AM',
      client: 'Sarah M.',
      question: 'What time can you come tomorrow?',
      aiResponse: "I'm available from 9 AM onwards! What time works best for you?",
      status: 'sent',
      liked: true,
    },
    {
      id: 'r2',
      time: '8:30 AM',
      client: 'Mike K.',
      question: 'What is your hourly rate?',
      aiResponse: 'My standard cleaning rate is $45/hour with a 3-hour minimum. Would you like to schedule a booking?',
      status: 'sent',
      liked: false,
    },
    {
      id: 'r3',
      time: '7:15 AM',
      client: 'Emily D.',
      question: 'I need to reschedule urgently',
      aiResponse: 'I understand this is urgent. Let me check my availability...',
      status: 'escalated',
      liked: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">🤖 AI Assistant</h1>
              <p className="text-gray-600">Your automated messaging assistant</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => (window.location.href = '/cleaner/ai-assistant/settings')}>
                ⚙️ Settings
              </Button>
              <Button variant="primary" onClick={() => (window.location.href = '/cleaner/ai-assistant/templates')}>
                📝 Templates
              </Button>
            </div>
          </div>

          {/* AI Status Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${aiEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-xl font-semibold text-gray-900">
                    AI Assistant: {aiEnabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <Toggle checked={aiEnabled} onChange={(e) => setAiEnabled(e.target.checked)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div>✅ Auto-reply: Enabled</div>
                <div>⚡ Response time: &lt; 5 minutes</div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Activity */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Today's Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{todayStats.messagesHandled}</div>
                  <div className="text-sm text-gray-600 mt-1">Messages Handled</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{todayStats.autoReplied}</div>
                  <div className="text-sm text-gray-600 mt-1">Auto-Replied</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">{todayStats.escalated}</div>
                  <div className="text-sm text-gray-600 mt-1">Escalated to You</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{todayStats.satisfaction}%</div>
                  <div className="text-sm text-gray-600 mt-1">Satisfaction</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent AI Responses */}
            <Card>
              <CardHeader>
                <CardTitle>Recent AI Responses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentResponses.map((response) => (
                  <div key={response.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{response.time} • {response.client}</span>
                      <Badge variant={response.status === 'escalated' ? 'warning' : 'primary'}>
                        {response.status === 'escalated' ? '⚠️ Escalated' : '✅ Sent'}
                      </Badge>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-gray-600 mb-1">Q: &quot;{response.question}&quot;</p>
                      <p className="text-sm text-gray-900">AI: &quot;{response.aiResponse}&quot;</p>
                    </div>
                    {response.liked && (
                      <div className="text-sm text-green-600">👍 Client liked response</div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* This Week Stats */}
            <Card>
              <CardHeader>
                <CardTitle>This Week Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Messages</div>
                      <div className="text-2xl font-bold text-gray-900">{weekStats.messages}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Auto-handled</div>
                      <div className="text-2xl font-bold text-gray-900">{weekStats.autoHandled} ({Math.round((weekStats.autoHandled / weekStats.messages) * 100)}%)</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Avg Response</div>
                      <div className="text-2xl font-bold text-gray-900">{weekStats.avgResponseTime}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Satisfaction</div>
                      <div className="text-2xl font-bold text-gray-900">{weekStats.satisfaction}%</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-blue-200">
                    <div className="text-lg font-semibold text-gray-900">💰 Time saved: ~{weekStats.timeSaved} hours</div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => (window.location.href = '/cleaner/ai-assistant/settings')}>
                    ⚙️ AI Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => (window.location.href = '/cleaner/ai-assistant/templates')}>
                    📝 Manage Templates
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => (window.location.href = '/cleaner/ai-assistant/quick-responses')}>
                    ⚡ Quick Responses
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => (window.location.href = '/cleaner/ai-assistant/analytics')}>
                    📊 View Full Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

