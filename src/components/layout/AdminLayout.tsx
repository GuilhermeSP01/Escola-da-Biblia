import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Header from './Header'
import Loading from '../common/Loading'

export default function AdminLayout() {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return <Navigate to="/" />
  }

  if (!isAdmin) {
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
