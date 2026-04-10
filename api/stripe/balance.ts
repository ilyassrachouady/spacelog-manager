import type { VercelRequest, VercelResponse } from '@vercel/node';
import { stripe } from '../_lib/stripe.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  if (!stripe) return res.status(400).json({ error: 'Stripe non configuré' });
  try {
    const balance = await stripe.balance.retrieve();
    const available = balance.available.reduce((s, b) => s + b.amount, 0) / 100;
    const pending = balance.pending.reduce((s, b) => s + b.amount, 0) / 100;
    res.json({ available, pending, currency: 'eur' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
