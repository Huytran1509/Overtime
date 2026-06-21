import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PostCard from '../components/PostCard'
import NewsletterCTA from '../components/NewsletterCTA'
import { posts } from '../lib/posts'

// Preferred order for the filter tabs. Only tabs that actually have
// posts will be shown, so there are never empty categories.
const ORDER = ['Football', 'Badminton', 'Tennis', 'Esports', 'Trending']

export default function Blog() {
  const [active, setActive] = useState('All')

  const tabs = useMemo(() => {
    const present = new Set(posts.map((p) => p.category))
    const known = ORDER.filter((c) => present.has(c))
    // Show "All" plus only the five sport categories that actually have posts.
    // Older one-off stories still appear under "All".
    return ['All', ...known]
  }, [])

  const visible = useMemo(
    () => (active === 'All' ? posts : posts.filter((p) => p.category === active)),
    [active]
  )

  return (
    <div className="bg-black min-h-screen">
      <nav className="px-6 py-6">
        <Navbar />
      </nav>

      <header className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-8 md:pb-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04)_0%,_transparent_70%)]" />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white/40 text-sm tracking-widest uppercase mb-5 relative"
        >
          All stories
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl text-white tracking-tight font-serif relative"
        >
          The <em className="italic">whole</em> game.
        </motion.h1>
      </header>

      {/* Category filter tabs */}
      <div className="max-w-6xl mx-auto px-6 pb-10 md:pb-12">
        <div className="flex flex-wrap gap-2 md:gap-3">
          {tabs.map((tab) => {
            const isActive = tab === active
            return (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={
                  'rounded-full px-4 py-2 text-sm tracking-wide transition-colors ' +
                  (isActive
                    ? 'bg-white text-black'
                    : 'liquid-glass text-white/70 hover:text-white')
                }
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 pb-28 md:pb-40">
        {visible.length === 0 ? (
          <p className="text-white/40 text-center py-20">No stories in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {visible.map((p, i) => (
              <PostCard key={p.slug} post={p} index={i} />
            ))}
          </div>
        )}
      </main>

      <NewsletterCTA />
      <Footer />
    </div>
  )
}
