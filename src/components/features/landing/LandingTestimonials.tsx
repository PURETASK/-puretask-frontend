'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ScrollRevealItem } from '@/components/motion/ScrollRevealSection';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    rating: 5,
    text: 'Amazing service! Jane was professional and thorough. My apartment has never looked better!',
    avatar: 'S',
  },
  {
    name: 'Mike Chen',
    rating: 5,
    text: 'Super easy to book and the cleaner arrived on time. Will definitely use again!',
    avatar: 'M',
  },
  {
    name: 'Emily Davis',
    rating: 5,
    text: "The best cleaning service I've used. Reliable, affordable, and excellent quality.",
    avatar: 'E',
  },
];

export function LandingTestimonials() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white" role="region" aria-label="Reviews">
      <div className="section-wrap">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 mt-2">Real reviews from real customers</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, idx) => (
            <ScrollRevealItem key={t.name} index={idx} staggerDelay={0.08}>
              <motion.article
                className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm card-interactive h-full flex flex-col"
                whileHover={{ y: -4 }}
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-gray-100" aria-hidden />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" aria-hidden />
                  ))}
                </div>
                <p className="text-gray-700 flex-1 italic">"{t.text}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ background: 'linear-gradient(135deg, var(--brand-blue), var(--brand-aqua))' }}
                  >
                    {t.avatar}
                  </div>
                  <span className="font-semibold text-gray-900">{t.name}</span>
                </div>
              </motion.article>
            </ScrollRevealItem>
          ))}
        </div>
      </div>
    </section>
  );
}
