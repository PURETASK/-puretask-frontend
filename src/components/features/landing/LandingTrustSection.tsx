'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ScrollRevealItem } from '@/components/motion/ScrollRevealSection';
import { Shield, CheckCircle2, Star } from 'lucide-react';

const items = [
  {
    icon: Shield,
    title: 'Insured',
    description: 'All cleaners carry liability insurance',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: CheckCircle2,
    title: 'Background Checked',
    description: 'Every cleaner is thoroughly vetted',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Star,
    title: 'Verified Reviews',
    description: 'Real reviews from real clients',
    gradient: 'from-violet-500 to-violet-600',
  },
];

export function LandingTrustSection() {
  return (
    <section className="py-16 md:py-20 bg-white" aria-label="Why choose PureTask">
      <div className="section-wrap">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Why Choose PureTask
          </h2>
          <p className="text-gray-600 mt-2 max-w-lg mx-auto">
            Every cleaner is vetted, insured, and reviewed by real clients.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {items.map((row, idx) => {
            const Icon = row.icon;
            return (
              <ScrollRevealItem key={row.title} index={idx} staggerDelay={0.1}>
                <motion.div
                  className="group relative rounded-2xl border-2 border-gray-100 bg-gray-50/50 p-8 text-center card-interactive focus-ring"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div
                    className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${row.gradient} items-center justify-center mb-5 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7" aria-hidden />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{row.title}</h3>
                  <p className="text-gray-600 text-sm">{row.description}</p>
                </motion.div>
              </ScrollRevealItem>
            );
          })}
        </div>
      </div>
    </section>
  );
}
