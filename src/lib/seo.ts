import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  ogImage = '/og-image.jpg',
  noIndex = false,
}: SEOProps): Metadata {
  const siteName = 'PureTask';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://puretask.com';

  return {
    title: fullTitle,
    description,
    keywords: [
      'cleaning service',
      'house cleaning',
      'professional cleaners',
      'book cleaner online',
      ...keywords,
    ],
    authors: [{ name: 'PureTask Team' }],
    creator: 'PureTask',
    publisher: 'PureTask',
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      title: fullTitle,
      description,
      url: baseUrl,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@puretask',
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
    },
    themeColor: '#3B82F6',
    manifest: '/manifest.json',
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
  };
}

// Pre-defined metadata for common pages
export const seoConfig = {
  home: {
    title: 'PureTask - Professional Cleaning Services Made Easy',
    description:
      'Book trusted, verified cleaning professionals in minutes. From standard cleaning to deep cleans, find the perfect cleaner for your home or office.',
    keywords: ['home cleaning', 'office cleaning', 'maid service', 'cleaning booking'],
  },
  search: {
    title: 'Find Cleaners Near You',
    description:
      'Browse top-rated cleaning professionals in your area. Compare prices, read reviews, and book instantly. All cleaners are background-checked and insured.',
    keywords: ['find cleaner', 'hire cleaner', 'local cleaning service'],
  },
  login: {
    title: 'Login to Your Account',
    description: 'Sign in to manage your bookings, messages, and account settings.',
    noIndex: true,
  },
  register: {
    title: 'Create Your Account',
    description: 'Join PureTask to book cleaning services or offer your cleaning expertise.',
    keywords: ['sign up', 'create account', 'register cleaner'],
  },
  dashboard: {
    title: 'My Dashboard',
    description: 'Manage your bookings, view statistics, and track your activity.',
    noIndex: true,
  },
  help: {
    title: 'Help Center & FAQs',
    description:
      'Get answers to common questions about bookings, payments, and more. Contact our support team for assistance.',
    keywords: ['help', 'faq', 'support', 'customer service'],
  },
  terms: {
    title: 'Terms of Service',
    description: 'Read our terms of service and user agreement.',
    keywords: ['terms', 'legal', 'agreement'],
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'Learn how we collect, use, and protect your personal information.',
    keywords: ['privacy', 'data protection', 'gdpr'],
  },
  referral: {
    title: 'Refer Friends & Earn Rewards',
    description:
      'Share PureTask with friends and earn $30 for every completed booking. Your friends get $15 off their first service!',
    keywords: ['referral', 'rewards', 'earn money', 'refer friend'],
  },
};

