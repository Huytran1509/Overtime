import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-sm">
        <div>
          <span className="text-white font-semibold">Overtime</span> — Feel every game. © 2026
        </div>
        <div className="flex gap-6">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/blog" className="hover:text-white">Stories</Link>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  )
}
