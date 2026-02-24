'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';

const AmbientHeroScene3D = dynamic(
  () => import('@/components/hero/AmbientHeroScene3D'),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 -z-10 bg-[#0B0E14] animate-pulse" aria-hidden="true" />
    ),
  }
);

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-[#0B0E14] p-10 md:p-14 min-h-[420px] flex items-center"
      aria-label="Hero"
    >
      <AmbientHeroScene3D />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/10 rounded-3xl" />

      <div className="relative z-10 max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="text-4xl md:text-5xl font-semibold tracking-tight text-white"
        >
          Home tasks, orchestrated by intelligence.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
          className="mt-4 text-base md:text-lg text-white/80"
        >
          Book reliable pros with transparent trust signals, live presence, and a
          credit ledger that keeps everyone aligned.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
          className="mt-7 flex flex-col sm:flex-row gap-3"
        >
          <Link
            href="/search"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black hover:bg-white/90 text-center transition-colors"
          >
            Get started
          </Link>
          <Link
            href="/#how-it-works"
            className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-medium text-white hover:bg-white/5 text-center transition-colors"
          >
            See how reliability works
          </Link>
        </motion.div>

        <div className="mt-8 flex items-center gap-3 text-xs text-white/65">
          <span className="inline-flex h-2 w-2 rounded-full bg-[#22C55E]" />
          Calm surfaces • Living depth • Trust-fintech UX
        </div>
      </div>
    </section>
  );
}
