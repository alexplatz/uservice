import type { emailData, passkeyData, sessionData } from '@/types'
import { create } from 'zustand'

type UserState = {
  id: string,
  username: string,
  emails: emailData[],
  passkeys: passkeyData[],
  sessions: sessionData[]
}

type UserAction = {
  setId: (id: UserState['id']) => void
  setUsername: (username: UserState['username']) => void
  setEmails: (emails: UserState['emails']) => void
  setPasskeys: (passkeys: UserState['passkeys']) => void
  setSessions: (sessions: UserState['sessions']) => void
}

export const useUserStore = create<UserState & UserAction>()(
  (set) => ({
    id: '',
    username: '',
    emails: [],
    passkeys: [],
    sessions: [],
    setId: (id: string) => set(() => ({ id: id })),
    setUsername: (username: string) => set(() => ({ username: username })),
    setEmails: (emails: emailData[]) => set(() => ({ emails: emails })),
    setPasskeys: (passkeys: passkeyData[]) => set(() => ({ passkeys: passkeys })),
    setSessions: (sessions: sessionData[]) => set(() => ({ sessions: sessions }))
  })
)

