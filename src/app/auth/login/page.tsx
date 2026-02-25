'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { API_CONFIG } from '@/lib/config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LottieSuccess } from '@/components/ui/LottieSuccess';
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
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  usePageTitle('Sign In');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const path = role === 'admin' ? '/admin' : role === 'cleaner' ? '/cleaner/dashboard' : '/client/dashboard';
      setShowSuccessAnimation(true);
      setTimeout(() => router.push(path), SUCCESS_ANIMATION_DURATION_MS);
    } catch {
      // Error already shown via toast in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_CONFIG.baseURL}/auth/oauth/google/start`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 relative">
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="text-4xl font-bold text-blue-600">PureTask</div>
          </div>
          <CardTitle className="text-center text-2xl">Welcome Back</CardTitle>
          <p className="text-center text-gray-600 mt-2">
            Sign in to your account to continue
          </p>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
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
                className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={0}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded"
                  disabled={isLoading}
                />
                <span className="text-gray-700">Remember me</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
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

          <div className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

