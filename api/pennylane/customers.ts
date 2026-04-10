import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pennylaneFetch } from '../_lib/pennylane.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!process.env.PENNYLANE_API_KEY) return res.status(400).json({ error: 'Pennylane non configuré' });
  try {
    const page = Number(req.query.page) || 1;
    const data = await pennylaneFetch(`/customers?page=${page}&per_page=50`);
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
