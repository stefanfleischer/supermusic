import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Home, Menu, X, Music, ListMusic, BookOpen } from 'lucide-react'

const navItems: Array<{
  to: string
  label: string
  icon: typeof Home
  search?: Record<string, string>
}> = [
  { to: '/', label: 'Home', icon: Home },
  {
    to: '/songs',
    label: 'Songs',
    icon: Music,
    search: { q: '', key: '', artist: '', tag: '', sort: 'title' },
  },
  { to: '/setlists', label: 'Setlists', icon: ListMusic },
  { to: '/books', label: 'Books', icon: BookOpen },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="p-4 flex items-center bg-gray-800 text-white shadow-lg">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-semibold">
          <Link to="/" className="flex items-center gap-2">
            <Music size={24} className="text-cyan-400" />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-bold">
              SuperMusic
            </span>
          </Link>
        </h1>

        {/* Desktop nav */}
        <nav className="hidden md:flex ml-8 gap-1">
          {navItems.slice(1).map((item) => (
            <Link
              key={item.to}
              to={item.to as '/'}
              search={item.search as any}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm"
              activeProps={{
                className:
                  'flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-600 text-white transition-colors text-sm',
              }}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Music size={20} className="text-cyan-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              SuperMusic
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to as '/'}
              search={item.search as any}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-1"
              activeProps={{
                className:
                  'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-1',
              }}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
