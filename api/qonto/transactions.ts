import type { VercelRequest, VercelResponse } from '@vercel/node';
import { qontoFetch } from '../_lib/qonto.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!process.env.QONTO_API_KEY) return res.status(400).json({ error: 'Qonto non configuré' });
  try {
    const orgData = await qontoFetch(`/organizations/${process.env.QONTO_SLUG}`);
    const accountSlug = orgData.organization.bank_accounts[0]?.slug;
    if (!accountSlug) return res.status(404).json({ error: 'Aucun compte bancaire trouvé' });

    const limit = Math.min(Number(req.query.limit) || 25, 100);
    const data = await qontoFetch(`/transactions?slug=${accountSlug}&per_page=${limit}`);
    const transactions = data.transactions.map((tx: any) => ({
      id: tx.transaction_id,
      amount: tx.amount,
      currency: tx.currency,
      side: tx.side,
      label: tx.label,
      status: tx.status,
      settled_at: tx.settled_at,
      emitted_at: tx.emitted_at,
      category: tx.category,
      counterparty: tx.label,
      reference: tx.reference,
      note: tx.note,
    }));
    res.json({ transactions, balance: orgData.organization.bank_accounts[0]?.balance });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
