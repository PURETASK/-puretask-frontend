'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export default function QuickResponsesPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['all', 'availability', 'pricing', 'policies', 'confirmation', 'custom'];

  const quickResponses = [
    {
      id: 'qr1',
      category: 'availability',
      shortcut: '/available',
      response: "I'm available! What day/time works best for you? 📅",
      usedCount: 23,
    },
    {
      id: 'qr2',
      category: 'availability',
      shortcut: '/tomorrow',
      response: 'I have openings tomorrow at 9 AM, 12 PM, and 3 PM!',
      usedCount: 15,
    },
    {
      id: 'qr3',
      category: 'pricing',
      shortcut: '/price',
      response: 'Standard cleaning is $45/hr with a 3-hour minimum 💰',
      usedCount: 31,
    },
    {
      id: 'qr4',
      category: 'pricing',
      shortcut: '/deep',
      response: 'Deep cleaning is $65/hr. It includes everything in standard cleaning plus...',
      usedCount: 18,
    },
    {
      id: 'qr5',
      category: 'policies',
      shortcut: '/cancel',
      response: 'Free cancellation up to 24 hours before your booking. Within 24 hours incurs a 50% fee.',
      usedCount: 7,
    },
    {
      id: 'qr6',
      category: 'confirmation',
      shortcut: '/confirm',
      response: 'Your booking is confirmed! I\'ll see you on {DATE} at {TIME}. Looking forward to it! ✨',
      usedCount: 42,
    },
  ];

  const filteredResponses =
    activeCategory === 'all'
      ? quickResponses
      : quickResponses.filter((qr) => qr.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quick Responses</h1>
              <p className="text-gray-600">Manage your quick reply shortcuts</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => (window.location.href = '/cleaner/ai-assistant')}>
                ← Back
              </Button>
              <Button variant="primary">+ Create New</Button>
            </div>
          </div>

          {/* How to Use */}
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">How to Use Quick Responses</h3>
                  <p className="text-blue-700">
                    Type "/" in any message to see all shortcuts, or type the shortcut directly (e.g., "/price") to
                    instantly insert the response.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors capitalize',
                  activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                )}
              >
                {category} ({quickResponses.filter((qr) => category === 'all' || qr.category === category).length})
              </button>
            ))}
          </div>

          {/* Quick Responses List */}
          <div className="space-y-4">
            {filteredResponses.map((qr) => (
              <Card key={qr.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary" className="font-mono">
                          {qr.shortcut}
                        </Badge>
                        <Badge variant="primary" className="capitalize">
                          {qr.category}
                        </Badge>
                      </div>
                      <p className="text-gray-900 mb-2">&quot;{qr.response}&quot;</p>
                      <p className="text-sm text-gray-600">Used: {qr.usedCount} times</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        ✏️ Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        🧪 Test
                      </Button>
                      <Button variant="danger" size="sm">
                        🗑️ Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Example Usage */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Example Usage in Messaging</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                  <span className="font-medium text-gray-900">Chat with Sarah M.</span>
                </div>
                <div className="p-4 space-y-4 bg-white">
                  <div className="flex justify-start">
                    <div className="bg-gray-200 rounded-lg px-4 py-2 max-w-xs">
                      <p className="text-gray-900">What&apos;s your rate?</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs">
                      <p className="font-mono text-sm mb-2 opacity-75">/price</p>
                      <p>Standard cleaning is $45/hr with a 3-hour minimum 💰</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

