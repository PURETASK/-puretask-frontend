'use client';

import { useForm, UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export function useFormValidation<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  defaultValues?: Partial<T>
): UseFormReturn<T> {
  return useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as T,
    mode: 'onBlur', // Validate on blur for better UX
  });
}
