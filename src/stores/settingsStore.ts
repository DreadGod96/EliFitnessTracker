
import { create } from 'zustand'

type SettingsState = {
  units: 'lb' | 'kg'
  restIncrementSeconds: number
  setUnits: (u: 'lb'|'kg') => void
  setRestIncrement: (s: number) => void
}

const useSettingsStore = create<SettingsState>((set) => ({
  units: 'lb',
  restIncrementSeconds: 15,
  setUnits: (units) => set({ units }),
  setRestIncrement: (restIncrementSeconds) => set({ restIncrementSeconds }),
}))

export default useSettingsStore
