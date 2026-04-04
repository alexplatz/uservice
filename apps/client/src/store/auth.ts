import { create } from "zustand"

type AuthState = {
  jwt: string,
}

type AuthAction = {
  setJwt: (jwt: AuthState['jwt']) => void
}

export const useAuthStore = create<AuthState & AuthAction>()(
  (set) => ({
    jwt: '',
    setJwt: (jwt) => set(() => ({ jwt: jwt })),
  }),
)

