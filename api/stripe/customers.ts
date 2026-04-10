import type { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from '../_lib/stripe.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!stripe) return res.status(400).json({ error: 'Stripe non configuré' });
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const customers = await stripe.customers.list({ limit });
    const data = customers.data.map(c => ({
      id: c.id,
      name: c.name,
      email: c.email,
      created: new Date(c.created * 1000).toISOString().split('T')[0],
      balance: (c.balance || 0) / 100,
    }));
    res.json({ customers: data });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
