import type { EloResult } from '@/types/game'

// K-factor tiers (chess.com inspired)
const K_PROVISIONAL = 40  // < 30 games
const K_STANDARD    = 20  // 30–1799 elo
const K_HIGH        = 10  // 1800+ elo

function getKFactor(elo: number, gamesPlayed: number): number {
  if (gamesPlayed < 30)  return K_PROVISIONAL
  if (elo >= 1800)       return K_HIGH
  return K_STANDARD
}

/**
 * Expected score for player A against player B.
 * Standard Elo expected score formula.
 */
function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
}

/**
 * Compute new Elo ratings after a match.
 *
 * scoreA: 1 = A won, 0 = A lost, 0.5 = draw
 *
 * This naturally handles:
 * - Gain more Elo when beating a higher-rated opponent (expected score is low)
 * - Lose less Elo when losing to a higher-rated opponent
 * - Need > 50% winrate to climb (standard Elo property)
 * - Beginners climb faster via higher K (K=40 for first 30 games)
 */
export function computeElo(
  ratingA: number,
  ratingB: number,
  scoreA: 0 | 0.5 | 1,
  gamesPlayedA: number,
  gamesPlayedB: number,
): EloResult {
  const scoreB = (1 - scoreA) as 0 | 0.5 | 1

  const kA = getKFactor(ratingA, gamesPlayedA)
  const kB = getKFactor(ratingB, gamesPlayedB)

  const expA = expectedScore(ratingA, ratingB)
  const expB = expectedScore(ratingB, ratingA)

  const deltaA = Math.round(kA * (scoreA - expA))
  const deltaB = Math.round(kB * (scoreB - expB))

  const newEloA = Math.max(100, ratingA + deltaA) // floor at 100
  const newEloB = Math.max(100, ratingB + deltaB)

  return {
    new_elo_a: newEloA,
    new_elo_b: newEloB,
    delta_a: deltaA,
    delta_b: deltaB,
  }
}

/**
 * Estimate Elo change preview (shown before a match so players know stakes).
 */
export function previewEloDelta(
  myRating: number,
  opponentRating: number,
  gamesPlayed: number,
): { if_win: number; if_loss: number } {
  const kMe = getKFactor(myRating, gamesPlayed)
  const exp  = expectedScore(myRating, opponentRating)
  return {
    if_win:  Math.round(kMe * (1   - exp)),
    if_loss: Math.round(kMe * (0   - exp)),
  }
}
