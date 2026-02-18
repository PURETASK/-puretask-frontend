'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { CreditsBalanceCard } from '@/components/credits/CreditsBalanceCard';
import { CreditsLedgerTable } from '@/components/credits/CreditsLedgerTable';
import { LedgerEntryDrawer } from '@/components/credits/LedgerEntryDrawer';
import { ExportButton } from '@/components/common/ExportButton';
import { useQuery } from '@tanstack/react-query';
import { creditsService } from '@/services/credits.service';
import type { CreditLedgerEntry } from '@/types/credits';

function CreditsContent() {
  const [selectedEntry, setSelectedEntry] = useState<CreditLedgerEntry | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: balanceData } = useQuery({
    queryKey: ['credits', 'balance'],
    queryFn: () => creditsService.getBalance(),
  });

  const { data: ledgerData, isLoading } = useQuery({
    queryKey: ['credits', 'ledger'],
    queryFn: () => creditsService.getLedger(),
  });

  const handleRowClick = (entry: CreditLedgerEntry) => {
    setSelectedEntry(entry);
    setDrawerOpen(true);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    const entries = ledgerData?.entries ?? [];
    if (format === 'csv' && entries.length > 0) {
      const headers = ['Date', 'ID', 'Type', 'Description', 'Amount', 'Status'];
      const rows = entries.map(
        (e) =>
          `${new Date(e.createdAtISO).toISOString()},${e.id},${e.type},"${e.description}",${e.amount},${e.status}`
      );
      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `credits-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Credits</h1>
            <p className="text-gray-600 mt-1">View your balance and transaction history</p>
          </div>

          <div className="grid gap-6 mb-8">
            {balanceData && (
              <CreditsBalanceCard
                balance={balanceData.balance}
                lastUpdatedISO={balanceData.lastUpdatedISO}
              />
            )}
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Ledger</h2>
            <ExportButton onExport={handleExport} formats={['csv']} />
          </div>

          <CreditsLedgerTable
            entries={ledgerData?.entries ?? []}
            onRowClick={handleRowClick}
            isLoading={isLoading}
          />
        </div>
      </main>
      <Footer />

      <LedgerEntryDrawer
        entry={selectedEntry}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}

export default function CreditsPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <CreditsContent />
    </ProtectedRoute>
  );
}
