import type { emailData } from '@/types'
import { create } from 'zustand'

type UserState = {
  id: string,
  username: string,
  emails: emailData[]
}

type UserAction = {
  setId: (id: UserState['id']) => void
  setUsername: (username: UserState['username']) => void
  setEmails: (emails: UserState['emails']) => void
}

export const useUserStore = create<UserState & UserAction>((set) => ({
  id: '',
  username: '',
  emails: [],
  setId: (id: string) => set(() => ({ id: id })),
  setUsername: (username: string) => set(() => ({ username: username })),
  setEmails: (emails: emailData[]) => set(() => ({ emails: emails }))
}))

