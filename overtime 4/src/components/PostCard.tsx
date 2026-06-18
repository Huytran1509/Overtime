import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { coverFor, type Post } from '../lib/posts'

export default function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  const [imgOk, setImgOk] = useState(true)
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.08 }}
    >
      <Link to={`/blog/${post.slug}`} className="liquid-glass rounded-3xl overflow-hidden group block h-full">
        <div className="relative aspect-[16/10] overflow-hidden">
          {/* gradient fallback sits underneath */}
          <div className="absolute inset-0" style={{ background: coverFor(post.category) }} />
          {post.cover && imgOk && (
            <img
              src={post.cover}
              alt={post.title}
              loading="lazy"
              onError={() => setImgOk(false)}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute top-4 left-4 text-white/90 text-xs tracking-widest uppercase liquid-glass rounded-full px-3 py-1">
            {post.category}
          </span>
        </div>
        <div className="p-6 md:p-7">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-white text-xl md:text-2xl tracking-tight leading-tight">{post.title}</h3>
            <span className="liquid-glass rounded-full p-2 shrink-0 transition-transform group-hover:rotate-45">
              <ArrowUpRight size={16} className="text-white" />
            </span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed mb-4">{post.excerpt}</p>
          <p className="text-white/30 text-xs tracking-widest uppercase">
            {post.author} · {post.readingTime} min
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
