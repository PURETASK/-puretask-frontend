export type InvoiceLineItem = {
  id: string;
  label: string;
  quantity?: number;
  unitPrice?: number;
  amount: number;
};

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'refunded';

export type Invoice = {
  id: string;
  createdAtISO: string;
  status: InvoiceStatus;
  subtotal: number;
  tax: number;
  total: number;
  currency: 'USD';
  bookingId?: string;
  receiptUrl?: string;
  lineItems: InvoiceLineItem[];
  paymentMethodSummary?: string;
};
