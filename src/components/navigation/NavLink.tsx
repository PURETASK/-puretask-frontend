import React from 'react';
import { cn } from '@/lib/utils';

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  children: React.ReactNode;
}

export function NavLink({ active, children, className, ...props }: NavLinkProps) {
  return (
    <a
      className={cn(
        'inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
        active
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}


