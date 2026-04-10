import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { label, amount, expectedMonth, expectedYear, type, note } = req.body;
    if (!label || typeof amount !== 'number' || !expectedMonth || !expectedYear) {
      return res.status(400).json({ error: 'label, amount, expectedMonth, expectedYear required' });
    }
    const inflow = {
      id: `inflow-${Date.now()}`,
      label, amount, expectedMonth, expectedYear,
      status: 'pending',
      type: type || 'other',
      note: note || '',
    };
    return res.json({ success: true, inflow });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id required' });
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
