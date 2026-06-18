import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only handler so the newsletter works under `npm run dev`
// (in production, /api/subscribe is served by the Vercel function in /api).
function newsletterDevApi(): Plugin {
  return {
    name: 'newsletter-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/subscribe', async (req, res) => {
        const json = (code: number, body: unknown) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }
        if (req.method !== 'POST') return json(405, { error: 'Method not allowed' })
        let raw = ''
        for await (const chunk of req) raw += chunk
        try {
          const { email } = JSON.parse(raw || '{}') as { email?: string }
          const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')
          if (!valid) return json(400, { error: 'Please enter a valid email address.' })

          const key = process.env.BUTTONDOWN_API_KEY
          if (key) {
            const r = await fetch('https://api.buttondown.email/v1/subscribers', {
              method: 'POST',
              headers: { Authorization: `Token ${key}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ email_address: email }),
            })
            if (!r.ok && r.status !== 201 && r.status !== 200) {
              return json(502, { error: 'Subscription provider rejected the request.' })
            }
          } else {
            // No provider configured: persist locally so you can see it working in dev.
            const fs = await import('node:fs')
            const file = 'subscribers.json'
            const list: string[] = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : []
            if (!list.includes(email!)) {
              list.push(email!)
              fs.writeFileSync(file, JSON.stringify(list, null, 2))
            }
          }
          return json(200, { ok: true, message: 'Subscribed' })
        } catch {
          return json(400, { error: 'Bad request.' })
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), newsletterDevApi()],
})
