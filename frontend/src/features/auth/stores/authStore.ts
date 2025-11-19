import { create } from 'zustand'
import type { Member } from '../types/member.types'

interface AuthStore {
  currentUser: Member | null
  isAuthenticated: boolean
  login: (user: Member) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  login: (user) => set({ currentUser: user, isAuthenticated: true }),
  logout: () => set({ currentUser: null, isAuthenticated: false }),
}))

// beforeLoad에서 사용할 getter 함수
export const getAuthState = () => useAuthStore.getState()
