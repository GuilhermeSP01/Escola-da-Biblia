import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/public/home'
import Dashboard from '../pages/auth/dashboard'
import Form from '../pages/auth/form/[id]'
import Profile from '../pages/auth/profile'
import AuthLayout from '../components/layout/AuthLayout'
import AdminLayout from '../components/layout/AdminLayout'
import { Root } from '../components/Root'
import Admin from '../pages/admin/dashboard'
import Turmas from '../pages/admin/turmas'
import Users from '../pages/admin/users'
import TurmaDetails from '../pages/admin/turmas/[id]'
import AulaQuestoes from '../pages/admin/turmas/aula/[id]'

export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />,
          },
          {
            path: '/form/:id',
            element: <Form />,
          },
          {
            path: '/profile',
            element: <Profile />,
          },
        ],
      },
      {
        element: <AdminLayout />,
        children: [
          {
            path: '/admin',
            element: <Admin />,
          },
          {
            path: '/admin/users',
            element: <Users />,
          },
          {
            path: '/admin/turmas',
            element: <Turmas />,
          },
          {
            path: '/admin/turmas/:id',
            element: <TurmaDetails />,
          },
          {
            path: '/admin/turmas/:id/aula/:aulaId',
            element: <AulaQuestoes />,
          },
        ],
      },
    ],
  },
])
