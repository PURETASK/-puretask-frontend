'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export function LandingCTA() {
  return (
    <motion.section
      className="relative rounded-3xl overflow-hidden py-16 md:py-20 text-white"
      style={{ background: 'linear-gradient(135deg, var(--brand-blue) 0%, var(--brand-aqua) 100%)' }}
      initial={{ opacity: 0.95 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.15)_0%,transparent_50%)]" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,212,255,0.2)_0%,transparent_40%)]" aria-hidden />
      <div className="relative text-center max-w-2xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Ready to get started?
        </h2>
        <p className="text-lg text-white/90 mt-3 mb-10">
          Join thousands of happy customers today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-base font-semibold text-[var(--brand-blue)] shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
          >
            Find cleaners
            <ArrowRight className="w-5 h-5" aria-hidden />
          </Link>
          <Link
            href="/auth/register?role=cleaner"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/80 px-6 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-white/15 hover:scale-[1.02] active:scale-[0.98]"
          >
            Become a cleaner
          </Link>
        </div>
        <p className="mt-6 text-sm text-white/90">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold underline hover:text-white">
            Log in
          </Link>
        </p>
      </div>
    </motion.section>
  );
}
