'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { authService } from '@/services/auth.service';
import Link from 'next/link';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification link.');
      return;
    }
    authService
      .verifyEmail(token)
      .then(() => {
        setStatus('success');
        setMessage('Your email has been verified. You can sign in now.');
        setTimeout(() => router.push('/auth/login'), 3000);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err?.message || 'Verification failed. The link may have expired.');
      });
  }, [token, router]);

  if (status === 'loading') {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying your email...</p>
        </CardContent>
      </Card>
    );
  }

  if (status === 'error') {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="text-6xl">⚠️</div>
          </div>
          <CardTitle className="text-center text-xl">Verification Failed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">{message}</p>
          <Button variant="primary" className="w-full" asChild>
            <Link href="/auth/register">Sign Up Again</Link>
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
          <div className="text-6xl">✅</div>
        </div>
        <CardTitle className="text-center text-2xl">Email Verified</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-700 mb-6">{message}</p>
        <p className="text-center text-sm text-gray-500 mb-6">Redirecting you to sign in...</p>
        <Button variant="primary" className="w-full" onClick={() => router.push('/auth/login')}>
          Go to Login
        </Button>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <Suspense fallback={<div className="text-gray-600">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
