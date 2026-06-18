import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PostCard from '../components/PostCard'
import NewsletterCTA from '../components/NewsletterCTA'
import { posts } from '../lib/posts'

export default function Blog() {
  return (
    <div className="bg-black min-h-screen">
      <nav className="px-6 py-6">
        <Navbar />
      </nav>

      <header className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-12 md:pb-16 relative overflow-hidden">
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

      <main className="max-w-6xl mx-auto px-6 pb-28 md:pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.map((p, i) => (
            <PostCard key={p.slug} post={p} index={i} />
          ))}
        </div>
      </main>

      <NewsletterCTA />
      <Footer />
    </div>
  )
}
