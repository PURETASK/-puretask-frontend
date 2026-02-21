'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, MessageCircle, FileText } from 'lucide-react';

export function SupportActionCard() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 font-semibold text-gray-900">Need help?</h3>
      <div className="space-y-3">
        <Link href="/help" className="inline-flex h-11 min-h-[44px] w-full items-center justify-start gap-2 rounded-lg border-2 border-blue-600 px-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50">
          <AlertCircle className="h-4 w-4" />
          Report an issue
        </Link>
        <Link href="/messages" className="inline-flex h-11 min-h-[44px] w-full items-center justify-start gap-2 rounded-lg border-2 border-blue-600 px-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50">
          <MessageCircle className="h-4 w-4" />
          Contact support
        </Link>
        <Link href="/terms" className="inline-flex h-11 min-h-[44px] w-full items-center justify-start gap-2 rounded-lg border-2 border-blue-600 px-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50">
          <FileText className="h-4 w-4" />
          View policies
        </Link>
      </div>
    </div>
  );
}
