'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';

const AmbientHeroScene3D = dynamic(
  () => import('@/components/hero/AmbientHeroScene3D'),
  { ssr: false, loading: () => <div className="absolute inset-0 -z-10 bg-[#0B0E14] animate-pulse" aria-hidden="true" /> }
);

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden rounded-3xl bg-[#0B0E14] min-h-[480px] md:min-h-[520px] flex flex-col justify-center"
      aria-label="Hero"
    >
      <AmbientHeroScene3D />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent rounded-3xl" />

      <div className="relative z-10 px-8 py-12 md:px-14 md:py-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto"
        >
          <motion.h1
            variants={item}
            className="text-4xl md:text-6xl font-bold tracking-tight text-white max-w-2xl"
          >
            Home tasks, orchestrated.
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-4 text-lg md:text-xl text-white/85 max-w-xl"
          >
            Verified cleaners, clear pricing, and payment protected until you approve. Book with confidence.
          </motion.p>
          <motion.p variants={item} className="mt-8 text-sm font-medium text-white/90">
            I am a…
          </motion.p>

          <motion.div
            variants={container}
            className="mt-5 grid sm:grid-cols-2 gap-4 max-w-2xl"
          >
            <Link href="/search" className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0E14] rounded-2xl">
              <motion.div
                className="relative rounded-2xl border-2 border-white/25 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 group-hover:border-white/50 group-hover:bg-white/10"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                      <Search className="w-6 h-6 text-white" aria-hidden />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Client</h2>
                    <p className="text-sm text-white/75 mt-1">Find a cleaner, book in minutes, pay when you approve.</p>
                  </div>
                  <span className="text-white/60 group-hover:text-white transition-colors">
                    <ArrowRight className="w-5 h-5" aria-hidden />
                  </span>
                </div>
                <span className="inline-block mt-4 text-sm font-medium text-white/90 group-hover:underline">
                  Find a cleaner →
                </span>
              </motion.div>
            </Link>

            <Link href="/auth/register?role=cleaner" className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0E14] rounded-2xl">
              <motion.div
                className="relative rounded-2xl border-2 border-white/25 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 group-hover:border-white/50 group-hover:bg-white/10"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                      <Sparkles className="w-6 h-6 text-white" aria-hidden />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Cleaner</h2>
                    <p className="text-sm text-white/75 mt-1">Join our network, set your schedule, get paid reliably.</p>
                  </div>
                  <span className="text-white/60 group-hover:text-white transition-colors">
                    <ArrowRight className="w-5 h-5" aria-hidden />
                  </span>
                </div>
                <span className="inline-block mt-4 text-sm font-medium text-white/90 group-hover:underline">
                  Join & earn →
                </span>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
            >
              See how it works
            </Link>
            <span className="flex items-center gap-2 text-xs text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-mint)]" aria-hidden />
              Payment held until you approve
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
