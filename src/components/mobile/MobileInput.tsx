'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { getMobileInputConfig } from '@/lib/mobile/inputTypes';
import { cn } from '@/lib/utils';

interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fieldType?: 'phone' | 'email' | 'password' | 'number' | 'decimal' | 'search' | 'text' | 'name' | 'address' | 'city' | 'zip' | 'country';
  label?: string;
  error?: string;
}

/**
 * Mobile-optimized input component
 * - Proper input types for mobile keyboards
 * - Touch-friendly sizing (44px minimum)
 * - Autocomplete attributes
 */
export function MobileInput({
  fieldType = 'text',
  label,
  error,
  className,
  ...props
}: MobileInputProps) {
  const mobileConfig = getMobileInputConfig(fieldType);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <Input
        {...props}
        type={mobileConfig.type}
        inputMode={mobileConfig.inputMode}
        autoComplete={mobileConfig.autoComplete}
        pattern={mobileConfig.pattern}
        className={cn(
          'min-h-[44px] text-base', // Touch-friendly size, prevent zoom on iOS
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id || fieldType}-error` : undefined}
      />
      {error && (
        <p
          id={`${props.id || fieldType}-error`}
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
