import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-4 shadow-lg">
      <nav className="container mx-auto flex justify-between items-center px-6">
        <Link 
          to="/dashboard" 
          className="text-2xl font-bold flex items-center gap-2 transition-colors duration-300"
        >
          <span>Escola da Bíblia</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-8">
          <Link to="https://wa.me/5513996013905" className="hover:text-yellow-400 transition-colors duration-300 font-medium">
            Fale conosco
          </Link>
          <Link to="/dashboard" className="hover:text-yellow-400 transition-colors duration-300 font-medium">
            Aulas
          </Link>
          <Link to="/profile" className="hover:text-yellow-400 transition-colors duration-300 font-medium">
            Perfil
          </Link>
        </div>

        {/* Mobile Dropdown */}
        <div className="lg:hidden relative" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
              <div className="py-2">
                <Link
                  to="https://wa.me/5513996013905"
                  className="block px-6 py-3 text-base text-white hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Fale conosco
                </Link>
                <Link
                  to="/dashboard"
                  className="block px-6 py-3 text-base text-white hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Aulas
                </Link>
                <Link
                  to="/profile"
                  className="block px-6 py-3 text-base text-white hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Perfil
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
