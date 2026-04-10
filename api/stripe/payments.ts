import type { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from '../_lib/stripe.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!stripe) return res.status(400).json({ error: 'Stripe non configuré' });
  try {
    const limit = Math.min(Number(req.query.limit) || 25, 100);
    const payments = await stripe.paymentIntents.list({ limit });
    const data = payments.data.map(pi => ({
      id: pi.id,
      amount: pi.amount / 100,
      currency: pi.currency,
      status: pi.status,
      created: new Date(pi.created * 1000).toISOString().split('T')[0],
      description: pi.description || '',
      customer: pi.customer,
      metadata: pi.metadata,
    }));
    res.json({ payments: data, hasMore: payments.has_more });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
