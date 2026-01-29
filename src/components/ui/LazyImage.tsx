'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
}

/**
 * Optimized image component using Next.js Image
 * Falls back to regular img if Next.js Image fails
 */
export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  fill,
  priority = false,
  sizes,
}: LazyImageProps) {
  // If no width/height and no fill, use regular img
  if (!fill && (!width || !height)) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn('object-cover', className)}
        loading="lazy"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={cn('object-cover', className)}
      loading={priority ? undefined : 'lazy'}
      priority={priority}
      sizes={sizes}
    />
  );
}
