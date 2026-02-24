'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useToast } from '@/contexts/ToastContext';
import { authService } from '@/services/auth.service';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      showToast('Invalid or missing reset link. Request a new one from the forgot password page.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast("Passwords don't match", 'error');
      return;
    }
    if (password.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await authService.resetPassword(token, password);
      setIsSuccess(true);
      showToast('Password updated! You can sign in now.', 'success');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (error: unknown) {
      showToast(error instanceof Error ? error.message : 'Failed to reset password. Link may have expired.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="text-6xl">✅</div>
          </div>
          <CardTitle className="text-center text-2xl">Password Updated</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-700 mb-6">
            Your password has been reset. Redirecting you to sign in...
          </p>
          <Button variant="primary" className="w-full" onClick={() => router.push('/auth/login')}>
            Go to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">Invalid Reset Link</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">
            This link is invalid or has expired. Please request a new password reset link.
          </p>
          <Button variant="primary" className="w-full" asChild>
            <Link href="/auth/forgot-password">Request New Link</Link>
          </Button>
          <div className="mt-4 text-center">
            <Link href="/auth/login" className="text-sm text-blue-600 hover:text-blue-700">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="text-4xl font-bold text-blue-600">PureTask</div>
        </div>
        <CardTitle className="text-center text-2xl">Set New Password</CardTitle>
        <p className="text-center text-gray-600 mt-2">
          Enter your new password below. Use at least 8 characters.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            disabled={isLoading}
          />
          <Input
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            size="lg"
            isLoading={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <Suspense fallback={<div className="text-gray-600">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
