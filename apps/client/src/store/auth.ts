import { create } from 'zustand'

type AuthState = {
  jwt: string,
  refreshToken: string,
}

type AuthAction = {
  setJwt: (jwt: AuthState['jwt']) => void
  setRefreshToken: (refreshToken: AuthState['refreshToken']) => void
}

export const useAuthStore = create<AuthState & AuthAction>((set) => ({
  jwt: '',
  refreshToken: '',
  user: { id: '', username: '' },
  setJwt: (jwt) => set(() => ({ jwt: jwt })),
  setRefreshToken: (refreshToken) => set(() => ({ refreshToken: refreshToken })),
}))

