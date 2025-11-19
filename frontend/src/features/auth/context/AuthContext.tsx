import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Member } from '../types/member.types'

interface AuthContextType {
  currentUser: Member | null
  login: (user: Member) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Member | null>(null)

  const login = (user: Member) => {
    setCurrentUser(user)
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const isAuthenticated = currentUser !== null

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
