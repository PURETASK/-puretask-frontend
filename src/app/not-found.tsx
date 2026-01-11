'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-lg text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
            <div className="text-6xl mb-4">🧹</div>
          </div>

          {/* Content */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Oops! Looks like this page got swept away. The page you're looking for doesn't
            exist or has been moved.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => (window.location.href = '/')}
            >
              <Home className="h-5 w-5 mr-2" />
              Go Home
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => (window.location.href = '/search')}
            >
              <Search className="h-5 w-5 mr-2" />
              Find Cleaners
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">Looking for something specific?</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <a href="/help" className="text-blue-600 hover:underline">
                Help Center
              </a>
              <span className="text-gray-300">•</span>
              <a href="/client/dashboard" className="text-blue-600 hover:underline">
                My Dashboard
              </a>
              <span className="text-gray-300">•</span>
              <a href="/client/bookings" className="text-blue-600 hover:underline">
                My Bookings
              </a>
              <span className="text-gray-300">•</span>
              <a href="/messages" className="text-blue-600 hover:underline">
                Messages
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

