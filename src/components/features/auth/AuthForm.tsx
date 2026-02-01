'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function AuthForm() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [userType, setUserType] = useState<'client' | 'cleaner'>('client');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-6">
            <div className="text-3xl font-bold text-blue-600">PureTask</div>
          </div>
          
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                mode === 'login'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                mode === 'signup'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {mode === 'signup' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a:
              </label>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="userType"
                    value="client"
                    checked={userType === 'client'}
                    onChange={(e) => setUserType(e.target.value as 'client' | 'cleaner')}
                    className="sr-only"
                  />
                  <div
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      userType === 'client'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-1">👤</div>
                    <div className="font-medium">Client</div>
                    <div className="text-xs text-gray-600">Book cleaning</div>
                  </div>
                </label>
                
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="userType"
                    value="cleaner"
                    checked={userType === 'cleaner'}
                    onChange={(e) => setUserType(e.target.value as 'client' | 'cleaner')}
                    className="sr-only"
                  />
                  <div
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      userType === 'cleaner'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-1">🧹</div>
                    <div className="font-medium">Cleaner</div>
                    <div className="text-xs text-gray-600">Offer services</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          <form className="space-y-4">
            {mode === 'signup' && (
              <>
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="(555) 123-4567"
                  required
                />
              </>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
            />

            {mode === 'login' && (
              <div className="text-right">
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </a>
              </div>
            )}

            {mode === 'signup' && (
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1"
                  required
                />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="/terms" className="text-blue-600 hover:text-blue-700">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-blue-600 hover:text-blue-700">
                    Privacy Policy
                  </a>
                </span>
              </label>
            )}

            <Button type="submit" variant="primary" className="w-full" size="lg">
              {mode === 'login' ? 'Log In' : 'Sign Up'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" size="lg">
            <span className="mr-2">🔍</span>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
