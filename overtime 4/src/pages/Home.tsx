import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Twitter, Globe } from 'lucide-react'
import Navbar from '../components/Navbar'
import AboutSection from '../components/AboutSection'
import FeaturedVideoSection from '../components/FeaturedVideoSection'
import PhilosophySection from '../components/PhilosophySection'
import ServicesSection from '../components/ServicesSection'
import LatestStories from '../components/LatestStories'
import NewsletterForm from '../components/NewsletterForm'
import NewsletterCTA from '../components/NewsletterCTA'
import Footer from '../components/Footer'

// NOTE: third-party placeholder video — replace with your own sports footage before launch.
const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4'

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Seamless looping hero video with JS-driven crossfade to black.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    let raf = 0

    const animateOpacity = (from: number, to: number, dur: number) => {
      cancelAnimationFrame(raf)
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1)
        v.style.opacity = String(from + (to - from) * p)
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const onCanPlay = () => {
      v.play().catch(() => {})
      animateOpacity(0, 1, 500)
    }
    const onTimeUpdate = () => {
      if (v.duration && v.duration - v.currentTime <= 0.55) {
        animateOpacity(parseFloat(v.style.opacity || '1'), 0, 500)
      }
    }
    const onEnded = () => {
      v.style.opacity = '0'
      setTimeout(() => {
        v.currentTime = 0
        v.play().catch(() => {})
        animateOpacity(0, 1, 500)
      }, 100)
    }

    v.addEventListener('canplay', onCanPlay)
    v.addEventListener('timeupdate', onTimeUpdate)
    v.addEventListener('ended', onEnded)
    return () => {
      cancelAnimationFrame(raf)
      v.removeEventListener('canplay', onCanPlay)
      v.removeEventListener('timeupdate', onTimeUpdate)
      v.removeEventListener('ended', onEnded)
    }
  }, [])

  return (
    <div className="bg-black">
      {/* ============ HERO ============ */}
      <section className="min-h-screen overflow-hidden relative flex flex-col">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover object-bottom"
          style={{ opacity: 0 }}
          muted
          autoPlay
          playsInline
          preload="auto"
          src={HERO_VIDEO}
        />

        <nav className="relative z-20 px-6 py-6">
          <Navbar />
        </nav>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
          <h1 className="text-7xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap font-serif">
            Feel <em className="italic">every</em> game.
          </h1>

          <NewsletterForm className="max-w-xl w-full mt-8" />

          <p className="text-white text-sm leading-relaxed px-4 mt-5 max-w-xl">
            Stay on top of every match, transfer and headline. Subscribe to our newsletter and never miss a moment of the season.
          </p>

          <Link
            to="/blog"
            className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors mt-8"
          >
            Read the stories
          </Link>
        </div>

        <div className="relative z-10 flex justify-center gap-4 pb-12">
          <button className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all" aria-label="Instagram">
            <Instagram size={20} />
          </button>
          <button className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all" aria-label="Twitter">
            <Twitter size={20} />
          </button>
          <button className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all" aria-label="Website">
            <Globe size={20} />
          </button>
        </div>
      </section>

      <AboutSection />
      <FeaturedVideoSection />
      <PhilosophySection />
      <ServicesSection />
      <LatestStories />
      <NewsletterCTA />
      <Footer />
    </div>
  )
}
