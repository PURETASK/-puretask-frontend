import React from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { BRAND } from '@/lib/brand';

export function GradientButton({
  className,
  style,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      variant="primary"
      className={cn(
        'rounded-full px-6 py-6 text-base shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.99]',
        className
      )}
      style={{
        backgroundImage: `linear-gradient(90deg, ${BRAND.blue}, ${BRAND.aqua})`,
        color: 'white',
        border: 'none',
        ...style,
      }}
    />
  );
}
