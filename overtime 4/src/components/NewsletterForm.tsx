import { useState, type KeyboardEvent } from 'react'
import { ArrowRight, Check, Loader2 } from 'lucide-react'

const ENDPOINT =
  (import.meta.env as Record<string, string | undefined>).VITE_NEWSLETTER_ENDPOINT ||
  '/api/subscribe'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function NewsletterForm({ className = '' }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const submit = async () => {
    if (status === 'loading' || status === 'success') return
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!valid) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error || 'Something went wrong.')
      }
      setStatus('success')
      setMessage("You're in. Look out for the first story on Friday.")
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Network error. Please try again.')
    }
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
  }

  const busy = status === 'loading' || status === 'success'

  return (
    <div className={className}>
      <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          onKeyDown={onKey}
          placeholder="Enter your email"
          disabled={busy}
          className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40 text-sm disabled:opacity-60"
          aria-label="Email address"
        />
        <button
          onClick={submit}
          disabled={busy}
          className="bg-white rounded-full p-3 text-black disabled:opacity-70 transition-opacity"
          aria-label="Subscribe"
        >
          {status === 'loading' ? (
            <Loader2 size={20} className="animate-spin" />
          ) : status === 'success' ? (
            <Check size={20} />
          ) : (
            <ArrowRight size={20} />
          )}
        </button>
      </div>
      {message && (
        <p
          role="status"
          aria-live="polite"
          className={`text-sm mt-3 px-2 ${
            status === 'success'
              ? 'text-emerald-300/80'
              : status === 'error'
                ? 'text-red-300/80'
                : 'text-white/50'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}
