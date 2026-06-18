import NewsletterForm from './NewsletterForm'

export default function NewsletterCTA() {
  return (
    <section className="bg-black px-6 pb-28 md:pb-40">
      <div className="max-w-6xl mx-auto liquid-glass rounded-3xl p-8 md:p-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.05)_0%,_transparent_70%)]" />
        <div className="relative">
          <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Newsletter</p>
          <h2 className="text-3xl md:text-5xl text-white tracking-tight font-serif mb-4">
            Get the slow frame, weekly.
          </h2>
          <p className="text-white/50 text-sm md:text-base max-w-md mx-auto mb-8">
            One cinematic story every Friday. No scores, no spam — just the moments worth replaying.
          </p>
          <NewsletterForm className="max-w-md mx-auto text-left" />
        </div>
      </div>
    </section>
  )
}
