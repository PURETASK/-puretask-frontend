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
import type { CreditLedgerEntry } from '@/types/credits';

interface CreditsLedgerTableProps {
  entries: CreditLedgerEntry[];
  onRowClick?: (entry: CreditLedgerEntry) => void;
  isLoading?: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  deposit: 'Deposit',
  spend: 'Spend',
  refund: 'Refund',
  bonus: 'Bonus',
  fee: 'Fee',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  posted: 'bg-green-100 text-green-800',
  reversed: 'bg-gray-100 text-gray-600',
};

export function CreditsLedgerTable({
  entries,
  onRowClick,
  isLoading,
}: CreditsLedgerTableProps) {
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered =
    typeFilter === 'all'
      ? entries
      : entries.filter((e) => e.type === typeFilter);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading ledger...
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        No ledger entries yet. Credits activity will appear here.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="border-b bg-gray-50 px-4 py-2">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        >
          <option value="all">All types</option>
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((entry) => (
            <TableRow
              key={entry.id}
              className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
              onClick={() => onRowClick?.(entry)}
            >
              <TableCell className="text-sm text-gray-600">
                {format(new Date(entry.createdAtISO), 'MMM d, yyyy HH:mm')}
              </TableCell>
              <TableCell className="font-mono text-xs text-gray-500">{entry.id.slice(0, 8)}…</TableCell>
              <TableCell>{TYPE_LABELS[entry.type] ?? entry.type}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell className="text-right font-medium">
                <span
                  className={
                    ['deposit', 'refund', 'bonus'].includes(entry.type)
                      ? 'text-green-600'
                      : 'text-gray-900'
                  }
                >
                  {['deposit', 'refund', 'bonus'].includes(entry.type) ? '+' : '-'}
                  {formatCurrency(Math.abs(entry.amount))}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    STATUS_COLORS[entry.status] ?? 'bg-gray-100'
                  }`}
                >
                  {entry.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
