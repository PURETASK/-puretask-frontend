'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { HelpCircle, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

const CATEGORY_META: Record<string, { title: string }> = {
  'getting-started': { title: 'Getting Started' },
  bookings: { title: 'Bookings & Services' },
  payments: { title: 'Payments & Billing' },
  account: { title: 'Account & Security' },
  cleaners: { title: 'For Cleaners' },
  support: { title: 'Customer Support' },
};

const FAQS_BY_CATEGORY: Record<string, { question: string; answer: string }[]> = {
  'getting-started': [
    {
      question: 'How do I create an account?',
      answer:
        'Click on "Sign Up" in the top right corner. Choose whether you\'re a client or cleaner, fill in your details, and verify your email. It only takes a minute!',
    },
  ],
  bookings: [
    {
      question: 'How do I book a cleaning service?',
      answer:
        'Go to the Search page, browse available cleaners, select one you like, click "Book Now", and follow the 4-step booking process. You\'ll choose your service type, date/time, enter your address, and confirm.',
    },
    {
      question: 'Can I cancel or reschedule a booking?',
      answer:
        'Yes! You can cancel or reschedule up to 24 hours before your scheduled service time. Go to My Bookings, select the booking, and choose "Cancel" or "Reschedule". Cancellations within 24 hours may incur a fee.',
    },
  ],
  payments: [
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and digital wallets through our secure payment processor Stripe.',
    },
    {
      question: 'When will I be charged?',
      answer:
        'Your payment method is authorized when you book, but you\'re only charged after the cleaning service is completed. If you cancel before the service, you won\'t be charged (subject to cancellation policy).',
    },
  ],
  account: [
    {
      question: 'How do I reset my password?',
      answer:
        'Click "Forgot Password" on the login page, enter your email, and we\'ll send you a reset link. Follow the link to create a new password.',
    },
    {
      question: 'Is my personal information secure?',
      answer:
        'Absolutely! We use industry-standard encryption (SSL/TLS) to protect your data. We never share your personal information with third parties without your consent. Read our Privacy Policy for more details.',
    },
  ],
  cleaners: [
    {
      question: 'How do I become a cleaner on PureTask?',
      answer:
        'Sign up as a cleaner, complete your profile with experience and certifications, submit verification documents, and wait for approval. Once approved, you can start accepting bookings!',
    },
    {
      question: 'How much does PureTask charge cleaners?',
      answer:
        'We take a 15% platform fee from each completed booking. This covers payment processing, insurance, customer support, and platform maintenance.',
    },
  ],
  support: [
    {
      question: 'How do I contact customer support?',
      answer:
        'You can reach us via email at support@puretask.com, call us at 1-800-PURETASK, or use the live chat feature in your dashboard. We typically respond within 24 hours.',
    },
  ],
};

export default function HelpCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = (params.categoryId as string) ?? '';
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const meta = CATEGORY_META[categoryId];
  const faqs = FAQS_BY_CATEGORY[categoryId] ?? [];

  if (!meta) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 py-12 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
            <p className="text-gray-600 mb-6">This help category doesn&apos;t exist.</p>
            <Button variant="primary" onClick={() => router.push('/help')}>
              Back to Help Center
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/help"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Help Center
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{meta.title}</h1>
          <p className="text-gray-600 mb-8">
            {faqs.length} article{faqs.length !== 1 ? 's' : ''} in this category
          </p>

          {faqs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-600">
                No articles in this category yet. Check back later or{' '}
                <Link href="/help" className="text-blue-600 hover:underline">
                  browse all help
                </Link>
                .
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y border-gray-200">
                  {faqs.map((faq, idx) => {
                    const id = `faq-${categoryId}-${idx}`;
                    const isOpen = expandedId === id;
                    return (
                      <div key={id} className="overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isOpen ? null : id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3 flex-1 pr-4">
                            <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                            <span className="font-medium text-gray-900">{faq.question}</span>
                          </div>
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-0 pl-12 bg-gray-50">
                            <p className="text-gray-700">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
