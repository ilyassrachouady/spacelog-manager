import type { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from '../_lib/stripe.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!stripe) return res.status(400).json({ error: 'Stripe non configuré' });
  try {
    const limit = Math.min(Number(req.query.limit) || 25, 100);
    const invoices = await stripe.invoices.list({ limit });
    const data = invoices.data.map(inv => ({
      id: inv.id,
      number: inv.number,
      amount_due: (inv.amount_due || 0) / 100,
      amount_paid: (inv.amount_paid || 0) / 100,
      status: inv.status,
      created: new Date(inv.created * 1000).toISOString().split('T')[0],
      due_date: inv.due_date ? new Date(inv.due_date * 1000).toISOString().split('T')[0] : null,
      customer_name: inv.customer_name || inv.customer_email || '',
      hosted_invoice_url: inv.hosted_invoice_url,
    }));
    res.json({ invoices: data });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
