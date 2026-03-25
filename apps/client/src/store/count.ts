import { persist } from 'zustand/middleware'
import { create } from 'zustand'

type State = {
  counter: number
}

type Action = {
  increment: (counter: State['counter']) => void
  decrement: (counter: State['counter']) => void
  incrementBy: (increment: number, counter: State['counter']) => void
}

export const useCounterStore = create<State & Action>()(
  persist(
    (set) => ({
      counter: 0,
      increment: () => set((state) => ({ counter: state.counter += 1 })),
      decrement: () => set((state) => ({ counter: state.counter -= 1 })),
      incrementBy: (increment) => set((state) => ({ counter: state.counter += increment }))

    }),
    { name: 'counter-store' }
  )
)

