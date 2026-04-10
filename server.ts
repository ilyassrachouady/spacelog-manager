import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";

// ── Stripe client ──
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// ── Qonto helpers ──
const QONTO_BASE = "https://thirdparty.qonto.com/v2";
async function qontoFetch(endpoint: string) {
  const res = await fetch(`${QONTO_BASE}${endpoint}`, {
    headers: { Authorization: `${process.env.QONTO_SLUG}:${process.env.QONTO_API_KEY}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Qonto ${res.status}: ${text}`);
  }
  return res.json();
}

// ── Pennylane helpers ──
const PENNYLANE_BASE = "https://app.pennylane.com/api/external/v1";
async function pennylaneFetch(endpoint: string) {
  const res = await fetch(`${PENNYLANE_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${process.env.PENNYLANE_API_KEY}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pennylane ${res.status}: ${text}`);
  }
  return res.json();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ═══════════ Health & Status ═══════════

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/integrations/status", (_req, res) => {
    res.json({
      stripe: !!process.env.STRIPE_SECRET_KEY,
      qonto: !!process.env.QONTO_API_KEY,
      pennylane: !!process.env.PENNYLANE_API_KEY,
    });
  });

  // ═══════════ Stripe Routes ═══════════

  // Balance
  app.get("/api/stripe/balance", async (_req, res) => {
    if (!stripe) return res.status(400).json({ error: "Stripe non configuré" });
    try {
      const balance = await stripe.balance.retrieve();
      const available = balance.available.reduce((s, b) => s + b.amount, 0) / 100;
      const pending = balance.pending.reduce((s, b) => s + b.amount, 0) / 100;
      res.json({ available, pending, currency: "eur" });
    } catch (e: any) {
      console.error("Stripe balance error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // Recent payment intents
  app.get("/api/stripe/payments", async (req, res) => {
    if (!stripe) return res.status(400).json({ error: "Stripe non configuré" });
    try {
      const limit = Math.min(Number(req.query.limit) || 25, 100);
      const payments = await stripe.paymentIntents.list({ limit });
      const data = payments.data.map(pi => ({
        id: pi.id,
        amount: pi.amount / 100,
        currency: pi.currency,
        status: pi.status,
        created: new Date(pi.created * 1000).toISOString().split("T")[0],
        description: pi.description || "",
        customer: pi.customer,
        metadata: pi.metadata,
      }));
      res.json({ payments: data, hasMore: payments.has_more });
    } catch (e: any) {
      console.error("Stripe payments error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // Recent charges
  app.get("/api/stripe/charges", async (req, res) => {
    if (!stripe) return res.status(400).json({ error: "Stripe non configuré" });
    try {
      const limit = Math.min(Number(req.query.limit) || 25, 100);
      const charges = await stripe.charges.list({ limit });
      const data = charges.data.map(ch => ({
        id: ch.id,
        amount: ch.amount / 100,
        currency: ch.currency,
        status: ch.status,
        created: new Date(ch.created * 1000).toISOString().split("T")[0],
        description: ch.description || "",
        customer: ch.customer,
        receipt_url: ch.receipt_url,
        paid: ch.paid,
      }));
      res.json({ charges: data, hasMore: charges.has_more });
    } catch (e: any) {
      console.error("Stripe charges error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // Customers
  app.get("/api/stripe/customers", async (req, res) => {
    if (!stripe) return res.status(400).json({ error: "Stripe non configuré" });
    try {
      const limit = Math.min(Number(req.query.limit) || 50, 100);
      const customers = await stripe.customers.list({ limit });
      const data = customers.data.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        created: new Date(c.created * 1000).toISOString().split("T")[0],
        balance: (c.balance || 0) / 100,
      }));
      res.json({ customers: data });
    } catch (e: any) {
      console.error("Stripe customers error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // Invoices
  app.get("/api/stripe/invoices", async (req, res) => {
    if (!stripe) return res.status(400).json({ error: "Stripe non configuré" });
    try {
      const limit = Math.min(Number(req.query.limit) || 25, 100);
      const invoices = await stripe.invoices.list({ limit });
      const data = invoices.data.map(inv => ({
        id: inv.id,
        number: inv.number,
        amount_due: (inv.amount_due || 0) / 100,
        amount_paid: (inv.amount_paid || 0) / 100,
        status: inv.status,
        created: new Date(inv.created * 1000).toISOString().split("T")[0],
        due_date: inv.due_date ? new Date(inv.due_date * 1000).toISOString().split("T")[0] : null,
        customer_name: inv.customer_name || inv.customer_email || "",
        hosted_invoice_url: inv.hosted_invoice_url,
      }));
      res.json({ invoices: data });
    } catch (e: any) {
      console.error("Stripe invoices error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // ═══════════ Qonto Routes ═══════════

  // Organization info
  app.get("/api/qonto/organization", async (_req, res) => {
    if (!process.env.QONTO_API_KEY) return res.status(400).json({ error: "Qonto non configuré" });
    try {
      const data = await qontoFetch(`/organizations/${process.env.QONTO_SLUG}`);
      const org = data.organization;
      res.json({
        name: org.legal_name,
        slug: org.slug,
        bank_accounts: org.bank_accounts.map((ba: any) => ({
          slug: ba.slug,
          iban: ba.iban,
          bic: ba.bic,
          balance: ba.balance,
          balance_cents: ba.balance_cents,
          currency: ba.currency,
          name: ba.name,
          status: ba.status,
        })),
      });
    } catch (e: any) {
      console.error("Qonto org error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // Transactions
  app.get("/api/qonto/transactions", async (req, res) => {
    if (!process.env.QONTO_API_KEY) return res.status(400).json({ error: "Qonto non configuré" });
    try {
      // First get the bank account slug
      const orgData = await qontoFetch(`/organizations/${process.env.QONTO_SLUG}`);
      const accountSlug = orgData.organization.bank_accounts[0]?.slug;
      if (!accountSlug) return res.status(404).json({ error: "Aucun compte bancaire trouvé" });

      const limit = Math.min(Number(req.query.limit) || 25, 100);
      const data = await qontoFetch(`/transactions?slug=${accountSlug}&per_page=${limit}`);
      const transactions = data.transactions.map((tx: any) => ({
        id: tx.transaction_id,
        amount: tx.amount,
        currency: tx.currency,
        side: tx.side, // credit or debit
        label: tx.label,
        status: tx.status,
        settled_at: tx.settled_at,
        emitted_at: tx.emitted_at,
        category: tx.category,
        counterparty: tx.label,
        reference: tx.reference,
        note: tx.note,
      }));
      res.json({ transactions, balance: orgData.organization.bank_accounts[0]?.balance });
    } catch (e: any) {
      console.error("Qonto transactions error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // ═══════════ Pennylane Routes ═══════════

  // Customer invoices
  app.get("/api/pennylane/invoices", async (req, res) => {
    if (!process.env.PENNYLANE_API_KEY) return res.status(400).json({ error: "Pennylane non configuré" });
    try {
      const page = Number(req.query.page) || 1;
      const data = await pennylaneFetch(`/customer_invoices?page=${page}&per_page=25`);
      const invoices = (data.invoices || []).map((inv: any) => ({
        id: inv.id,
        invoice_number: inv.invoice_number,
        label: inv.label,
        amount: inv.amount ? parseFloat(inv.amount) : 0,
        currency: inv.currency,
        status: inv.status,
        date: inv.date,
        deadline: inv.deadline,
        customer: inv.customer?.name || inv.customer?.first_name || "",
        paid: inv.paid,
        remaining_amount: inv.remaining_amount ? parseFloat(inv.remaining_amount) : 0,
        file_url: inv.file_url || null,
        public_url: inv.public_url || null,
      }));
      res.json({ invoices, total_pages: data.total_pages, current_page: data.current_page });
    } catch (e: any) {
      console.error("Pennylane invoices error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // Supplier invoices
  app.get("/api/pennylane/supplier-invoices", async (req, res) => {
    if (!process.env.PENNYLANE_API_KEY) return res.status(400).json({ error: "Pennylane non configuré" });
    try {
      const page = Number(req.query.page) || 1;
      const data = await pennylaneFetch(`/supplier_invoices?page=${page}&per_page=25`);
      const invoices = (data.invoices || []).map((inv: any) => ({
        id: inv.id,
        invoice_number: inv.invoice_number,
        label: inv.label,
        amount: inv.amount ? parseFloat(inv.amount) : 0,
        currency: inv.currency,
        status: inv.status,
        date: inv.date,
        deadline: inv.deadline,
        supplier: inv.supplier?.name || "",
        paid: inv.paid,
      }));
      res.json({ invoices, total_pages: data.total_pages, current_page: data.current_page });
    } catch (e: any) {
      console.error("Pennylane supplier invoices error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // Customers list
  app.get("/api/pennylane/customers", async (req, res) => {
    if (!process.env.PENNYLANE_API_KEY) return res.status(400).json({ error: "Pennylane non configuré" });
    try {
      const page = Number(req.query.page) || 1;
      const data = await pennylaneFetch(`/customers?page=${page}&per_page=50`);
      res.json(data);
    } catch (e: any) {
      console.error("Pennylane customers error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  // ═══════════ Manual Overrides (VAT Credit, Bank Balance) ═══════════

  // In-memory store for manual overrides (would be DB in production)
  const manualOverrides: Record<string, any> = {
    vatCredits: {} as Record<string, number>,       // e.g. { 'Mar-2026': 72182 }
    bankBalances: {} as Record<string, number>,      // e.g. { 'Jan-2026': 34585 }
    expectedInflows: [] as Array<{ id: string; label: string; amount: number; expectedMonth: string; expectedYear: number; status: string; type: string; note: string }>,
  };

  // GET all overrides
  app.get("/api/overrides", (_req, res) => {
    res.json(manualOverrides);
  });

  // PUT VAT credit for a specific month
  app.put("/api/overrides/vat-credit", (req, res) => {
    const { monthKey, amount } = req.body;
    if (!monthKey || typeof amount !== 'number') {
      return res.status(400).json({ error: "monthKey (string) and amount (number) required" });
    }
    manualOverrides.vatCredits[monthKey] = amount;
    res.json({ success: true, vatCredits: manualOverrides.vatCredits });
  });

  // PUT bank balance for a specific month
  app.put("/api/overrides/bank-balance", (req, res) => {
    const { monthKey, amount } = req.body;
    if (!monthKey || typeof amount !== 'number') {
      return res.status(400).json({ error: "monthKey (string) and amount (number) required" });
    }
    manualOverrides.bankBalances[monthKey] = amount;
    res.json({ success: true, bankBalances: manualOverrides.bankBalances });
  });

  // POST expected inflow
  app.post("/api/overrides/expected-inflow", (req, res) => {
    const { label, amount, expectedMonth, expectedYear, type, note } = req.body;
    if (!label || typeof amount !== 'number' || !expectedMonth || !expectedYear) {
      return res.status(400).json({ error: "label, amount, expectedMonth, expectedYear required" });
    }
    const inflow = {
      id: `inflow-${Date.now()}`,
      label,
      amount,
      expectedMonth,
      expectedYear,
      status: 'pending',
      type: type || 'other',
      note: note || '',
    };
    manualOverrides.expectedInflows.push(inflow);
    res.json({ success: true, inflow });
  });

  // DELETE expected inflow
  app.delete("/api/overrides/expected-inflow/:id", (req, res) => {
    const idx = manualOverrides.expectedInflows.findIndex((f: any) => f.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    manualOverrides.expectedInflows.splice(idx, 1);
    res.json({ success: true });
  });

  // ═══════════ Sync All ═══════════

  app.post("/api/integrations/sync", async (_req, res) => {
    const results: Record<string, any> = {};

    // Stripe balance
    if (stripe) {
      try {
        const bal = await stripe.balance.retrieve();
        results.stripe = {
          connected: true,
          balance: bal.available.reduce((s, b) => s + b.amount, 0) / 100,
        };
      } catch (e: any) {
        results.stripe = { connected: false, error: e.message };
      }
    } else {
      results.stripe = { connected: false };
    }

    // Qonto balance
    if (process.env.QONTO_API_KEY) {
      try {
        const data = await qontoFetch(`/organizations/${process.env.QONTO_SLUG}`);
        const account = data.organization.bank_accounts[0];
        results.qonto = {
          connected: true,
          balance: account?.balance || 0,
          name: data.organization.legal_name,
        };
      } catch (e: any) {
        results.qonto = { connected: false, error: e.message };
      }
    } else {
      results.qonto = { connected: false };
    }

    // Pennylane
    if (process.env.PENNYLANE_API_KEY) {
      try {
        const data = await pennylaneFetch("/customer_invoices?page=1&per_page=1");
        results.pennylane = {
          connected: true,
          total_invoices: data.total_pages || 0,
        };
      } catch (e: any) {
        results.pennylane = { connected: false, error: e.message };
      }
    } else {
      results.pennylane = { connected: false };
    }

    res.json({ success: true, results });
  });

  // ═══════════ Vite Dev Server ═══════════

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
