'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
                <p className="text-gray-600">Last updated: January 10, 2026</p>
              </div>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed">
                  At PureTask, we take your privacy seriously. This Privacy Policy explains how
                  we collect, use, disclose, and safeguard your information when you use our
                  Platform. Please read this policy carefully.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Information We Collect
                </h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                  Personal Information
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Name, email address, phone number</li>
                  <li>Physical address</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Profile picture and bio</li>
                  <li>Government-issued ID for cleaner verification</li>
                  <li>Background check information (for cleaners)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                  Usage Information
                </h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Booking history and preferences</li>
                  <li>Messages and communications on the Platform</li>
                  <li>Reviews and ratings you provide or receive</li>
                  <li>Search queries and filters</li>
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Location data (with your permission)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. How We Use Your Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">We use your information to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process bookings and payments</li>
                  <li>Facilitate communication between clients and cleaners</li>
                  <li>Send booking confirmations and updates</li>
                  <li>Verify cleaner identities and conduct background checks</li>
                  <li>Prevent fraud and enhance security</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Analyze usage patterns to improve the Platform</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce our Terms of Service</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Information Sharing and Disclosure
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may share your information in the following circumstances:
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                  With Other Users
                </h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>
                    When you book a service, we share your contact information and address with
                    the cleaner
                  </li>
                  <li>Cleaners' profiles are visible to clients searching for services</li>
                  <li>Reviews and ratings are publicly visible</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
                  With Service Providers
                </h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Payment processors (Stripe) for transaction processing</li>
                  <li>Background check providers for cleaner verification</li>
                  <li>Email and communication services</li>
                  <li>Analytics and hosting providers</li>
                  <li>Customer support tools</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Legal Reasons</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>To comply with legal obligations or court orders</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>To investigate fraud or security issues</li>
                  <li>With law enforcement when required by law</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement appropriate technical and organizational security measures to
                  protect your information, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
                  <li>SSL/TLS encryption for data in transit</li>
                  <li>Encrypted storage for sensitive data</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Employee training on data protection</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  However, no method of transmission over the internet is 100% secure. We cannot
                  guarantee absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>
                    <strong>Access:</strong> Request a copy of your personal data
                  </li>
                  <li>
                    <strong>Correction:</strong> Update or correct inaccurate information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your account and data
                  </li>
                  <li>
                    <strong>Portability:</strong> Receive your data in a structured format
                  </li>
                  <li>
                    <strong>Opt-out:</strong> Unsubscribe from marketing communications
                  </li>
                  <li>
                    <strong>Object:</strong> Object to certain data processing activities
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  To exercise these rights, contact us at privacy@puretask.com
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed">
                  We retain your information for as long as necessary to provide our services and
                  comply with legal obligations. Specifically:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
                  <li>Account information: Until you delete your account, plus 30 days</li>
                  <li>Booking records: 7 years for tax and legal compliance</li>
                  <li>Messages: 2 years after the last message</li>
                  <li>Reviews: Indefinitely (unless flagged and removed)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies and Tracking</h2>
                <p className="text-gray-700 leading-relaxed mb-4">We use cookies and similar tracking technologies to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze site traffic and usage patterns</li>
                  <li>Personalize content and advertisements</li>
                  <li>Improve Platform performance</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  You can control cookies through your browser settings. Note that disabling
                  cookies may affect Platform functionality.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  PureTask is not intended for users under 18 years of age. We do not knowingly
                  collect information from children. If you believe we have collected information
                  from a child, please contact us immediately.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  10. International Data Transfers
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Your information may be transferred to and processed in countries other than
                  your own. We ensure appropriate safeguards are in place for international
                  transfers in compliance with applicable laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  11. Changes to This Policy
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of
                  significant changes via email or Platform notification. Please review this
                  policy periodically.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have questions or concerns about this Privacy Policy, contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> privacy@puretask.com
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
