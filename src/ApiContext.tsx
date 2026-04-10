import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

// ── Types ──

export interface StripeBalance {
  available: number;
  pending: number;
  currency: string;
}

export interface StripePayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: string;
  description: string;
  customer: string | null;
  metadata?: Record<string, string>;
}

export interface QontoAccount {
  slug: string;
  iban: string;
  bic: string;
  balance: number;
  balance_cents: number;
  currency: string;
  name: string;
  status: string;
}

export interface QontoTransaction {
  id: string;
  amount: number;
  currency: string;
  side: 'credit' | 'debit';
  label: string;
  status: string;
  settled_at: string;
  emitted_at: string;
  category: string;
  counterparty: string;
  reference: string;
  note: string;
}

export interface PennylaneInvoice {
  id: string;
  invoice_number: string;
  label: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  deadline: string;
  customer: string;
  paid: boolean;
  remaining_amount: number;
  file_url: string | null;
  public_url: string | null;
}

export interface PennylaneSupplierInvoice {
  id: string;
  invoice_number: string;
  label: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  deadline: string;
  supplier: string;
  paid: boolean;
}

export interface ApiStatus {
  stripe: boolean;
  qonto: boolean;
  pennylane: boolean;
}

export interface ApiData {
  status: ApiStatus;
  loading: boolean;
  lastSync: Date | null;

  // Stripe
  stripeBalance: StripeBalance | null;
  stripePayments: StripePayment[];

  // Qonto
  qontoOrgName: string;
  qontoAccounts: QontoAccount[];
  qontoBalance: number | null;
  qontoTransactions: QontoTransaction[];

  // Pennylane
  pennylaneInvoices: PennylaneInvoice[];
  pennylaneSupplierInvoices: PennylaneSupplierInvoice[];
  pennylaneTotalPages: number;

  // Actions
  refresh: () => Promise<void>;
  loadMoreInvoices: (page: number) => Promise<void>;
  loadMoreSupplierInvoices: (page: number) => Promise<void>;
}

const defaultData: ApiData = {
  status: { stripe: false, qonto: false, pennylane: false },
  loading: true,
  lastSync: null,
  stripeBalance: null,
  stripePayments: [],
  qontoOrgName: '',
  qontoAccounts: [],
  qontoBalance: null,
  qontoTransactions: [],
  pennylaneInvoices: [],
  pennylaneSupplierInvoices: [],
  pennylaneTotalPages: 1,
  refresh: async () => {},
  loadMoreInvoices: async () => {},
  loadMoreSupplierInvoices: async () => {},
};

const ApiContext = createContext<ApiData>(defaultData);

export function useApi() {
  return useContext(ApiContext);
}

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Omit<ApiData, 'refresh' | 'loadMoreInvoices' | 'loadMoreSupplierInvoices'>>({
    status: { stripe: false, qonto: false, pennylane: false },
    loading: true,
    lastSync: null,
    stripeBalance: null,
    stripePayments: [],
    qontoOrgName: '',
    qontoAccounts: [],
    qontoBalance: null,
    qontoTransactions: [],
    pennylaneInvoices: [],
    pennylaneSupplierInvoices: [],
    pennylaneTotalPages: 1,
  });

  const invoicePageRef = useRef(1);
  const supplierPageRef = useRef(1);

  const refresh = useCallback(async () => {
    setData(prev => ({ ...prev, loading: true }));

    // Fetch everything in parallel
    const [status, balance, payments, org, transactions, invoices, supplierInvoices] = await Promise.all([
      safeFetch<ApiStatus>('/api/integrations/status', { stripe: false, qonto: false, pennylane: false }),
      safeFetch<StripeBalance | null>('/api/stripe/balance', null),
      safeFetch<{ payments: StripePayment[] }>('/api/stripe/payments?limit=50', { payments: [] }),
      safeFetch<{ name: string; bank_accounts: QontoAccount[] }>('/api/qonto/organization', { name: '', bank_accounts: [] }),
      safeFetch<{ transactions: QontoTransaction[]; balance: number }>('/api/qonto/transactions?limit=100', { transactions: [], balance: 0 }),
      safeFetch<{ invoices: PennylaneInvoice[]; total_pages: number }>('/api/pennylane/invoices?page=1&per_page=100', { invoices: [], total_pages: 1 }),
      safeFetch<{ invoices: PennylaneSupplierInvoice[]; total_pages: number }>('/api/pennylane/supplier-invoices?page=1&per_page=100', { invoices: [], total_pages: 1 }),
    ]);

    invoicePageRef.current = 1;
    supplierPageRef.current = 1;

    setData({
      status,
      loading: false,
      lastSync: new Date(),
      stripeBalance: balance,
      stripePayments: payments.payments,
      qontoOrgName: org.name,
      qontoAccounts: org.bank_accounts,
      qontoBalance: transactions.balance ?? org.bank_accounts[0]?.balance ?? null,
      qontoTransactions: transactions.transactions,
      pennylaneInvoices: invoices.invoices,
      pennylaneSupplierInvoices: supplierInvoices.invoices,
      pennylaneTotalPages: invoices.total_pages,
    });
  }, []);

  const loadMoreInvoices = useCallback(async (page: number) => {
    const result = await safeFetch<{ invoices: PennylaneInvoice[] }>(`/api/pennylane/invoices?page=${page}&per_page=100`, { invoices: [] });
    if (result.invoices.length > 0) {
      invoicePageRef.current = page;
      setData(prev => ({
        ...prev,
        pennylaneInvoices: [...prev.pennylaneInvoices, ...result.invoices],
      }));
    }
  }, []);

  const loadMoreSupplierInvoices = useCallback(async (page: number) => {
    const result = await safeFetch<{ invoices: PennylaneSupplierInvoice[] }>(`/api/pennylane/supplier-invoices?page=${page}&per_page=100`, { invoices: [] });
    if (result.invoices.length > 0) {
      supplierPageRef.current = page;
      setData(prev => ({
        ...prev,
        pennylaneSupplierInvoices: [...prev.pennylaneSupplierInvoices, ...result.invoices],
      }));
    }
  }, []);

  // Load on mount
  useEffect(() => { refresh(); }, [refresh]);

  const value: ApiData = {
    ...data,
    refresh,
    loadMoreInvoices,
    loadMoreSupplierInvoices,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}
