'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export default function AdminRiskPage() {
  const [activeTab, setActiveTab] = useState('alerts');

  const alerts = [
    {
      id: 'alert1',
      priority: 'high',
      user: 'Mike K.',
      userType: 'Client',
      issue: 'Multiple cancellations',
      details: '3 cancellations in 2 days',
      riskScore: 85,
    },
  ];

  const mediumAlerts = [
    'New cleaner: $500+ first booking',
    'Unusual login location: Sarah M.',
    'Payment dispute: Booking #3515',
  ];

  const openDisputes = [
    {
      id: 'dispute1',
      bookingId: '3521',
      client: 'Mike K.',
      cleaner: 'John S.',
      amount: 220,
      issue: 'Bathroom not cleaned',
      evidence: '3 photos uploaded',
      filed: '2 hours ago',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">⚠️ Risk Management</h1>
              <p className="text-gray-600">Monitor alerts, disputes, and platform safety</p>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = '/admin/dashboard')}>
              ← Back to Dashboard
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {['alerts', 'disputes', 'reports', 'bans'].map((tab) => (
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

          {/* ALERTS TAB */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              {/* High Priority */}
              <Card className="border-2 border-red-500">
                <CardHeader>
                  <CardTitle className="text-red-600">⚠️ HIGH PRIORITY ({alerts.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-4 bg-red-50 rounded-lg">
                      <div className="mb-3">
                        <h3 className="font-semibold text-gray-900 mb-1">{alert.issue}</h3>
                        <p className="text-sm text-gray-700">User: {alert.user} ({alert.userType})</p>
                        <p className="text-sm text-gray-700">Issue: {alert.details}</p>
                        <div className="mt-2">
                          <Badge variant="danger">Risk Score: {alert.riskScore}/100 (High)</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="primary" size="sm">
                          Review Account
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact
                        </Button>
                        <Button variant="outline" size="sm">
                          Flag
                        </Button>
                        <Button variant="danger" size="sm">
                          Ban
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Medium Priority */}
              <Card className="border-2 border-yellow-500">
                <CardHeader>
                  <CardTitle className="text-yellow-600">🟡 MEDIUM PRIORITY (3)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mediumAlerts.map((alert, index) => (
                      <li key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <span className="text-gray-700">• {alert}</span>
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* DISPUTES TAB */}
          {activeTab === 'disputes' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🔴 OPEN DISPUTES ({openDisputes.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {openDisputes.map((dispute) => (
                    <div key={dispute.id} className="p-4 border-2 border-red-300 rounded-lg">
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Booking #{dispute.bookingId}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">Client:</span>{' '}
                            <span className="font-medium text-gray-900">{dispute.client}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Cleaner:</span>{' '}
                            <span className="font-medium text-gray-900">{dispute.cleaner}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Amount:</span>{' '}
                            <span className="font-medium text-gray-900">${dispute.amount}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Filed:</span>{' '}
                            <span className="font-medium text-gray-900">{dispute.filed}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">
                          <strong>Issue:</strong> "{dispute.issue}"
                        </p>
                        <p className="text-sm text-gray-600">Evidence: {dispute.evidence}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="primary" size="sm">
                          Review Evidence
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact Client
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact Cleaner
                        </Button>
                        <Button variant="primary" size="sm">
                          Full Refund
                        </Button>
                        <Button variant="outline" size="sm">
                          Partial
                        </Button>
                        <Button variant="danger" size="sm">
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🤖 Fraud Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3">AI Score: 3 potential issues detected</p>
                  <Button variant="primary">Review Flagged Accounts</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === 'reports' && (
            <Card>
              <CardHeader>
                <CardTitle>User Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">User reports coming soon...</p>
              </CardContent>
            </Card>
          )}

          {/* BANS TAB */}
          {activeTab === 'bans' && (
            <Card>
              <CardHeader>
                <CardTitle>Banned Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Banned users list coming soon...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

