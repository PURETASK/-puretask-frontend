'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState('financial');

  const recentReports = [
    { name: 'Monthly Financial Report', type: 'Financial', date: 'Jan 1, 2026', size: '2.4 MB' },
    { name: 'User Growth Report', type: 'Users', date: 'Dec 28, 2025', size: '1.8 MB' },
    { name: 'Booking Analytics', type: 'Bookings', date: 'Dec 25, 2025', size: '3.1 MB' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">📄 Reports & Exports</h1>
              <p className="text-gray-600">Generate custom reports and export data</p>
            </div>
            <Button variant="outline" onClick={() => (window.location.href = '/admin/dashboard')}>
              ← Back to Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Report Generator */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Generate New Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="financial">Financial Report</option>
                      <option value="users">User Activity Report</option>
                      <option value="bookings">Booking Analytics</option>
                      <option value="cleaners">Cleaner Performance</option>
                      <option value="revenue">Revenue Breakdown</option>
                      <option value="custom">Custom Report</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <Input type="date" defaultValue="2026-01-01" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <Input type="date" defaultValue="2026-01-10" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                    <div className="flex gap-3">
                      {['PDF', 'Excel', 'CSV', 'JSON'].map((format) => (
                        <label key={format} className="flex items-center gap-2">
                          <input type="radio" name="format" defaultChecked={format === 'PDF'} className="form-radio" />
                          <span className="text-gray-700">{format}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Include Sections</label>
                    <div className="space-y-2">
                      {['Summary Statistics', 'Detailed Transactions', 'Charts & Graphs', 'Recommendations'].map(
                        (section) => (
                          <label key={section} className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-gray-700">{section}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <Button variant="primary" className="w-full" size="lg">
                      🚀 Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Scheduled Reports */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Scheduled Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Weekly Financial Summary</p>
                        <p className="text-sm text-gray-600">Every Monday at 9:00 AM</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Monthly User Report</p>
                        <p className="text-sm text-gray-600">First day of month</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    + Add Scheduled Report
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Reports */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentReports.map((report, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-2xl">📊</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{report.name}</p>
                          <p className="text-xs text-gray-600">{report.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>{report.date}</span>
                        <span>{report.size}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 text-xs">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Exports */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Exports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    📥 Export All Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    📥 Export Bookings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    📥 Export Transactions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    📥 Export Reviews
                  </Button>
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

