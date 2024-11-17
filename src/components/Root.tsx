import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'

export function Root() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}
