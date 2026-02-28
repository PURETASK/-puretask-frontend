'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { MapPin } from 'lucide-react';

interface AddressAutocompletePlaceholderProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Street address input. Ready for Google Places (or similar) autocomplete
 * when NEXT_PUBLIC_GOOGLE_PLACES_API_KEY (or equivalent) is configured.
 * For now, use as a standard input with a short hint.
 */
export function AddressAutocompletePlaceholder({
  label = 'Street Address',
  value,
  onChange,
  placeholder = 'Start typing your address…',
  required,
  disabled,
}: AddressAutocompletePlaceholderProps) {
  return (
    <div>
      <Input
        label={label}
        type="text"
        inputMode="text"
        autoComplete="street-address"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
        <MapPin className="h-3.5 w-3.5 flex-shrink-0" aria-hidden />
        Address autocomplete will be available when the Places API is configured.
      </p>
    </div>
  );
}
