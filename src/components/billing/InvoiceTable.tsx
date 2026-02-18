'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import type { Invoice } from '@/types/billing';

interface InvoiceTableProps {
  invoices: Invoice[];
  onRowClick?: (invoice: Invoice) => void;
  isLoading?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  open: 'bg-amber-100 text-amber-800',
  paid: 'bg-green-100 text-green-800',
  void: 'bg-gray-100 text-gray-500',
  refunded: 'bg-blue-100 text-blue-800',
};

export function InvoiceTable({
  invoices,
  onRowClick,
  isLoading,
}: InvoiceTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered =
    statusFilter === 'all'
      ? invoices
      : invoices.filter((i) => i.status === statusFilter);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading invoices...
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        No invoices yet. Invoices will appear here when you make purchases.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="border-b bg-gray-50 px-4 py-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="paid">Paid</option>
          <option value="open">Open</option>
          <option value="draft">Draft</option>
          <option value="void">Void</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((inv) => (
            <TableRow
              key={inv.id}
              className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
              onClick={() => onRowClick?.(inv)}
            >
              <TableCell className="text-sm text-gray-600">
                {format(new Date(inv.createdAtISO), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="font-mono text-xs">{inv.id.slice(0, 8)}…</TableCell>
              <TableCell>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    STATUS_COLORS[inv.status] ?? 'bg-gray-100'
                  }`}
                >
                  {inv.status}
                </span>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(inv.total)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
