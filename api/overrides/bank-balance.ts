import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
  const { monthKey, amount } = req.body;
  if (!monthKey || typeof amount !== 'number') {
    return res.status(400).json({ error: 'monthKey (string) and amount (number) required' });
  }
  res.json({ success: true, monthKey, amount });
}
