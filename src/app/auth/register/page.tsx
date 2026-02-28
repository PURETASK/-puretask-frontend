'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthShell } from '@/components/auth/AuthShell';
import Link from 'next/link';
import { Eye, EyeOff, Home, Sparkles } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

type UserRole = 'client' | 'cleaner';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const roleParam = searchParams.get('role');
  const [userType, setUserType] = useState<UserRole>(
    roleParam === 'cleaner' ? 'cleaner' : 'client'
  );
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  usePageTitle('Sign Up');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const userData = await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone,
        role: userType,
      });

      if (userData?.role === 'admin') {
        router.push('/admin');
      } else if (userData?.role === 'cleaner') {
        router.push('/cleaner');
      } else if (userData?.role === 'client') {
        router.push('/client');
      } else {
        router.push('/client');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setFormError(message);
      if (process.env.NODE_ENV === 'development') {
        console.error('Registration error', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join PureTask — book or offer cleaning with protected payments"
      switchAction={{ label: 'Already have an account? Sign in', href: '/auth/login' }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
          <div className="grid grid-cols-2 gap-3">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="userType"
                value="client"
                checked={userType === 'client'}
                onChange={(e) => { setFormError(null); setUserType(e.target.value as UserRole); }}
                className="sr-only"
                disabled={isLoading}
              />
              <div
                className={`p-4 rounded-xl border-2 text-center transition-all card-interactive ${
                  userType === 'client'
                    ? 'border-[var(--brand-blue)] bg-[var(--brand-cloud)]'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                }`}
              >
                <Home className={`h-8 w-8 mx-auto mb-2 ${userType === 'client' ? 'text-[var(--brand-blue)]' : 'text-gray-500'}`} />
                <div className="font-semibold text-gray-900">Client</div>
                <div className="text-xs text-gray-600 mt-0.5">Book cleaning</div>
              </div>
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="userType"
                value="cleaner"
                checked={userType === 'cleaner'}
                onChange={(e) => { setFormError(null); setUserType(e.target.value as UserRole); }}
                className="sr-only"
                disabled={isLoading}
              />
              <div
                className={`p-4 rounded-xl border-2 text-center transition-all card-interactive ${
                  userType === 'cleaner'
                    ? 'border-[var(--brand-blue)] bg-[var(--brand-cloud)]'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                }`}
              >
                <Sparkles className={`h-8 w-8 mx-auto mb-2 ${userType === 'cleaner' ? 'text-[var(--brand-blue)]' : 'text-gray-500'}`} />
                <div className="font-semibold text-gray-900">Cleaner</div>
                <div className="text-xs text-gray-600 mt-0.5">Offer services</div>
              </div>
            </label>
          </div>
        </div>

        <Input
          label="Full name"
          type="text"
          inputMode="text"
          autoComplete="name"
          name="full_name"
          placeholder="John Doe"
          value={formData.full_name}
          onChange={handleChange}
          required
          disabled={isLoading}
        />

        <Input
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
        />

        <Input
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          name="phone"
          placeholder="(555) 123-4567"
          value={formData.phone}
          onChange={handleChange}
          required
          disabled={isLoading}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] rounded p-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm password"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((p) => !p)}
            className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] rounded p-1"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" className="mt-1 rounded" required disabled={isLoading} />
          <span className="text-sm text-gray-600">
            I agree to the{' '}
            <Link href="/terms" className="font-medium" style={{ color: 'var(--brand-blue)' }}>Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="font-medium" style={{ color: 'var(--brand-blue)' }}>Privacy Policy</Link>
          </span>
        </label>

        {formError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {formError}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          size="lg"
          isLoading={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">or</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        size="lg"
        disabled={isLoading}
        onClick={() => alert('Google OAuth coming soon!')}
      >
        <span className="mr-2">🔐</span>
        Continue with Google
      </Button>
    </AuthShell>
  );
}
