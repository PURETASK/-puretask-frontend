'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AlertCircle, MessageCircle, FileText } from 'lucide-react';

export function SupportActionCard() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 font-semibold text-gray-900">Need help?</h3>
      <div className="space-y-3">
        <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
          <Link href="/help">
            <AlertCircle className="h-4 w-4" />
            Report an issue
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
          <Link href="/messages">
            <MessageCircle className="h-4 w-4" />
            Contact support
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
          <Link href="/terms">
            <FileText className="h-4 w-4" />
            View policies
          </Link>
        </Button>
      </div>
    </div>
  );
}
