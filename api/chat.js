// Dify API Proxy — Vercel Serverless Function
// Hides the Dify API key from the frontend
// Deploy: Set DIFY_API_KEY in Vercel environment variables

const DIFY_API_BASE = 'https://api.dify.ai/v1';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.DIFY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'DIFY_API_KEY not configured' });
  }

  const { query, conversation_id = '', user = 'anonymous' } = req.body || {};
  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'query is required' });
  }

  // Rate limit (simple IP-based, in-memory; for MVP only)
  // For production, use Vercel KV / Upstash Redis

  try {
    const difyRes = await fetch(`${DIFY_API_BASE}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: query.trim(),
        user: user,
        response_mode: 'streaming',
        conversation_id: conversation_id,
      }),
    });

    if (!difyRes.ok) {
      const errText = await difyRes.text();
      console.error('Dify error:', difyRes.status, errText);
      return res.status(difyRes.status).json({
        error: 'Dify API error',
        detail: errText.slice(0, 500),
      });
    }

    // Stream the response back to the client
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = difyRes.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);
      }
    } catch (e) {
      console.error('Stream error:', e);
    } finally {
      res.end();
    }
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
}
