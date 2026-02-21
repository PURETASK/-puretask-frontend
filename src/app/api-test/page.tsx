'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import { jobService } from '@/services/job.service';
import { messageService } from '@/services/message.service';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { apiGet } from '@/lib/apiClient';
import { STORAGE_KEYS } from '@/lib/config';

const BACKEND_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4000';

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

  // Health check (no auth) – verifies backend is reachable and CORS is OK
  const testHealth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_BASE}/health`, { method: 'GET' });
      const text = await res.text();
      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch {
        data = text || null;
      }
      addResult('Health Check', res.ok, { status: res.status, data });
    } catch (err: any) {
      addResult(
        'Health Check',
        false,
        null,
        err?.message || 'Network/CORS error. Is the backend on port 4000?'
      );
    }
    setIsLoading(false);
  };

  // Protected route – uses apiClient (same client as Trust hooks); verifies Bearer token is sent
  const testProtectedRoute = async () => {
    setIsLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) : null;
      if (!token) {
        addResult('Protected Route (/api/credits/balance)', false, null, 'No token. Log in first.');
        setIsLoading(false);
        return;
      }
      const data = await apiGet<{ balance?: number }>('/api/credits/balance');
      addResult('Protected Route (/api/credits/balance)', true, data);
    } catch (err: any) {
      const msg = err?.status ? `${err.status}: ${err?.message || 'Unauthorized'}` : (err?.message || 'Request failed');
      addResult('Protected Route (/api/credits/balance)', false, null, msg);
    }
    setIsLoading(false);
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
                  <Badge variant="success">Authenticated</Badge>
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
                  <strong>Backend URL:</strong> {BACKEND_BASE}
                </div>
                <div>
                  <strong>Frontend URL:</strong> {process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001')}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Token key: {STORAGE_KEYS.AUTH_TOKEN} | Set via NEXT_PUBLIC_API_URL or NEXT_PUBLIC_API_BASE_URL
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
                onClick={testHealth}
                disabled={isLoading}
              >
                Health Check
              </Button>
              <Button
                variant="primary"
                onClick={testProtectedRoute}
                disabled={isLoading}
              >
                Protected Route
              </Button>
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
                <p>Backend must run on <code className="bg-gray-100 px-2 py-1 rounded">{BACKEND_BASE}</code> (configure via <code>NEXT_PUBLIC_API_URL</code> or <code>NEXT_PUBLIC_API_BASE_URL</code> in .env.local).</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">2. Quick Connectivity Tests</h4>
                <p><strong>Health Check</strong> – verifies backend is reachable (no auth). If this fails, check CORS allows your origin (e.g. localhost:3001).</p>
                <p><strong>Protected Route</strong> – calls <code>/api/credits/balance</code> with Bearer token. 200 = token valid; 401 = token missing/invalid.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">3. Create a Test Account</h4>
                <p>Register via <code>/auth/register</code> or use an existing account. Backend must return <code>token</code> (not <code>accessToken</code>) in login/register response.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">4. Run Tests</h4>
                <p>Run Health Check first, then login and run Protected Route to confirm frontend–backend communication.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

