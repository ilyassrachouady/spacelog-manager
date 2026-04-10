import type { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from '../_lib/stripe.js';
import { qontoFetch } from '../_lib/qonto.js';
import { pennylaneFetch } from '../_lib/pennylane.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  if (_req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const results: Record<string, any> = {};

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

  if (process.env.PENNYLANE_API_KEY) {
    try {
      const data = await pennylaneFetch('/customer_invoices?page=1&per_page=1');
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
}
