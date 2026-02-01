import React from 'react';
import { cn } from '@/lib/utils';
import { getMobileInputConfig } from '@/lib/mobile/inputTypes';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fieldType?: 'phone' | 'email' | 'password' | 'number' | 'decimal' | 'search' | 'text' | 'name' | 'address' | 'city' | 'zip' | 'country';
}

export function Input({ 
  label, 
  error, 
  helperText, 
  fieldType, 
  className, 
  type, 
  inputMode, 
  autoComplete, 
  pattern, 
  ...props 
}: InputProps) {
  // Use mobile config if fieldType is provided, otherwise use passed props
  const mobileConfig = fieldType ? getMobileInputConfig(fieldType) : null;
  const finalType = type || mobileConfig?.type || 'text';
  const finalInputMode = inputMode || mobileConfig?.inputMode;
  const finalAutoComplete = autoComplete || mobileConfig?.autoComplete;
  const finalPattern = pattern || mobileConfig?.pattern;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={finalType}
        inputMode={finalInputMode}
        autoComplete={finalAutoComplete}
        pattern={finalPattern}
        className={cn(
          'flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base min-h-[44px]',
          'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.id || 'input'}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${props.id || 'input'}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  );
}
