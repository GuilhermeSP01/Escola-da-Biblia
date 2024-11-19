import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Header from './Header'

export default function AdminLayout() {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}