import type { Verse } from './character'

export interface UserProfile {
  id: string               // matches supabase auth uid
  username: string
  avatar_url: string | null
  elo: number              // starts at 1000
  games_played: number
  games_won: number
  games_lost: number
  win_streak: number
  best_win_streak: number
  unlocked_verses: (Verse | 'all')[]
  discovered_characters: string[]  // character slugs seen in at least one game
  created_at: string
  updated_at: string
}

export interface LeaderboardEntry {
  rank: number
  user_id: string
  username: string
  avatar_url: string | null
  elo: number
  games_played: number
  win_rate: number
}

export type EloTier =
  | 'bronze'    // < 1200
  | 'silver'    // 1200–1499
  | 'gold'      // 1500–1799
  | 'platinum'  // 1800–2099
  | 'diamond'   // 2100–2399
  | 'legend'    // 2400+

export function getEloTier(elo: number): EloTier {
  if (elo < 1200) return 'bronze'
  if (elo < 1500) return 'silver'
  if (elo < 1800) return 'gold'
  if (elo < 2100) return 'platinum'
  if (elo < 2400) return 'diamond'
  return 'legend'
}

export const ELO_TIER_COLORS: Record<EloTier, string> = {
  bronze:   '#cd7f32',
  silver:   '#c0c0c0',
  gold:     '#fbbf24',
  platinum: '#e2e8f0',
  diamond:  '#67e8f9',
  legend:   '#a78bfa',
}

export const ELO_TIER_LABELS: Record<EloTier, string> = {
  bronze:   'Bronze',
  silver:   'Silver',
  gold:     'Gold',
  platinum: 'Platinum',
  diamond:  'Diamond',
  legend:   'Legend',
}
