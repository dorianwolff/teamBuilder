import type { Character } from '@/types/character'
import type { DraftPoolSlot, DraftState, PlayerDraftState } from '@/types/game'

export const DRAFT_ROUNDS = 5
export const DRAFT_TIMER_SECONDS = 30
export const POOL_SIZE = 10  // characters revealed per draft
export const MASKED_COUNT = 5 // half are masked at start

/**
 * Build the initial draft pool from a shuffled list of characters.
 * Exactly MASKED_COUNT slots are masked; rest are revealed.
 */
export function buildDraftPool(characters: Character[]): DraftPoolSlot[] {
  const shuffled = [...characters].sort(() => Math.random() - 0.5).slice(0, POOL_SIZE)
  // Decide which positions are masked (random)
  const maskedPositions = new Set<number>()
  while (maskedPositions.size < MASKED_COUNT) {
    maskedPositions.add(Math.floor(Math.random() * POOL_SIZE))
  }

  return shuffled.map((char, i) => ({
    position: i,
    character: char,
    is_masked: maskedPositions.has(i),
    is_picked: false,
    picked_by: null,
  }))
}

/**
 * Returns the user_id of who picks in a given round.
 *
 * Draft order for 5 rounds:
 *   Round 1: Player A picks
 *   Round 2: Player B picks
 *   Round 3: Player A picks
 *   Round 4: Player B picks
 *   Round 5: The player whose current power_sum is LOWER picks first
 *            (if equal → random)
 */
export function getPickerForRound(
  round: number,
  playerAId: string,
  playerBId: string,
  stateA: PlayerDraftState,
  stateB: PlayerDraftState,
): string {
  if (round <= 4) {
    return round % 2 === 1 ? playerAId : playerBId
  }
  // Round 5 — loser (lower power sum) picks first
  if (stateA.power_sum < stateB.power_sum) return playerAId
  if (stateB.power_sum < stateA.power_sum) return playerBId
  return Math.random() < 0.5 ? playerAId : playerBId
}

/**
 * Apply a pick: assign the chosen slot to the picker, assign remaining
 * unpicked slots' pair to the opponent. Returns updated draft state.
 *
 * When a player picks a slot, the OTHER slot that was "paired" with it
 * (the one not chosen) goes to the opponent automatically.
 *
 * For rounds 1–5: each round the picker sees two options (one revealed, one
 * masked). They pick one; the other goes to the opponent.
 */
export function applyPick(
  state: DraftState,
  pickerUserId: string,
  chosenPosition: number,
): DraftState {
  const slot = state.draft_pool[chosenPosition]
  if (!slot || slot.is_picked) throw new Error('Invalid pick position')

  // Find the unpicked pair slot (the one the picker didn't choose)
  // Pairing: positions 0&1, 2&3, 4&5, 6&7, 8&9
  const pairPosition = chosenPosition % 2 === 0 ? chosenPosition + 1 : chosenPosition - 1
  const pairSlot = state.draft_pool[pairPosition]

  const opponentId = pickerUserId === state.player_a.user_id
    ? state.player_b.user_id
    : state.player_a.user_id

  const updatedPool = state.draft_pool.map(s => {
    if (s.position === chosenPosition) {
      return { ...s, is_picked: true, picked_by: pickerUserId }
    }
    if (s.position === pairPosition && pairSlot && !pairSlot.is_picked) {
      return { ...s, is_picked: true, picked_by: opponentId }
    }
    return s
  })

  // Update player states
  const chosenChar = slot.character!
  const pairChar   = pairSlot?.character ?? null

  function addCharToPlayer(player: PlayerDraftState, char: Character | null): PlayerDraftState {
    if (!char) return player
    return {
      ...player,
      characters: [...player.characters, char],
      power_sum: player.power_sum + char.power_level,
    }
  }

  const updatedPlayerA = pickerUserId === state.player_a.user_id
    ? addCharToPlayer(state.player_a, chosenChar)
    : addCharToPlayer(state.player_a, pairChar)

  const updatedPlayerB = pickerUserId === state.player_b.user_id
    ? addCharToPlayer(state.player_b, chosenChar)
    : addCharToPlayer(state.player_b, pairChar)

  const nextRound = state.current_round + 1
  const nextPicker = nextRound <= DRAFT_ROUNDS
    ? getPickerForRound(nextRound, state.player_a.user_id, state.player_b.user_id, updatedPlayerA, updatedPlayerB)
    : ''

  return {
    ...state,
    draft_pool: updatedPool,
    player_a: updatedPlayerA,
    player_b: updatedPlayerB,
    current_round: nextRound,
    current_picker_id: nextPicker,
    phase: nextRound > DRAFT_ROUNDS ? 'complete' : 'picking',
  }
}

/**
 * Returns the visible draft pool for a given viewer.
 * Masked cards picked by the opponent are hidden (character = null).
 * Masked cards picked by the viewer ARE revealed to them.
 */
export function getVisiblePool(
  pool: DraftPoolSlot[],
  viewerUserId: string,
): DraftPoolSlot[] {
  return pool.map(slot => {
    // If the slot is masked AND was picked by the opponent → hide character
    if (slot.is_masked && slot.picked_by && slot.picked_by !== viewerUserId) {
      return { ...slot, character: null }
    }
    return slot
  })
}
