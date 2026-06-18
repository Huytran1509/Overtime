// Vercel Serverless Function — POST /api/subscribe
// Local dev is handled by the Vite middleware in vite.config.ts instead.
//
// Set BUTTONDOWN_API_KEY in your Vercel project env to forward subscribers to
// Buttondown. Swap the fetch below for Mailchimp/ConvertKit/etc. if you prefer.

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const email: string | undefined = body.email
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')
    if (!valid) {
      res.status(400).json({ error: 'Please enter a valid email address.' })
      return
    }

    const key = process.env.BUTTONDOWN_API_KEY
    if (key) {
      const r = await fetch('https://api.buttondown.email/v1/subscribers', {
        method: 'POST',
        headers: { Authorization: `Token ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_address: email }),
      })
      if (!r.ok && r.status !== 201 && r.status !== 200) {
        res.status(502).json({ error: 'Subscription provider rejected the request.' })
        return
      }
    }
    // No provider configured: accept so the flow works end-to-end. Wire a provider
    // or a database here for real persistence in production.
    res.status(200).json({ ok: true, message: 'Subscribed' })
  } catch {
    res.status(400).json({ error: 'Bad request.' })
  }
}
