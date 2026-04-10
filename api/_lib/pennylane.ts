const PENNYLANE_BASE = 'https://app.pennylane.com/api/external/v1';

export async function pennylaneFetch(endpoint: string) {
  const res = await fetch(`${PENNYLANE_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${process.env.PENNYLANE_API_KEY}`,
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pennylane ${res.status}: ${text}`);
  }
  return res.json();
}
