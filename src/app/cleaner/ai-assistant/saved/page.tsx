'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function SavedMessagesPage() {
  const savedMessages = [
    {
      id: 'sm1',
      title: 'Perfect booking confirmation',
      savedDate: 'Jan 10',
      message: 'Thank you so much for choosing me! Looking forward to working with you! I\'ll arrive 5 minutes early to ensure we start on time.',
      performance: '100% positive',
    },
    {
      id: 'sm2',
      title: 'Great rescheduling response',
      savedDate: 'Jan 8',
      message: 'No worries at all! I have availability on [dates]. Which works better for you?',
      performance: '95% conversion',
    },
    {
      id: 'sm3',
      title: 'Professional pricing response',
      savedDate: 'Jan 5',
      message: 'My standard rate is $45/hour with a 3-hour minimum. This includes all supplies and equipment. Would you like to schedule a booking?',
      performance: '88% conversion',
    },
    {
      id: 'sm4',
      title: 'Upsell add-ons successfully',
      savedDate: 'Jan 3',
      message: 'While I\'m there, I can also clean inside your fridge for an additional $20 and inside the oven for $25. Would you like to add these?',
      performance: '67% accepted',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">⭐ Saved Messages</h1>
              <p className="text-gray-600">Your favorite messages saved for future reference</p>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = '/cleaner/ai-assistant')}>
              ← Back to Dashboard
            </Button>
          </div>

          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <p className="text-blue-700">
                💡 Star messages from your Message History to save them here. Use your best-performing messages to
                create new templates or reference them when crafting responses.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {savedMessages.map((message) => (
              <Card key={message.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{message.title}</h3>
                      <p className="text-sm text-gray-600">Saved: {message.savedDate}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        📝 Use as Template
                      </Button>
                      <Button variant="outline" size="sm">
                        📋 Copy
                      </Button>
                      <Button variant="ghost" size="sm">
                        ⭐ Remove
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg mb-3">
                    <p className="text-gray-900">&quot;{message.message}&quot;</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant="primary">Performance: {message.performance}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {savedMessages.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <span className="text-6xl mb-4 block">⭐</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved messages yet</h3>
                <p className="text-gray-600 mb-4">
                  Start saving your best-performing messages from your Message History!
                </p>
                <Button variant="primary" onClick={() => (window.location.href = '/cleaner/ai-assistant/history')}>
                  View Message History
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

