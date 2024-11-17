import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import Dashboard from '../pages/dashboard'
import Form from '../pages/form/[id]'
import Profile from '../pages/profile'
import AuthLayout from '../components/layout/AuthLayout'

export const router = createBrowserRouter([
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
])
