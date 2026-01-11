'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import { jobService } from '@/services/job.service';
import { messageService } from '@/services/message.service';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function APITestPage() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Add test result
  const addResult = (name: string, success: boolean, data?: any, error?: any) => {
    setTestResults((prev) => [
      ...prev,
      {
        name,
        success,
        data,
        error,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  // Test Authentication
  const testAuth = async () => {
    setIsLoading(true);
    try {
      // Test login (you'll need to use a real test account)
      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });
      addResult('Login Test', true, result);
    } catch (error: any) {
      addResult('Login Test', false, null, error.message);
    }
    setIsLoading(false);
  };

  // Test Job Listing
  const testJobListing = async () => {
    setIsLoading(true);
    try {
      const result = await jobService.getMyJobs({ page: 1, per_page: 10 });
      addResult('Get Jobs Test', true, result);
    } catch (error: any) {
      addResult('Get Jobs Test', false, null, error.message);
    }
    setIsLoading(false);
  };

  // Test Messages
  const testMessages = async () => {
    setIsLoading(true);
    try {
      const result = await messageService.getConversations({ page: 1, per_page: 10 });
      addResult('Get Conversations Test', true, result);
    } catch (error: any) {
      addResult('Get Conversations Test', false, null, error.message);
    }
    setIsLoading(false);
  };

  // Test Unread Count
  const testUnreadCount = async () => {
    setIsLoading(true);
    try {
      const result = await messageService.getUnreadCount();
      addResult('Get Unread Count Test', true, result);
    } catch (error: any) {
      addResult('Get Unread Count Test', false, null, error.message);
    }
    setIsLoading(false);
  };

  // Clear results
  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">🔧 API Infrastructure Test Page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Authentication Status</h3>
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Badge variant="primary">Authenticated</Badge>
                  <span className="text-gray-700">
                    Logged in as: <strong>{user?.email}</strong> ({user?.role})
                  </span>
                  <Button variant="secondary" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div>
                  <Badge variant="secondary">Not Authenticated</Badge>
                  <p className="text-gray-600 mt-2">
                    You need to be logged in to test most API endpoints.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">API Configuration</h3>
              <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm text-gray-700">
                <div>
                  <strong>Backend URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}
                </div>
                <div>
                  <strong>Frontend URL:</strong> {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                variant="primary"
                onClick={testAuth}
                disabled={isLoading}
              >
                Test Login
              </Button>
              <Button
                variant="primary"
                onClick={testJobListing}
                disabled={isLoading || !isAuthenticated}
              >
                Test Get Jobs
              </Button>
              <Button
                variant="primary"
                onClick={testMessages}
                disabled={isLoading || !isAuthenticated}
              >
                Test Messages
              </Button>
              <Button
                variant="primary"
                onClick={testUnreadCount}
                disabled={isLoading || !isAuthenticated}
              >
                Test Unread Count
              </Button>
            </div>
            <div className="mt-4">
              <Button variant="secondary" onClick={clearResults}>
                Clear Results
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results ({testResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <p className="text-gray-600">No tests run yet. Click a button above to test an endpoint.</p>
            ) : (
              <div className="space-y-3">
                {testResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${
                      result.success
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {result.success ? '✅' : '❌'}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {result.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {result.timestamp}
                      </span>
                    </div>
                    {result.success ? (
                      <div className="bg-white p-3 rounded border border-green-200">
                        <pre className="text-xs overflow-x-auto text-gray-700">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="bg-white p-3 rounded border border-red-200">
                        <p className="text-red-600 font-medium">
                          Error: {result.error}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📖 Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-gray-700">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">1. Start Your Backend Server</h4>
                <p>Make sure your backend is running on <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code></p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">2. Create a Test Account</h4>
                <p>Register a test user through your backend or use an existing account.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">3. Update Test Credentials</h4>
                <p>Edit the <code className="bg-gray-100 px-2 py-1 rounded">testAuth()</code> function in this file to use your test credentials.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">4. Run Tests</h4>
                <p>Click the test buttons above to verify each API endpoint is working correctly.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

