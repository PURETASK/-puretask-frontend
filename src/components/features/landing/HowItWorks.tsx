import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
export function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Search',
      description: 'Enter your ZIP code and browse verified cleaners in your area',
      icon: '🔍',
    },
    {
      number: '2',
      title: 'Book',
      description: 'Choose a cleaner, pick a time, and book in just a few clicks',
      icon: '📅',
    },
    {
      number: '3',
      title: 'Relax',
      description: 'Your cleaner arrives on time and transforms your space',
      icon: '✨',
    },
  ];
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
          How It Works
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Get a sparkling clean home in three simple steps
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <Card key={step.number} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-6xl mb-4">{step.icon}</div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {step.number}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
