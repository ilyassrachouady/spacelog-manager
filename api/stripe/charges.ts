import type { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from '../_lib/stripe.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!stripe) return res.status(400).json({ error: 'Stripe non configuré' });
  try {
    const limit = Math.min(Number(req.query.limit) || 25, 100);
    const charges = await stripe.charges.list({ limit });
    const data = charges.data.map(ch => ({
      id: ch.id,
      amount: ch.amount / 100,
      currency: ch.currency,
      status: ch.status,
      created: new Date(ch.created * 1000).toISOString().split('T')[0],
      description: ch.description || '',
      customer: ch.customer,
      receipt_url: ch.receipt_url,
      paid: ch.paid,
    }));
    res.json({ charges: data, hasMore: charges.has_more });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
