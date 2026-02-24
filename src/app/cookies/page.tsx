'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
                <p className="text-gray-600">Last updated: February 2025</p>
              </div>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies</h2>
                <p className="text-gray-700 leading-relaxed">
                  Cookies are small text files stored on your device when you visit our website.
                  They help us provide a better experience by remembering your preferences,
                  keeping you signed in, and understanding how you use PureTask.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Types of Cookies We Use</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Essential</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Required for the site to function (e.g. authentication, security, load balancing).
                  These cannot be disabled without affecting core features.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Functional</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Remember your preferences (e.g. language, region) and improve your experience.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Analytics</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Help us understand how visitors use the platform (e.g. pages viewed, flows) so we
                  can improve our services. We may use first-party or third-party analytics
                  providers.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Marketing (if used)</h3>
                <p className="text-gray-700 leading-relaxed">
                  Used to deliver relevant ads or measure ad effectiveness. These are optional and
                  can be managed via your account or browser settings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How to Control Cookies</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You can control or delete cookies through your browser settings. Disabling
                  essential cookies may prevent you from signing in or using key features. For
                  more detail on your choices, see our{' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Updates</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Cookie Policy from time to time. The “Last updated” date at
                  the top reflects the latest version. Continued use of the site after changes
                  constitutes acceptance.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contact</h2>
                <p className="text-gray-700 leading-relaxed">
                  Questions about cookies? Contact us at privacy@puretask.com or see our{' '}
                  <Link href="/help" className="text-blue-600 hover:underline">
                    Help Center
                  </Link>
                  .
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
