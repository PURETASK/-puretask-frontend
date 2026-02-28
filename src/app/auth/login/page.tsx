'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { API_CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LottieSuccess } from '@/components/ui/LottieSuccess';
import { AuthShell } from '@/components/auth/AuthShell';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

const SUCCESS_ANIMATION_DURATION_MS = 2500;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required';
  if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email address';
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  return null;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  usePageTitle('Sign In');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    if (emailError || passwordError) {
      setErrors({ email: emailError ?? undefined, password: passwordError ?? undefined });
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      const userData = await login(formData);
      if (!userData?.role) {
        router.push('/dashboard');
        return;
      }
      const role = userData.role;
      const path = role === 'admin' ? '/admin' : role === 'cleaner' ? '/cleaner' : '/client';
      setShowSuccessAnimation(true);
      setTimeout(() => router.push(path), SUCCESS_ANIMATION_DURATION_MS);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed. Please try again.';
      setFormError(message);
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

  const handleGoogleLogin = () => {
    window.location.href = `${API_CONFIG.baseURL}/auth/oauth/google/start`;
  };

  return (
    <>
      {showSuccessAnimation && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm animate-fade-in"
          aria-live="polite"
          aria-label="Sign in successful"
        >
          <LottieSuccess width={300} height={300} autoplay loop />
          <p className="mt-4 text-lg font-medium text-gray-700">Welcome back!</p>
        </div>
      )}
      <AuthShell
        title="Welcome back"
        subtitle="Sign in to your account to continue"
        switchAction={{ label: 'Create an account', href: '/auth/register' }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => { handleChange(e); setErrors((prev) => ({ ...prev, email: undefined })); }}
            error={errors.email}
            required
            disabled={isLoading}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => { handleChange(e); setErrors((prev) => ({ ...prev, password: undefined })); }}
              error={errors.password}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] rounded p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded" disabled={isLoading} />
              <span className="text-gray-700">Remember me</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="font-medium transition-colors hover:opacity-90"
              style={{ color: 'var(--brand-blue)' }}
            >
              Forgot password?
            </Link>
          </div>

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
            {isLoading ? 'Signing in...' : 'Sign in'}
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
          onClick={handleGoogleLogin}
        >
          <span className="mr-2">🔐</span>
          Continue with Google
        </Button>
      </AuthShell>
    </>
  );
}
