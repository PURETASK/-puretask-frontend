export type CreditLedgerEntryType = 'deposit' | 'spend' | 'refund' | 'bonus' | 'fee';
export type CreditLedgerStatus = 'pending' | 'posted' | 'reversed';

export type CreditLedgerEntry = {
  id: string;
  createdAtISO: string;
  type: CreditLedgerEntryType;
  amount: number;
  currency: 'USD';
  description: string;
  status: CreditLedgerStatus;
  relatedBookingId?: string;
  invoiceId?: string;
  evidence?: {
    kind: 'receipt' | 'policy' | 'dispute';
    id: string;
    href: string;
  }[];
};
