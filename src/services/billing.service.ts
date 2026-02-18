import { apiClient } from '@/lib/api';
import type { Invoice } from '@/types/billing';

export const billingService = {
  getInvoices: async (params?: { page?: number; status?: string }): Promise<{
    invoices: Invoice[];
  }> => {
    try {
      const res = await apiClient.get<{ invoices?: Invoice[]; data?: Invoice[] }>(
        '/billing/invoices',
        { params }
      );
      const invoices = res.invoices ?? res.data ?? [];
      return { invoices };
    } catch {
      return { invoices: [] };
    }
  },

  getInvoice: async (invoiceId: string): Promise<Invoice | null> => {
    try {
      const res = await apiClient.get<{ invoice?: Invoice }>(`/billing/invoices/${invoiceId}`);
      return res.invoice ?? null;
    } catch {
      return null;
    }
  },
};
