import React from 'react';
import HeroSection from '@/components/hero/HeroSection';
import { HowItWorks } from '@/components/features/landing/HowItWorks';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ScrollRevealSection } from '@/components/motion/ScrollRevealSection';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 md:px-6 py-6 md:py-10">
        <HeroSection />
        <ScrollRevealSection delay={0.1} y={32}>
          <HowItWorks />
        </ScrollRevealSection>
        {/* Trust Badges Section */}
        <ScrollRevealSection delay={0.15} y={24}>
        <section className="py-12 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">🛡️</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Insured</h3>
                <p className="text-gray-600">All cleaners carry liability insurance</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Background Checked</h3>
                <p className="text-gray-600">Every cleaner is thoroughly vetted</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">⭐</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Verified Reviews</h3>
                <p className="text-gray-600">Real reviews from real clients</p>
              </div>
            </div>
          </div>
        </section>
        </ScrollRevealSection>
        {/* Testimonials Section */}
        <ScrollRevealSection delay={0.1} y={28}>
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              What Our Clients Say
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah Johnson',
                  rating: 5,
                  text: 'Amazing service! Jane was professional and thorough. My apartment has never looked better!',
                  avatar: '👩',
                },
                {
                  name: 'Mike Chen',
                  rating: 5,
                  text: 'Super easy to book and the cleaner arrived on time. Will definitely use again!',
                  avatar: '👨',
                },
                {
                  name: 'Emily Davis',
                  rating: 5,
                  text: 'The best cleaning service I\'ve used. Reliable, affordable, and excellent quality.',
                  avatar: '👩‍💼',
                },
              ].map((testimonial, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex mb-3">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">⭐</span>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{testimonial.avatar}</div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        </ScrollRevealSection>
        {/* CTA Section */}
        <ScrollRevealSection delay={0.1} y={24}>
        <section className="py-16 px-6 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of happy customers today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" asChild>
                <Link href="/search">Find Cleaners</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="/auth/register">Become a Cleaner</Link>
              </Button>
            </div>
          </div>
        </section>
        </ScrollRevealSection>
      </main>
      <Footer />
    </div>
  );
}
