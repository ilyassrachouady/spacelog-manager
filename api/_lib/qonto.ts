const QONTO_BASE = 'https://thirdparty.qonto.com/v2';

export async function qontoFetch(endpoint: string) {
  const res = await fetch(`${QONTO_BASE}${endpoint}`, {
    headers: { Authorization: `${process.env.QONTO_SLUG}:${process.env.QONTO_API_KEY}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Qonto ${res.status}: ${text}`);
  }
  return res.json();
}
