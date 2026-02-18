'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export default function AdminAPIPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const apiKeys = [
    { name: 'Production API Key', key: 'pk_live_••••••••••••3x7K', created: 'Jan 1, 2026', lastUsed: '2 hours ago', status: 'Active' },
    { name: 'Development API Key', key: 'pk_test_••••••••••••9mL2', created: 'Dec 15, 2025', lastUsed: 'Never', status: 'Active' },
  ];

  const endpoints = [
    { method: 'GET', path: '/api/v1/users', description: 'List all users', rateLimit: '100/min' },
    { method: 'GET', path: '/api/v1/bookings', description: 'List all bookings', rateLimit: '100/min' },
    { method: 'POST', path: '/api/v1/bookings', description: 'Create a new booking', rateLimit: '50/min' },
    { method: 'GET', path: '/api/v1/cleaners', description: 'List all cleaners', rateLimit: '100/min' },
    { method: 'POST', path: '/api/v1/messages', description: 'Send a message', rateLimit: '200/min' },
  ];

  const webhooks = [
    { event: 'booking.created', url: 'https://example.com/webhooks', status: 'Active' },
    { event: 'booking.completed', url: 'https://example.com/webhooks', status: 'Active' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">🔌 API Access</h1>
              <p className="text-gray-600">Manage API keys and integrations</p>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = '/admin/dashboard')}>
              ← Back to Dashboard
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {['overview', 'keys', 'docs', 'webhooks'].map((tab) => (
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

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">🚀 PureTask API v1.0</h3>
                  <p className="text-gray-700 mb-4">
                    The PureTask API allows you to programmatically access platform features, manage bookings, users, and more.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✓ RESTful API with JSON responses</li>
                    <li>✓ OAuth 2.0 authentication</li>
                    <li>✓ Rate limiting: 1000 requests per hour</li>
                    <li>✓ Webhook support for real-time events</li>
                    <li>✓ Comprehensive documentation</li>
                  </ul>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">2</div>
                    <div className="text-sm text-gray-600">Active API Keys</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">1,247</div>
                    <div className="text-sm text-gray-600">API Calls (24h)</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* KEYS TAB */}
          {activeTab === 'keys' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>API Keys</CardTitle>
                    <Button variant="primary">+ Create New Key</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {apiKeys.map((key, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{key.name}</h4>
                            <Badge variant={key.status === 'Active' ? 'default' : 'secondary'}>{key.status}</Badge>
                          </div>
                          <p className="font-mono text-sm text-gray-600 mb-2">{key.key}</p>
                          <div className="flex gap-4 text-xs text-gray-500">
                            <span>Created: {key.created}</span>
                            <span>Last used: {key.lastUsed}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Copy
                          </Button>
                          <Button variant="outline" size="sm">
                            Rotate
                          </Button>
                          <Button variant="danger" size="sm">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Keep your API keys secure</h4>
                      <p className="text-sm text-gray-700">
                        Never share your API keys publicly or commit them to version control. If a key is compromised, rotate it immediately.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* DOCS TAB */}
          {activeTab === 'docs' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Endpoints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {endpoints.map((endpoint, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <Badge variant={endpoint.method === 'GET' ? 'default' : 'secondary'} className="font-mono">
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm text-gray-900">{endpoint.path}</code>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">{endpoint.description}</span>
                          <Badge variant="secondary" className="text-xs">{endpoint.rateLimit}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Example Request</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code>{`curl -X GET https://api.puretask.com/v1/bookings \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Example Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code>{`{
  "data": [
    {
      "id": "bkg_123",
      "client_id": "usr_456",
      "cleaner_id": "cln_789",
      "service": "Standard Cleaning",
      "date": "2026-01-15",
      "status": "confirmed"
    }
  ],
  "pagination": {
    "total": 3521,
    "page": 1,
    "per_page": 25
  }
}`}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}

          {/* WEBHOOKS TAB */}
          {activeTab === 'webhooks' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Webhooks</CardTitle>
                    <Button variant="primary">+ Add Webhook</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {webhooks.map((webhook, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-sm font-semibold text-gray-900">{webhook.event}</code>
                            <Badge variant="default">{webhook.status}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{webhook.url}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Test
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="danger" size="sm">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      'booking.created', 'booking.updated', 'booking.completed', 'booking.cancelled',
                      'user.created', 'user.updated', 'message.sent', 'review.posted'
                    ].map((event) => (
                      <div key={event} className="p-2 bg-gray-50 rounded text-sm">
                        <code className="text-gray-900">{event}</code>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

