import React from 'react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn('bg-white border-t border-gray-200 mt-auto', className)}>
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a href="/terms" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="/help" className="hover:text-blue-600 transition-colors">Help</a>
            <a href="/contact" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
          
          <div className="text-sm text-gray-500">
            © {currentYear} PureTask. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
