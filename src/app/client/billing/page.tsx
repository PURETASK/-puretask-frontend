'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { InvoiceTable } from '@/components/billing/InvoiceTable';
import { InvoiceViewerDrawer } from '@/components/billing/InvoiceViewerDrawer';
import { ExportButton } from '@/components/common/ExportButton';
import { useQuery } from '@tanstack/react-query';
import { billingService } from '@/services/billing.service';
import type { Invoice } from '@/types/billing';

function BillingContent() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['billing', 'invoices'],
    queryFn: () => billingService.getInvoices(),
  });

  const invoices = data?.invoices ?? [];

  const handleRowClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDrawerOpen(true);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    if (format === 'csv' && invoices.length > 0) {
      const headers = ['ID', 'Date', 'Status', 'Subtotal', 'Tax', 'Total'];
      const rows = invoices.map(
        (i) =>
          `${i.id},${new Date(i.createdAtISO).toISOString()},${i.status},${i.subtotal},${i.tax},${i.total}`
      );
      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoices-${new Date().toISOString().slice(0, 10)}.csv`;
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
            <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
            <p className="text-gray-600 mt-1">Invoices and payment history</p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Invoices</h2>
            <ExportButton onExport={handleExport} formats={['csv']} />
          </div>

          <InvoiceTable
            invoices={invoices}
            onRowClick={handleRowClick}
            isLoading={isLoading}
          />
        </div>
      </main>
      <Footer />

      <InvoiceViewerDrawer
        invoice={selectedInvoice}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}

export default function BillingPage() {
  return (
    <ProtectedRoute requiredRole="client">
      <BillingContent />
    </ProtectedRoute>
  );
}
