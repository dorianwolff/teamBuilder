import { create } from 'zustand'
import type { GameRoom, DraftState, BattleState } from '@/types/game'

interface GameState {
  room: GameRoom | null
  draftState: DraftState | null
  battleState: BattleState | null
  isConnected: boolean
  timerRemaining: number

  setRoom: (room: GameRoom | null) => void
  setDraftState: (state: DraftState | null) => void
  setBattleState: (state: BattleState | null) => void
  setConnected: (v: boolean) => void
  setTimerRemaining: (v: number) => void
  reset: () => void
}

const initialState = {
  room: null,
  draftState: null,
  battleState: null,
  isConnected: false,
  timerRemaining: 0,
}

export const useGameStore = create<GameState>((set) => ({
  ...initialState,
  setRoom: (room) => set({ room }),
  setDraftState: (draftState) => set({ draftState }),
  setBattleState: (battleState) => set({ battleState }),
  setConnected: (isConnected) => set({ isConnected }),
  setTimerRemaining: (timerRemaining) => set({ timerRemaining }),
  reset: () => set(initialState),
}))
