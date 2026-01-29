import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Book a Professional Cleaner
          <br />
          <span className="text-blue-200">In Minutes</span>
        </h1>
        <p className="text-xl text-blue-100 mb-8">
          Trusted, verified cleaners at your doorstep. No hassle, just sparkle.
        </p>
        <div className="bg-white rounded-lg shadow-2xl p-6 max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="Enter ZIP code"
              className="flex-1"
            />
            <Button variant="primary" size="lg" className="md:w-auto">
              Find Cleaners
            </Button>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-blue-100">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-yellow-400">⭐</span>
            ))}
          </div>
          <span className="font-semibold">Rated 4.9/5</span>
          <span>✓</span>
          <span>1,000+ bookings completed</span>
        </div>
      </div>
    </section>
  );
}
