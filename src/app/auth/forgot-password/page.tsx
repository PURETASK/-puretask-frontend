'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useToast } from '@/contexts/ToastContext';
import { authService } from '@/services/auth.service';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.requestPasswordReset(email);
      setIsSubmitted(true);
      showToast('Password reset link sent to your email!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to send reset link', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="text-6xl">✉️</div>
            </div>
            <CardTitle className="text-center text-2xl">Check Your Email</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-center text-gray-700 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-center text-sm text-gray-600 mb-6">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsSubmitted(false)}
            >
              Send Again
            </Button>
            <div className="mt-4 text-center">
              <Link
                href="/auth/login"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="text-4xl font-bold text-blue-600">PureTask</div>
          </div>
          <CardTitle className="text-center text-2xl">Forgot Password?</CardTitle>
          <p className="text-center text-gray-600 mt-2">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

