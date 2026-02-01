'use client';

import React, { useState, useRef, useEffect } from 'react';
import { lazyLoadImage } from '@/lib/mobile/performance';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
}

/**
 * Lazy loading image component for mobile performance
 */
export function LazyImage({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E',
  className,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const img = imgRef.current;
    
    // Use intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              img.src = src;
              observer.unobserve(img);
            }
          });
        },
        { rootMargin: '50px' }
      );
      observer.observe(img);

      return () => observer.disconnect();
    } else {
      // Fallback for older browsers
      img.src = src;
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <img
      ref={imgRef}
      src={placeholder}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      className={cn(
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-0',
        error && 'opacity-50',
        className
      )}
      loading="lazy"
      {...props}
    />
  );
}
