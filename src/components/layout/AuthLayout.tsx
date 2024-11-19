import { Outlet, Navigate } from 'react-router-dom'
import Header from './Header'
import { useAuth } from '../../contexts/AuthContext'
import Loading from '../common/Loading'

export default function AuthLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return <Navigate to="/" />
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
