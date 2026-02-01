'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function TemplateEditorPage() {
  const [template, setTemplate] = useState({
    name: '',
    category: 'booking',
    tags: ['confirmation', 'booking'],
    subject: '',
    message: 'Hi {CLIENT_NAME}!\n\nYour booking for {SERVICE_TYPE} on {DATE} at {TIME} is confirmed! 🎉\n\nI\'ll see you at:\n{ADDRESS}\n\nLooking forward!\n{YOUR_NAME}',
  });

  const variables = [
    '{CLIENT_NAME}',
    '{YOUR_NAME}',
    '{SERVICE_TYPE}',
    '{DATE}',
    '{TIME}',
    '{ADDRESS}',
    '{PRICE}',
    '{DURATION}',
  ];

  const insertVariable = (variable: string) => {
    setTemplate({ ...template, message: template.message + ' ' + variable });
  };

  // Generate live preview with sample data
  const livePreview = template.message
    .replace('{CLIENT_NAME}', 'Sarah')
    .replace('{YOUR_NAME}', 'Jane')
    .replace('{SERVICE_TYPE}', 'Standard Clean')
    .replace('{DATE}', 'Jan 15')
    .replace('{TIME}', '9:00 AM')
    .replace('{ADDRESS}', '123 Main St, Apt 4B')
    .replace('{PRICE}', '$135')
    .replace('{DURATION}', '3 hours');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Template</h1>
              <p className="text-gray-600">Create a new message template for your AI assistant</p>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = '/cleaner/ai-assistant/templates')}>
              ← Back to Templates
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Editor */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Template Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Template Name"
                    placeholder="e.g., Booking Confirmation"
                    value={template.name}
                    onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={template.category}
                      onChange={(e) => setTemplate({ ...template, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="booking">Booking Confirmation</option>
                      <option value="scheduling">Scheduling</option>
                      <option value="updates">Updates</option>
                      <option value="follow-up">Follow-up</option>
                      <option value="upsell">Upsell</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {template.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                          <button
                            className="ml-2 text-gray-600 hover:text-gray-900"
                            onClick={() => setTemplate({
                              ...template,
                              tags: template.tags.filter((_, i) => i !== index)
                            })}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                      <Button variant="outline" size="sm">+ Add Tag</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Template Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Subject (if email)"
                    placeholder="Optional email subject line"
                    value={template.subject}
                    onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      value={template.message}
                      onChange={(e) => setTemplate({ ...template, message: e.target.value })}
                      rows={12}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm"
                      placeholder="Type your message here..."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Variables (Click to insert)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {variables.map((variable) => (
                      <Button
                        key={variable}
                        variant="outline"
                        size="sm"
                        onClick={() => insertVariable(variable)}
                      >
                        {variable}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Preview */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-64">
                    <p className="text-gray-900 whitespace-pre-wrap">{livePreview}</p>
                  </div>
                  <div className="mt-6 space-y-3">
                    <Button variant="primary" className="w-full">
                      💾 Save to My Templates
                    </Button>
                    <Button variant="outline" className="w-full">
                      🌍 Publish to Marketplace
                    </Button>
                    <Button variant="outline" className="w-full">
                      📋 Copy & Use Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

