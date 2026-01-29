/**
 * SEO metadata utilities
 */

import { Metadata } from 'next';

export interface PageMetadata {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  keywords?: string[];
}

export function generateMetadata(metadata: PageMetadata): Metadata {
  const {
    title,
    description,
    image = '/og-image.png',
    url,
    type = 'website',
    keywords = [],
  } = metadata;

  const fullTitle = title.includes('PureTask') ? title : `${title} | PureTask`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://puretask.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: 'PureTask',
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

/**
 * Generate structured data (JSON-LD)
 */
export function generateStructuredData(type: 'Organization' | 'Service' | 'LocalBusiness', data: any) {
  const base = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  switch (type) {
    case 'Organization':
      return {
        ...base,
        name: data.name || 'PureTask',
        url: data.url || 'https://puretask.com',
        logo: data.logo || 'https://puretask.com/logo.png',
        description: data.description || 'Professional cleaning services platform',
        sameAs: data.socialLinks || [],
      };
    case 'Service':
      return {
        ...base,
        serviceType: data.serviceType || 'Cleaning Service',
        provider: {
          '@type': 'Organization',
          name: 'PureTask',
        },
        areaServed: data.areaServed || 'United States',
        description: data.description,
      };
    case 'LocalBusiness':
      return {
        ...base,
        name: data.name || 'PureTask',
        address: data.address,
        telephone: data.telephone,
        priceRange: data.priceRange || '$$',
      };
    default:
      return base;
  }
}
