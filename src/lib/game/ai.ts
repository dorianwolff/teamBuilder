import type { Character } from '@/types/character'
import type { DraftPoolSlot } from '@/types/game'
import { resolveBattle } from './battle'

export type AiDifficulty = 'easy' | 'medium' | 'hard'

export const AI_ID   = 'ai'
export const AI_NAME = 'TeamBuilder AI'

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

function pickStrongest(chars: Character[]): Character {
  return chars.reduce((best, c) => c.power_level > best.power_level ? c : best)
}

/**
 * Simulate every (ours × theirs) matchup and return the character from `ours`
 * that wins the most individual matchups.
 */
function pickBestMatchup(ours: Character[], theirs: Character[]): Character {
  let best     = ours[0]!
  let bestWins = -1

  for (const candidate of ours) {
    let wins = 0
    for (const opponent of theirs) {
      const r = resolveBattle(candidate, opponent)
      if (!r.is_draw && r.winner?.id === candidate.id) wins++
    }
    if (wins > bestWins) { bestWins = wins; best = candidate }
  }
  return best
}

/** Median power level of a character list (sorted ascending, middle index). */
function medianPower(chars: Character[]): number {
  if (chars.length === 0) return 0
  const sorted = [...chars].sort((a, b) => a.power_level - b.power_level)
  return sorted[Math.floor(sorted.length / 2)]!.power_level
}

/** Maximum power level across a character list. */
function maxPower(chars: Character[]): number {
  return Math.max(...chars.map(c => c.power_level))
}

/**
 * Choose one of two draft slots based on a power threshold.
 *
 * Priority order:
 *   1. Both visible and above threshold → pick the higher-power one
 *   2. One visible and above threshold → pick that one
 *   3. Neither visible card meets threshold → prefer the hidden slot
 *      (it might be above threshold — take the gamble)
 *   4. Both hidden or both below threshold → random
 */
function selectSlotByThreshold(
  slotA: DraftPoolSlot,
  slotB: DraftPoolSlot,
  threshold: number,
): number {
  const powerA = !slotA.is_masked && slotA.character ? slotA.character.power_level : null
  const powerB = !slotB.is_masked && slotB.character ? slotB.character.power_level : null

  const aGood = powerA !== null && powerA >= threshold
  const bGood = powerB !== null && powerB >= threshold

  // Both visible and good → prefer higher power
  if (aGood && bGood) return powerA! >= powerB! ? slotA.position : slotB.position
  if (aGood) return slotA.position
  if (bGood) return slotB.position

  // Visible card didn't meet threshold → gamble on the hidden one
  if (powerA === null && powerB !== null) return slotA.position
  if (powerB === null && powerA !== null) return slotB.position

  // Both hidden or both visible-but-below-threshold → random
  return Math.random() < 0.5 ? slotA.position : slotB.position
}

// ─────────────────────────────────────────────────────────────────────────────
// Draft pick
// ─────────────────────────────────────────────────────────────────────────────

export interface AiDraftOptions {
  pool:                DraftPoolSlot[]
  difficulty:          AiDifficulty
  currentRound:        number
  /** Full roster of characters in the verse(s) being played. */
  allVerseChars:       Character[]
  /** Characters the AI has already drafted. */
  aiTeam:              Character[]
  /** Player characters that were face-up when picked (observable by the AI). */
  playerRevealedChars: Character[]
}

export function aiDraftPick({
  pool,
  difficulty,
  currentRound,
  allVerseChars,
  aiTeam,
  playerRevealedChars,
}: AiDraftOptions): number {
  const pairStart = (currentRound - 1) * 2
  const slotA = pool[pairStart]
  const slotB = pool[pairStart + 1]
  if (!slotA || !slotB) return pairStart   // safety fallback

  switch (difficulty) {
    // ── Easy: fully random ───────────────────────────────────────────────────
    case 'easy':
      return Math.random() < 0.5 ? slotA.position : slotB.position

    // ── Medium: take face-up card only when power ≥ 50 % of verse max ────────
    case 'medium': {
      const threshold = maxPower(allVerseChars) * 0.5
      return selectSlotByThreshold(slotA, slotB, threshold)
    }

    // ── Hard: median-based; tightens threshold dynamically when losing ────────
    case 'hard': {
      const median = medianPower(allVerseChars)

      // Round 1 first pick: aim for the median
      if (currentRound === 1) {
        return selectSlotByThreshold(slotA, slotB, median)
      }

      // Subsequent picks: detect if AI is losing on known averages
      const aiAvg = aiTeam.length > 0
        ? aiTeam.reduce((s, c) => s + c.power_level, 0) / aiTeam.length
        : 0
      const playerAvg = playerRevealedChars.length > 0
        ? playerRevealedChars.reduce((s, c) => s + c.power_level, 0) / playerRevealedChars.length
        : 0
      const isLosing = aiTeam.length > 0 && playerRevealedChars.length > 0 && aiAvg < playerAvg

      let threshold: number
      if (!isLosing) {
        threshold = median
      } else {
        const max         = maxPower(allVerseChars)
        // roundsLeft: 3 at round 2, 0 at round 5
        const roundsLeft  = Math.max(0, 5 - currentRound)
        // lossGap: 0–1, how badly the AI is trailing (normalised to 25 % of max)
        const lossGap     = Math.min(1, (playerAvg - aiAvg) / (max * 0.25))
        // desperation: 0 early, 1 when almost out of picks
        const desperation = 1 - roundsLeft / 3
        const factor      = Math.min(1, Math.max(lossGap, desperation * 0.6))
        // Interpolate threshold from median → 75 % of max
        threshold = median + factor * (max * 0.75 - median)
      }

      return selectSlotByThreshold(slotA, slotB, threshold)
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Battle pick
// ─────────────────────────────────────────────────────────────────────────────

export interface AiBattleOptions {
  aiRemaining:      Character[]
  difficulty:       AiDifficulty
  scores:           { player: number; ai: number }
  /** Player's still-alive characters — required for hard matchup analysis. */
  playerRemaining?: Character[]
}

export function aiBattlePick({
  aiRemaining,
  difficulty,
  scores,
  playerRemaining,
}: AiBattleOptions): Character {
  if (aiRemaining.length === 0) throw new Error('[AI] No remaining characters')
  if (aiRemaining.length === 1) return aiRemaining[0]!

  switch (difficulty) {
    // ── Easy: fully random ───────────────────────────────────────────────────
    case 'easy':
      return pickRandom(aiRemaining)

    // ── Medium: random until match point, then 70 % strongest ────────────────
    case 'medium': {
      const matchPoint = scores.ai === 2 || scores.player === 2
      if (matchPoint && Math.random() < 0.7) return pickStrongest(aiRemaining)
      return pickRandom(aiRemaining)
    }

    // ── Hard: best matchup simulation against player's remaining roster ───────
    case 'hard': {
      if (playerRemaining && playerRemaining.length > 0) {
        return pickBestMatchup(aiRemaining, playerRemaining)
      }
      // Fallback when player roster is unknown
      return pickStrongest(aiRemaining)
    }
  }
}
