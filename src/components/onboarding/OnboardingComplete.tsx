// src/components/onboarding/OnboardingComplete.tsx
// Success state after onboarding completion

'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export function OnboardingComplete() {
  const router = useRouter();

  return (
    <div className="text-center space-y-6">
      <div className="text-6xl mb-6">🎊</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">You're all set!</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Your profile is complete and activated! You can now receive job offers from clients.
        Start your cleaning journey today!
      </p>

      <div className="space-y-4">
        <Button
          variant="primary"
          size="lg"
          onClick={() => router.push('/cleaner/dashboard')}
        >
          Go to Dashboard →
        </Button>
        <div>
          <Button
            variant="outline"
            onClick={() => router.push('/cleaner/profile')}
          >
            View My Profile
          </Button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
        <div className="text-sm text-blue-900">
          <strong>Next steps:</strong>
          <ul className="mt-2 list-disc list-inside space-y-1 text-left">
            <li>Complete your Stripe Connect setup to receive payouts</li>
            <li>Set up your payment preferences</li>
            <li>Browse available jobs in your service areas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
