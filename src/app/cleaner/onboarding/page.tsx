'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const steps = [
    { number: 1, title: 'Welcome', icon: '👋' },
    { number: 2, title: 'Profile', icon: '👤' },
    { number: 3, title: 'Services', icon: '🧹' },
    { number: 4, title: 'Availability', icon: '📅' },
    { number: 5, title: 'Complete', icon: '✨' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {steps.map((s) => (
                <div
                  key={s.number}
                  className={`flex flex-col items-center ${
                    s.number <= step ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 ${
                      s.number <= step ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {s.icon}
                  </div>
                  <span className="text-xs font-medium">{s.title}</span>
                </div>
              ))}
            </div>
            <Progress value={(step / totalSteps) * 100} />
          </div>

          <Card>
            <CardContent className="p-8">
              {step === 1 && (
                <div className="text-center">
                  <span className="text-6xl mb-6 block">🎉</span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to PureTask!</h2>
                  <p className="text-gray-600 mb-8">
                    Let's get you set up in just 5 quick steps. You'll be accepting bookings in no time!
                  </p>
                  <Button variant="primary" size="lg" onClick={() => setStep(2)}>
                    Get Started →
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about yourself</h2>
                  <div className="space-y-4">
                    <Input label="Full Name" placeholder="Jane Doe" />
                    <Input label="Phone Number" type="tel" placeholder="(555) 123-4567" />
                    <Input label="City" placeholder="New York" />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Tell clients about your experience..."
                      />
                    </div>
                    <div className="flex gap-3 mt-6">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        ← Back
                      </Button>
                      <Button variant="primary" className="flex-1" onClick={() => setStep(3)}>
                        Continue →
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">What services do you offer?</h2>
                  <div className="space-y-3 mb-6">
                    {['Standard Cleaning', 'Deep Cleaning', 'Move In/Out', 'Office Cleaning', 'Window Cleaning'].map(
                      (service) => (
                        <label key={service} className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input type="checkbox" className="rounded" />
                          <span className="text-gray-900">{service}</span>
                        </label>
                      )
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      ← Back
                    </Button>
                    <Button variant="primary" className="flex-1" onClick={() => setStep(4)}>
                      Continue →
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Set your availability</h2>
                  <div className="space-y-3 mb-6">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center gap-4">
                        <input type="checkbox" className="rounded" defaultChecked={day !== 'Sunday'} />
                        <span className="w-24 text-gray-900">{day}</span>
                        <Input type="time" defaultValue="09:00" className="flex-1" />
                        <span className="text-gray-600">to</span>
                        <Input type="time" defaultValue="17:00" className="flex-1" />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(3)}>
                      ← Back
                    </Button>
                    <Button variant="primary" className="flex-1" onClick={() => setStep(5)}>
                      Continue →
                    </Button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="text-center">
                  <span className="text-6xl mb-6 block">🎊</span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">You're all set!</h2>
                  <p className="text-gray-600 mb-8">
                    Your profile is complete and ready to accept bookings. Start your cleaning journey today!
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => (window.location.href = '/cleaner/dashboard')}
                  >
                    Go to Dashboard →
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

