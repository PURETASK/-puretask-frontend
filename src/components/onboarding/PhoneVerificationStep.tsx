// src/components/onboarding/PhoneVerificationStep.tsx
// Step 3: Phone Verification

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface PhoneVerificationStepProps {
  onNext: () => void;
  onBack?: () => void;
  onSendOTP: (phone: string) => Promise<void>;
  onVerifyOTP: (phone: string, code: string) => Promise<void>;
  isLoading?: boolean;
  sendOTPLoading?: boolean;
  verifyOTPLoading?: boolean;
  error?: Error | null;
}

export function PhoneVerificationStep({
  onNext,
  onBack,
  onSendOTP,
  onVerifyOTP,
  isLoading,
  sendOTPLoading,
  verifyOTPLoading,
  error,
}: PhoneVerificationStepProps) {
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Format phone number to E.164 format
  const formatPhone = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // If starts with 1, assume US and add +
    if (digits.length === 11 && digits[0] === '1') {
      return `+${digits}`;
    }
    // If 10 digits, assume US and add +1
    if (digits.length === 10) {
      return `+1${digits}`;
    }
    // Otherwise, add + if not present
    if (digits.length > 0 && !value.startsWith('+')) {
      return `+${digits}`;
    }
    return value;
  };

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPhone = formatPhone(phone);
    
    if (!formattedPhone.match(/^\+[1-9]\d{1,14}$/)) {
      return;
    }

    try {
      await onSendOTP(formattedPhone);
      setOtpSent(true);
      setCountdown(60); // 60 second cooldown
    } catch (err) {
      // Error handled by parent
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPhone = formatPhone(phone);
    
    if (otpCode.length !== 6) {
      return;
    }

    try {
      await onVerifyOTP(formattedPhone, otpCode);
      onNext();
    } catch (err) {
      // Error handled by parent
    }
  };

  const handleResend = async () => {
    const formattedPhone = formatPhone(phone);
    await onSendOTP(formattedPhone);
    setCountdown(60);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your phone number</h2>
        <p className="text-gray-600">
          We'll send a verification code via SMS to confirm your phone number.
        </p>
      </div>

      {!otpSent ? (
        <form onSubmit={handleSendOTP}>
          <div className="space-y-4">
            <Input
              label="Phone Number"
              fieldType="phone"
              placeholder="+1 (555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoComplete="tel"
              helperText="Enter your phone number in international format (e.g., +1234567890)"
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error.message || 'Failed to send verification code. Please try again.'}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {onBack && (
                <Button type="button" variant="outline" onClick={onBack} disabled={sendOTPLoading}>
                  ← Back
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={!phone || sendOTPLoading}
              >
                {sendOTPLoading ? 'Sending...' : 'Send Verification Code →'}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP}>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-900">
                <strong>Code sent!</strong> We've sent a 6-digit code to {phone.replace(/(\+\d{1,2})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4')}
              </div>
            </div>

            <Input
              label="Verification Code"
              fieldType="text"
              placeholder="123456"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              autoComplete="one-time-code"
              helperText="Enter the 6-digit code from your SMS"
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error.message || 'Invalid verification code. Please try again.'}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {onBack && (
                <Button type="button" variant="outline" onClick={onBack} disabled={verifyOTPLoading}>
                  ← Back
                </Button>
              )}
              <div className="flex-1 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  disabled={countdown > 0 || sendOTPLoading}
                  className="flex-shrink-0"
                >
                  {countdown > 0 ? `Resend (${countdown}s)` : 'Resend Code'}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={otpCode.length !== 6 || verifyOTPLoading}
                >
                  {verifyOTPLoading ? 'Verifying...' : 'Verify Code →'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
