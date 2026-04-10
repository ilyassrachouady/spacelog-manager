import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pennylaneFetch } from '../_lib/pennylane.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!process.env.PENNYLANE_API_KEY) return res.status(400).json({ error: 'Pennylane non configuré' });
  try {
    const page = Number(req.query.page) || 1;
    const perPage = Math.min(Number(req.query.per_page) || 25, 100);
    const data = await pennylaneFetch(`/customer_invoices?page=${page}&per_page=${perPage}`);
    const invoices = (data.invoices || []).map((inv: any) => ({
      id: inv.id,
      invoice_number: inv.invoice_number,
      label: inv.label,
      amount: inv.amount ? parseFloat(inv.amount) : 0,
      currency: inv.currency,
      status: inv.status,
      date: inv.date,
      deadline: inv.deadline,
      customer: inv.customer?.name || inv.customer?.first_name || '',
      paid: inv.paid,
      remaining_amount: inv.remaining_amount ? parseFloat(inv.remaining_amount) : 0,
      file_url: inv.file_url || null,
      public_url: inv.public_url || null,
    }));
    res.json({ invoices, total_pages: data.total_pages, current_page: data.current_page });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
