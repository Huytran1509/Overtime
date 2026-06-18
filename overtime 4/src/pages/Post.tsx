import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PostCard from '../components/PostCard'
import NewsletterCTA from '../components/NewsletterCTA'
import { getPost, coverFor, posts } from '../lib/posts'

export default function Post() {
  const { slug } = useParams()
  const post = getPost(slug)
  const [imgOk, setImgOk] = useState(true)

  if (!post) return <Navigate to="/blog" replace />

  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3)
  const dateStr = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="bg-black min-h-screen">
      <nav className="px-6 py-6">
        <Navbar />
      </nav>

      <header className="relative">
        <div className="max-w-4xl mx-auto px-6 pt-10 md:pt-16">
          <Link to="/blog" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8">
            <ArrowLeft size={16} /> All stories
          </Link>
          <p className="text-white/40 text-xs tracking-widest uppercase mb-5">
            {post.category} · {dateStr} · {post.readingTime} min read
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl text-white tracking-tight font-serif leading-[1.05] mb-6"
          >
            {post.title}
          </motion.h1>
          <p className="text-white/60 text-lg leading-relaxed mb-8">{post.excerpt}</p>
        </div>

        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="rounded-3xl overflow-hidden aspect-[16/9] relative"
            style={{ background: coverFor(post.category) }}
          >
            {post.cover && imgOk && (
              <img
                src={post.cover}
                alt={post.title}
                onError={() => setImgOk(false)}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </motion.div>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-white prose-a:text-white prose-strong:text-white prose-blockquote:border-l-white/30 prose-blockquote:text-white/70 prose-blockquote:font-serif prose-blockquote:italic">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-white/40 text-sm">
          Written by <span className="text-white">{post.author}</span>
        </div>
      </article>

      <section className="max-w-6xl mx-auto px-6 pb-20 md:pb-28">
        <h2 className="text-2xl md:text-3xl text-white tracking-tight mb-8">More stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {more.map((p, i) => (
            <PostCard key={p.slug} post={p} index={i} />
          ))}
        </div>
      </section>

      <NewsletterCTA />
      <Footer />
    </div>
  )
}
