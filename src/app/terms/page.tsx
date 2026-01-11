'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Terms of Service
                </h1>
                <p className="text-gray-600">Last updated: January 10, 2026</p>
              </div>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using PureTask ("the Platform"), you accept and agree to be
                  bound by the terms and provision of this agreement. If you do not agree to
                  these Terms of Service, please do not use the Platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Description of Service
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  PureTask is an online marketplace that connects clients seeking cleaning
                  services with independent cleaning professionals ("Cleaners"). The Platform
                  facilitates:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Discovery and booking of cleaning services</li>
                  <li>Secure payment processing</li>
                  <li>Communication between clients and cleaners</li>
                  <li>Review and rating systems</li>
                  <li>Dispute resolution assistance</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. User Accounts
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To use certain features of the Platform, you must create an account. You agree
                  to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain the security of your password</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Be responsible for all activities under your account</li>
                  <li>Not share your account with others</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Booking and Payments
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>For Clients:</strong>
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>
                    You agree to pay the agreed-upon price for completed cleaning services
                  </li>
                  <li>Payment is processed through our secure payment provider (Stripe)</li>
                  <li>You will be charged only after service completion</li>
                  <li>Cancellations within 24 hours may incur a cancellation fee</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>For Cleaners:</strong>
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>PureTask charges a 15% platform fee on completed bookings</li>
                  <li>Payments are processed within 3-5 business days after completion</li>
                  <li>You must provide accurate banking information for payouts</li>
                  <li>You are responsible for your own taxes and insurance</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Cancellation and Refund Policy
                </h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    Cancellations more than 24 hours before service: Full refund
                  </li>
                  <li>
                    Cancellations within 24 hours: 50% cancellation fee may apply
                  </li>
                  <li>No-shows or same-day cancellations: No refund</li>
                  <li>
                    Disputes about service quality must be reported within 24 hours of
                    completion
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. User Conduct
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">You agree NOT to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Violate any laws or regulations</li>
                  <li>Harass, abuse, or harm others</li>
                  <li>Post false, misleading, or fraudulent content</li>
                  <li>Impersonate others or misrepresent your identity</li>
                  <li>Attempt to circumvent the Platform's payment system</li>
                  <li>Use the Platform for any illegal purposes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Background Checks and Verification
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  While we conduct background checks on Cleaners, PureTask does not guarantee
                  the accuracy or completeness of these checks. Clients are encouraged to
                  exercise their own judgment when booking services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Limitation of Liability
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  PureTask is a marketplace platform and is not responsible for the actual
                  cleaning services provided. We are not liable for any damages, injuries, or
                  losses arising from services booked through the Platform. Our total liability
                  is limited to the amount of fees paid for the specific booking in question.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Intellectual Property
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  All content on the Platform, including text, graphics, logos, and software, is
                  the property of PureTask and protected by copyright and trademark laws. You
                  may not use our intellectual property without written permission.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  10. Termination
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to suspend or terminate your account at any time for
                  violations of these Terms, fraudulent activity, or any other reason we deem
                  necessary. You may also delete your account at any time through your account
                  settings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  11. Changes to Terms
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We may modify these Terms at any time. We will notify users of significant
                  changes via email or Platform notification. Continued use of the Platform after
                  changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  12. Governing Law
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms are governed by the laws of the State of Delaware, United States,
                  without regard to its conflict of law provisions. Any disputes will be resolved
                  in the courts of Delaware.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have questions about these Terms, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p className="text-gray-700">
                    <strong>Email:</strong> legal@puretask.com
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong> 123 Clean Street, Suite 100, Wilmington, DE 19801
                  </p>
                  <p className="text-gray-700">
                    <strong>Phone:</strong> 1-800-PURETASK
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
