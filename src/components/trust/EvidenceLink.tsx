'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FileText, ExternalLink } from 'lucide-react';

interface EvidenceLinkProps {
  href: string;
  label: string;
  kind?: 'booking' | 'invoice' | 'policy' | 'receipt' | 'dispute';
  external?: boolean;
  className?: string;
}

export function EvidenceLink({
  href,
  label,
  kind = 'receipt',
  external = false,
  className,
}: EvidenceLinkProps) {
  const content = (
    <>
      <FileText className="h-4 w-4" />
      <span>{label}</span>
      {external && <ExternalLink className="h-3 w-3" />}
    </>
  );

  const baseClass =
    'inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors';

  if (external || href.startsWith('http')) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(baseClass, className)}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(baseClass, className)}>
      {content}
    </Link>
  );
}
