'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  name: string;
  error?: FieldError | string;
  required?: boolean;
  hint?: string;
  children?: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  name,
  error,
  required,
  hint,
  children,
  className,
}: FormFieldProps) {
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children || <Input id={name} name={name} />}
      {hint && !errorMessage && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}
      {errorMessage && (
        <p className="text-xs text-red-600" role="alert" id={`${name}-error`}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
