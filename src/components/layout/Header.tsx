import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">
          Escola da Bíblia
        </Link>
        <div className="flex gap-4">
          <Link to="/dashboard" className="hover:text-gray-300">
            Aulas
          </Link>
          <Link to="/profile" className="hover:text-gray-300">
            Perfil
          </Link>
        </div>
      </nav>
    </header>
  )
}
