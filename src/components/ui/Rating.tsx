import React from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (value: number) => void;
  readOnly?: boolean;
  className?: string;
}

export function Rating({ value, max = 5, size = 'md', onChange, readOnly = false, className }: RatingProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= value;
        const isHalf = starValue - 0.5 === value;

        return (
          <button
            key={index}
            type="button"
            onClick={() => !readOnly && onChange?.(starValue)}
            disabled={readOnly}
            className={cn(
              'transition-colors',
              !readOnly && 'cursor-pointer hover:scale-110',
              readOnly && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizes[size],
                isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
