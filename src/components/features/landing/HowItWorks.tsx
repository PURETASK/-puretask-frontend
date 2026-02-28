'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Search, CalendarCheck, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ScrollRevealItem } from '@/components/motion/ScrollRevealSection';

const steps = [
  {
    number: '1',
    title: 'Search',
    description: 'Enter your ZIP code and browse verified cleaners in your area',
    icon: Search,
  },
  {
    number: '2',
    title: 'Book',
    description: 'Choose a cleaner, pick a time, and book in just a few clicks',
    icon: CalendarCheck,
  },
  {
    number: '3',
    title: 'Relax',
    description: 'Your cleaner arrives on time and transforms your space',
    icon: Sparkles,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="rounded-2xl bg-white p-8 md:p-12 shadow-sm border border-gray-100">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          How it works
        </h2>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          Get a sparkling clean home in three simple steps
        </p>
        <div
          className="mt-4 h-1 w-14 rounded-full mx-auto"
          style={{ background: 'linear-gradient(90deg, var(--brand-blue), var(--brand-aqua))' }}
          aria-hidden
        />
      </div>
      <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
        {/* Connecting line on desktop */}
        <div
          className="hidden md:block absolute top-16 left-[16.666%] right-[16.666%] h-0.5 bg-gradient-to-r from-transparent via-[var(--brand-blue)]/30 to-transparent"
          aria-hidden
        />
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <ScrollRevealItem key={step.number} index={idx} staggerDelay={0.1}>
              <motion.div
                className="relative h-full"
                whileHover={{ y: -4 }}
              >
                <Card className="h-full border-2 border-gray-100 overflow-hidden card-interactive transition-colors hover:border-[var(--brand-blue)]/30">
                  <CardContent className="p-6 md:p-8 flex flex-col items-center text-center">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-white shadow-md"
                      style={{ background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-aqua))' }}
                    >
                      <Icon className="w-7 h-7" aria-hidden />
                    </div>
                    <span
                      className="text-sm font-bold tracking-wide mb-2"
                      style={{ color: 'var(--brand-blue)' }}
                    >
                      Step {step.number}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm flex-1">{step.description}</p>
                    {idx < steps.length - 1 && (
                      <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-[var(--brand-blue)]/50">
                        <ArrowRight className="w-5 h-5" aria-hidden />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollRevealItem>
          );
        })}
      </div>
    </section>
  );
}
