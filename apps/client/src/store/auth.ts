import { create } from 'zustand'

type AuthState = {
  jwt: string,
  refreshToken: string,
  user: userData
}

type userData = {
  username: string,
  email: string,
}

type AuthAction = {
  setJwt: (jwt: AuthState['jwt']) => void
  setRefreshToken: (refreshToken: AuthState['refreshToken']) => void
  setUser: (user: userData) => void
}

export const useAuthStore = create<AuthState & AuthAction>((set) => ({
  jwt: '',
  refreshToken: '',
  user: { username: '', email: '' },
  setJwt: (jwt) => set(() => ({ jwt: jwt })),
  setRefreshToken: (refreshToken) => set(() => ({ refreshToken: refreshToken })),
  setUser: (user) => set(() => ({ user: user }))
}))

