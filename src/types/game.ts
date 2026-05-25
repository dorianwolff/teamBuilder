import type { Character, Verse } from './character'

export type GameMode = 'ranked' | 'casual'

export type RoomStatus =
  | 'waiting'       // waiting for second player
  | 'drafting'      // draft phase
  | 'battling'      // battle phase
  | 'finished'      // game over
  | 'abandoned'

export type DraftPhase = 'picking' | 'waiting' | 'complete'

export type BattlePhase = 'selecting' | 'resolving' | 'result' | 'complete'

// ─── Draft ──────────────────────────────────────────────────────────────────

export interface DraftPick {
  round: number           // 1–5
  picker_id: string       // user id of who must pick
  picked_character_id: string | null
  picked_at: string | null
  was_masked: boolean
}

export interface PlayerDraftState {
  user_id: string
  characters: Character[] // their 5 picks (accumulated)
  power_sum: number       // sum of power_level of current picks
}

export interface DraftState {
  room_id: string
  verse: Verse | 'all'
  current_round: number       // 1–5
  current_picker_id: string
  draft_pool: DraftPoolSlot[] // 10 cards (5 revealed, 5 masked — ratio set at game start)
  player_a: PlayerDraftState
  player_b: PlayerDraftState
  picks: DraftPick[]
  timer_ends_at: string       // ISO timestamp
  phase: DraftPhase
}

export interface DraftPoolSlot {
  position: number            // 0–9
  character: Character | null // null if masked and not yours
  is_masked: boolean
  is_picked: boolean
  picked_by: string | null    // user_id
}

// ─── Battle ─────────────────────────────────────────────────────────────────

export interface BattleRound {
  round_number: number      // 1–3 (first to 3 wins)
  player_a_pick: string | null  // character id
  player_b_pick: string | null
  winner_id: string | null  // user_id or null (should not happen)
  effective_score_a: number
  effective_score_b: number
  modifiers_applied: BattleModifier[]
  resolved_at: string | null
  phase: BattlePhase
  timer_ends_at: string
}

export interface BattleModifier {
  source: 'strength' | 'weakness' | 'cannot_win' | 'draw'
  tag?: string
  character_slug?: string
  description: string
  score_delta_a: number
  score_delta_b: number
}

export interface BattleState {
  room_id: string
  player_a: BattlePlayerState
  player_b: BattlePlayerState
  rounds: BattleRound[]
  current_round: number
  scores: { a: number; b: number }   // match points (max 3 each)
  phase: BattlePhase
  winner_id: string | null
  rematch_votes?: string[]           // user IDs that voted to play again (casual only)
}

export interface BattlePlayerState {
  user_id: string
  remaining_characters: Character[]  // decreases each round
  selected_character: string | null  // character id for current round
  confirmed: boolean
}

// ─── Room ────────────────────────────────────────────────────────────────────

export interface GameRoom {
  id: string
  code: string            // 6-char invite code for casual
  mode: GameMode
  verse: Verse | 'all'
  status: RoomStatus
  player_a_id: string
  player_b_id: string | null
  draft_state: DraftState | null
  battle_state: BattleState | null
  winner_id: string | null
  elo_delta_a: number | null
  elo_delta_b: number | null
  created_at: string
  started_at: string | null
  finished_at: string | null
}

// ─── Matchmaking ─────────────────────────────────────────────────────────────

export interface MatchmakingEntry {
  user_id: string
  elo: number
  verse: Verse | 'all'
  joined_at: string
  status: 'waiting' | 'matched' | 'cancelled'
}

// ─── ELO ─────────────────────────────────────────────────────────────────────

export interface EloResult {
  new_elo_a: number
  new_elo_b: number
  delta_a: number
  delta_b: number
}

// ─── Verse unlock thresholds ─────────────────────────────────────────────────

export const VERSE_UNLOCK_ELO: Record<Verse | 'all', number> = {
  one_piece: 0,     // always unlocked
  naruto:    1000,  // default starting elo — unlocked from start
  dbz:       1200,
  hxh:       1400,
  all:       1600,  // cross-verse — unlocked at 1600
}
