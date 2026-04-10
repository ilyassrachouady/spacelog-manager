import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.json({
    stripe: !!process.env.STRIPE_SECRET_KEY,
    qonto: !!process.env.QONTO_API_KEY,
    pennylane: !!process.env.PENNYLANE_API_KEY,
  });
}
