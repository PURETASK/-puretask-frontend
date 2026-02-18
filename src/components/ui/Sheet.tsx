'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface SheetContentProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  side?: 'left' | 'right';
  className?: string;
}

const Sheet = ({ open, onOpenChange, children }: SheetProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    {children}
  </Dialog.Root>
);

const SheetTrigger = Dialog.Trigger;

const SheetClose = Dialog.Close;

const SheetPortal = Dialog.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/50 animate-fade-in', className)}
    {...props}
  />
));
SheetOverlay.displayName = 'SheetOverlay';

const SheetContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  SheetContentProps & React.ComponentPropsWithoutRef<typeof Dialog.Content>
>(({ children, title, description, side = 'right', className, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <Dialog.Content
      ref={ref}
      className={cn(
        'fixed z-50 gap-4 bg-white shadow-xl',
        side === 'right' && 'inset-y-0 right-0 h-full w-full max-w-lg border-l animate-slide-in-right',
        side === 'left' && 'inset-y-0 left-0 h-full w-full max-w-lg border-r animate-slide-in-left',
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="flex flex-col gap-1.5 border-b px-6 py-4">
          {title && (
            <Dialog.Title className="text-lg font-semibold text-gray-900">{title}</Dialog.Title>
          )}
          {description && (
            <Dialog.Description className="text-sm text-gray-500">{description}</Dialog.Description>
          )}
        </div>
      )}
      <div className={cn('flex-1 overflow-y-auto px-6 py-4', !title && !description && 'pt-6')}>
        {children}
      </div>
      <Dialog.Close
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </Dialog.Close>
    </Dialog.Content>
  </SheetPortal>
));
SheetContent.displayName = 'SheetContent';

export { Sheet, SheetTrigger, SheetContent, SheetClose };
