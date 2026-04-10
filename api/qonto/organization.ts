import type { VercelRequest, VercelResponse } from '@vercel/node';
import { qontoFetch } from '../_lib/qonto.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  if (!process.env.QONTO_API_KEY) return res.status(400).json({ error: 'Qonto non configuré' });
  try {
    const data = await qontoFetch(`/organizations/${process.env.QONTO_SLUG}`);
    const org = data.organization;
    res.json({
      name: org.legal_name,
      slug: org.slug,
      bank_accounts: org.bank_accounts.map((ba: any) => ({
        slug: ba.slug,
        iban: ba.iban,
        bic: ba.bic,
        balance: ba.balance,
        balance_cents: ba.balance_cents,
        currency: ba.currency,
        name: ba.name,
        status: ba.status,
      })),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
