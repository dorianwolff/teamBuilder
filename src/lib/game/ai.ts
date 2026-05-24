import type { Character } from '@/types/character'
import type { DraftPoolSlot } from '@/types/game'
import { resolveBattle } from './battle'

export type AiDifficulty = 'easy' | 'normal' | 'hard'

export const AI_ID = 'ai'
export const AI_NAME = 'TeamBuilder AI'

/**
 * AI picks a slot from the draft pool.
 * Returns the chosen slot position.
 */
export function aiDraftPick(
  pool: DraftPoolSlot[],
  difficulty: AiDifficulty,
): number {
  // Collect available pairs (both slots unpicked)
  const availablePairs: [DraftPoolSlot, DraftPoolSlot][] = []
  for (let i = 0; i < pool.length; i += 2) {
    if (!pool[i].is_picked && !pool[i + 1].is_picked) {
      availablePairs.push([pool[i], pool[i + 1]])
    }
  }

  if (availablePairs.length === 0) return 0

  if (difficulty === 'easy') {
    const pair = availablePairs[Math.floor(Math.random() * availablePairs.length)]
    return pair[Math.random() < 0.5 ? 0 : 1].position
  }

  // Normal + Hard: pick the highest-power visible character from any available pair
  let bestPosition = availablePairs[0][0].position
  let bestPower = -1

  for (const [slotA, slotB] of availablePairs) {
    // Evaluate slot A
    if (!slotA.is_masked && slotA.character) {
      if (slotA.character.power_level > bestPower) {
        bestPower = slotA.character.power_level
        bestPosition = slotA.position
      }
    } else if (slotA.is_masked) {
      // Masked: assume average power — prefer known card unless nothing better found
      const maskedEstimate = 2_000_000
      if (maskedEstimate > bestPower && bestPower < 0) {
        bestPosition = slotA.position
      }
    }
    // Evaluate slot B
    if (!slotB.is_masked && slotB.character) {
      if (slotB.character.power_level > bestPower) {
        bestPower = slotB.character.power_level
        bestPosition = slotB.position
      }
    } else if (slotB.is_masked && bestPower < 0) {
      bestPosition = slotB.position
    }
  }

  return bestPosition
}

/**
 * AI picks a character for the battle phase.
 * Returns the character to use this round.
 */
export function aiBattlePick(
  aiTeam: Character[],
  difficulty: AiDifficulty,
  playerTeam?: Character[],
): Character {
  if (aiTeam.length === 0) throw new Error('AI has no characters')

  if (difficulty === 'easy') {
    return aiTeam[Math.floor(Math.random() * aiTeam.length)]
  }

  if (difficulty === 'normal') {
    // Pick highest power level
    return aiTeam.reduce((best, char) =>
      char.power_level > best.power_level ? char : best
    )
  }

  // Hard: pick character that wins against the most of the opponent's remaining characters
  if (!playerTeam || playerTeam.length === 0) {
    return aiTeam.reduce((best, char) =>
      char.power_level > best.power_level ? char : best
    )
  }

  let bestChar = aiTeam[0]
  let bestWins = -1

  for (const aiChar of aiTeam) {
    let wins = 0
    for (const playerChar of playerTeam) {
      const result = resolveBattle(aiChar, playerChar)
      if (result.winner?.id === aiChar.id) wins++
    }
    if (wins > bestWins) {
      bestWins = wins
      bestChar = aiChar
    }
  }

  return bestChar
}
