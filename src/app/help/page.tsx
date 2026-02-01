'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Search,
  HelpCircle,
  MessageSquare,
  Book,
  CreditCard,
  Shield,
  Users,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
} from 'lucide-react';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Book,
      color: 'bg-blue-50 text-blue-600',
      articles: 12,
    },
    {
      id: 'bookings',
      title: 'Bookings & Services',
      icon: MessageSquare,
      color: 'bg-green-50 text-green-600',
      articles: 18,
    },
    {
      id: 'payments',
      title: 'Payments & Billing',
      icon: CreditCard,
      color: 'bg-purple-50 text-purple-600',
      articles: 10,
    },
    {
      id: 'account',
      title: 'Account & Security',
      icon: Shield,
      color: 'bg-yellow-50 text-yellow-600',
      articles: 8,
    },
    {
      id: 'cleaners',
      title: 'For Cleaners',
      icon: Users,
      color: 'bg-pink-50 text-pink-600',
      articles: 15,
    },
    {
      id: 'support',
      title: 'Customer Support',
      icon: HelpCircle,
      color: 'bg-red-50 text-red-600',
      articles: 6,
    },
  ];

  const faqs = [
    {
      id: 'faq-1',
      category: 'getting-started',
      question: 'How do I create an account?',
      answer:
        'Click on "Sign Up" in the top right corner. Choose whether you\'re a client or cleaner, fill in your details, and verify your email. It only takes a minute!',
    },
    {
      id: 'faq-2',
      category: 'bookings',
      question: 'How do I book a cleaning service?',
      answer:
        'Go to the Search page, browse available cleaners, select one you like, click "Book Now", and follow the 4-step booking process. You\'ll choose your service type, date/time, enter your address, and confirm.',
    },
    {
      id: 'faq-3',
      category: 'bookings',
      question: 'Can I cancel or reschedule a booking?',
      answer:
        'Yes! You can cancel or reschedule up to 24 hours before your scheduled service time. Go to My Bookings, select the booking, and choose "Cancel" or "Reschedule". Cancellations within 24 hours may incur a fee.',
    },
    {
      id: 'faq-4',
      category: 'payments',
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and digital wallets through our secure payment processor Stripe.',
    },
    {
      id: 'faq-5',
      category: 'payments',
      question: 'When will I be charged?',
      answer:
        'Your payment method is authorized when you book, but you\'re only charged after the cleaning service is completed. If you cancel before the service, you won\'t be charged (subject to cancellation policy).',
    },
    {
      id: 'faq-6',
      category: 'account',
      question: 'How do I reset my password?',
      answer:
        'Click "Forgot Password" on the login page, enter your email, and we\'ll send you a reset link. Follow the link to create a new password.',
    },
    {
      id: 'faq-7',
      category: 'account',
      question: 'Is my personal information secure?',
      answer:
        'Absolutely! We use industry-standard encryption (SSL/TLS) to protect your data. We never share your personal information with third parties without your consent. Read our Privacy Policy for more details.',
    },
    {
      id: 'faq-8',
      category: 'cleaners',
      question: 'How do I become a cleaner on PureTask?',
      answer:
        'Sign up as a cleaner, complete your profile with experience and certifications, submit verification documents, and wait for approval. Once approved, you can start accepting bookings!',
    },
    {
      id: 'faq-9',
      category: 'cleaners',
      question: 'How much does PureTask charge cleaners?',
      answer:
        'We take a 15% platform fee from each completed booking. This covers payment processing, insurance, customer support, and platform maintenance.',
    },
    {
      id: 'faq-10',
      category: 'support',
      question: 'How do I contact customer support?',
      answer:
        'You can reach us via email at support@puretask.com, call us at 1-800-PURETASK, or use the live chat feature in your dashboard. We typically respond within 24 hours.',
    },
  ];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How can we help you?
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Search our help center or browse categories below
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help articles..."
                  className="pl-12 py-4 text-lg"
                />
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() =>
                  (window.location.href = `/help/category/${category.id}`)
                }
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color} mb-4`}
                  >
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.articles} articles
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No results found. Try a different search term.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                        }
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          <span className="font-medium text-gray-900">
                            {faq.question}
                          </span>
                        </div>
                        {expandedFaq === faq.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      {expandedFaq === faq.id && (
                        <div className="px-4 pb-4 pt-2 bg-gray-50">
                          <p className="text-gray-700 pl-8">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle>Still need help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for? Our support team is here to help!
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-2 border-blue-100">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Email Support</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      support@puretask.com
                    </p>
                    <Badge variant="default">Response within 24h</Badge>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-100">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Phone Support</h4>
                    <p className="text-sm text-gray-600 mb-4">1-800-PURETASK</p>
                    <Badge variant="success">Mon-Fri 9am-6pm EST</Badge>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-100">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Live Chat</h4>
                    <p className="text-sm text-gray-600 mb-4">Chat with our team</p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => (window.location.href = '/messages')}
                    >
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
