import React from 'react';
import HeroSection from '@/components/hero/HeroSection';
import { HowItWorks } from '@/components/features/landing/HowItWorks';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LandingTrustSection } from '@/components/features/landing/LandingTrustSection';
import { LandingTestimonials } from '@/components/features/landing/LandingTestimonials';
import { LandingCTA } from '@/components/features/landing/LandingCTA';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--brand-cloud)]">
      <Header />
      <main className="flex-1">
        <section className="px-4 md:px-6 py-8 md:py-12">
          <div className="section-wrap">
            <HeroSection />
          </div>
        </section>

        <section className="py-4 md:py-6">
          <div className="section-wrap">
            <HowItWorks />
          </div>
        </section>

        <LandingTrustSection />

        <LandingTestimonials />

        <section className="px-4 md:px-6 py-8 md:py-12">
          <div className="section-wrap">
            <LandingCTA />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
