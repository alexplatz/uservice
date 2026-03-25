import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  jwt: string,
}

type AuthAction = {
  setJwt: (jwt: AuthState['jwt']) => void
}

export const useAuthStore = create<AuthState & AuthAction>()(
  persist(
    (set) => ({
      jwt: '',
      setJwt: (jwt) => set(() => ({ jwt: jwt })),
    }),
    { name: 'auth-storage' }
  )
)

