import { createContext, useContext, useEffect, useState } from 'react'
import { 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (displayName: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      user?.getIdTokenResult().then((tokenResult) => {
        if (tokenResult.claims.admin) {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
        }
      })
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const tokenResult = await result.user.getIdTokenResult()
      
      if (tokenResult.claims.admin) {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      navigate('/')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const updateUserProfile = async (displayName: string) => {
    if (!user) return

    try {
      await updateProfile(user, { displayName })
      // Força a atualização do estado para refletir as mudanças
      setUser({ ...user, displayName })
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signInWithGoogle, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
