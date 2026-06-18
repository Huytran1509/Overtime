import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PostCard from './PostCard'
import { posts } from '../lib/posts'

export default function LatestStories() {
  const latest = posts.slice(0, 3)
  return (
    <section className="bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between mb-12 md:mb-16"
        >
          <div>
            <p className="text-white/40 text-xs tracking-widest uppercase mb-3">From the desk</p>
            <h2 className="text-3xl md:text-5xl text-white tracking-tight">Latest stories</h2>
          </div>
          <Link to="/blog" className="liquid-glass rounded-full px-6 py-3 text-white text-sm font-medium hidden md:block">
            View all
          </Link>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {latest.map((p, i) => (
            <PostCard key={p.slug} post={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
