import { Outlet } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { DatabaseProvider } from '../contexts/DatabaseContext'

export function Root() {
  return (
    <AuthProvider>
      <DatabaseProvider>
        <Outlet />
      </DatabaseProvider>
    </AuthProvider>
  )
}
