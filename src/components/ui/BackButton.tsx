'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  fallbackUrl?: string;
  className?: string;
  label?: string;
  variant?: 'ghost' | 'outline' | 'primary' | 'secondary';
}

export function BackButton({ 
  fallbackUrl = '/', 
  className, 
  label = 'Back',
  variant = 'ghost' 
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back();
    } else {
      // If no history, go to fallback URL
      router.push(fallbackUrl);
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleBack}
      className={cn('gap-2', className)}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}

