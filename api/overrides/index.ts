import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory store — resets on cold starts. For production persistence, use a database.
const store: Record<string, any> = {
  vatCredits: {} as Record<string, number>,
  bankBalances: {} as Record<string, number>,
  expectedInflows: [] as Array<{
    id: string; label: string; amount: number;
    expectedMonth: string; expectedYear: number;
    status: string; type: string; note: string;
  }>,
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return res.json(store);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
