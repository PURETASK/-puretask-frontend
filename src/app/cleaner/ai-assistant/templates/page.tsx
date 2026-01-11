'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { cn } from '@/lib/utils';

export default function TemplateLibraryPage() {
  const [activeTab, setActiveTab] = useState('my-templates');
  const [searchQuery, setSearchQuery] = useState('');

  const myTemplates = [
    {
      id: 't1',
      name: 'Booking Confirmation',
      category: 'Booking',
      isDefault: true,
      preview: 'Hi {CLIENT_NAME}! Your booking for {DATE} at {TIME} is confirmed...',
      usedCount: 47,
      rating: 4.8,
    },
    {
      id: 't2',
      name: 'Running Late',
      category: 'Updates',
      isDefault: false,
      preview: 'Hi! Traffic is heavier than expected. I\'ll be about 15 minutes late. Sorry for...',
      usedCount: 8,
      rating: 4.5,
    },
    {
      id: 't3',
      name: 'Thank You',
      category: 'Follow-up',
      isDefault: false,
      preview: 'Thank you so much for choosing me! I hope you\'re happy with the cleaning...',
      usedCount: 34,
      rating: 4.9,
    },
    {
      id: 't4',
      name: 'Availability Response',
      category: 'Scheduling',
      isDefault: false,
      preview: 'I\'m available on {DATES}. What time works best for you?',
      usedCount: 56,
      rating: 4.7,
    },
  ];

  const marketplaceTemplates = [
    {
      id: 'm1',
      name: 'Professional Follow-up',
      author: 'TopCleaner123',
      rating: 4.9,
      ratingCount: 234,
      usedByCount: 1247,
      category: 'Follow-up',
      preview: 'Hello {CLIENT_NAME}, thank you for booking with me! I wanted to follow up...',
    },
    {
      id: 'm2',
      name: 'Rescheduling Made Easy',
      author: 'ProCleaner99',
      rating: 4.8,
      ratingCount: 189,
      usedByCount: 892,
      category: 'Scheduling',
      preview: 'No problem at all! I understand things come up. I have availability on...',
    },
    {
      id: 'm3',
      name: 'Add-On Service Offer',
      author: 'CleanQueen2024',
      rating: 4.7,
      ratingCount: 156,
      usedByCount: 678,
      category: 'Upsell',
      preview: 'While I\'m there, would you like me to also take care of {ADD_ON}?',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Message Templates</h1>
              <p className="text-gray-600">Manage your AI message templates</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => (window.location.href = '/cleaner/ai-assistant')}>
                ← Back
              </Button>
              <Button variant="primary" onClick={() => (window.location.href = '/cleaner/ai-assistant/templates/new')}>
                ✨ Create New
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'my-templates', label: 'My Templates', count: myTemplates.length },
              { id: 'marketplace', label: 'Marketplace', count: marketplaceTemplates.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-6 py-3 rounded-lg font-medium transition-colors',
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="all">All Categories</option>
              <option value="booking">Booking</option>
              <option value="scheduling">Scheduling</option>
              <option value="updates">Updates</option>
              <option value="follow-up">Follow-up</option>
              <option value="upsell">Upsell</option>
            </select>
          </div>

          {/* MY TEMPLATES TAB */}
          {activeTab === 'my-templates' && (
            <div className="grid gap-4">
              {myTemplates.map((template) => (
                <Card key={template.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">📋 {template.name}</h3>
                          {template.isDefault && <Badge variant="primary">Default</Badge>}
                        </div>
                        <p className="text-sm text-gray-600">Category: {template.category}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => (window.location.href = `/cleaner/ai-assistant/templates/${template.id}`)}>
                          ✏️ Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          📋 Use
                        </Button>
                        <Button variant="outline" size="sm">
                          📄 Duplicate
                        </Button>
                      </div>
                    </div>
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 italic">&quot;{template.preview}&quot;</p>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span>Used: {template.usedCount} times</span>
                      <div className="flex items-center gap-1">
                        <Rating value={template.rating} readonly size="sm" />
                        <span>({template.rating}/5)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* MARKETPLACE TAB */}
          {activeTab === 'marketplace' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">🏆 Top Rated from Community</h3>
                <p className="text-sm text-blue-700">Discover templates created and shared by other successful cleaners</p>
              </div>

              <div className="grid gap-4">
                {marketplaceTemplates.map((template) => (
                  <Card key={template.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">By: {template.author}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Rating value={template.rating} readonly size="sm" />
                              <span>{template.rating} ({template.ratingCount} ratings)</span>
                            </div>
                            <span>Used by: {template.usedByCount.toLocaleString()} cleaners</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            👁️ Preview
                          </Button>
                          <Button variant="primary" size="sm">
                            + Add to My Templates
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 italic">&quot;{template.preview}&quot;</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

