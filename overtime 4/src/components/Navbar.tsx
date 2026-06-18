import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'

export default function Navbar() {
  return (
    <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <Trophy size={24} className="text-white" />
          <span className="text-white font-semibold text-lg ml-2">Overtime</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 ml-8">
          <Link to="/blog" className="text-white/80 hover:text-white text-sm font-medium">Stories</Link>
          <Link to="/blog" className="text-white/80 hover:text-white text-sm font-medium">Scores</Link>
          <Link to="/" className="text-white/80 hover:text-white text-sm font-medium">About</Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-white text-sm font-medium">Sign Up</button>
        <button className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium">Login</button>
      </div>
    </div>
  )
}
