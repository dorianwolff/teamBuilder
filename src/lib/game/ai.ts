import type { Character } from '@/types/character'
import type { DraftPoolSlot } from '@/types/game'
import { resolveBattle } from './battle'

export type AiDifficulty = 'easy' | 'normal' | 'hard'

export const AI_ID = 'ai'
export const AI_NAME = 'TeamBuilder AI'

/**
 * AI picks a slot from the current round's pair only.
 * Each round owns exactly one pair: positions (round-1)*2 and (round-1)*2+1.
 * Picking from other rounds' pairs caused the same character to appear twice.
 */
export function aiDraftPick(
  pool: DraftPoolSlot[],
  difficulty: AiDifficulty,
  currentRound: number,
): number {
  const pairStart = (currentRound - 1) * 2
  const slotA = pool[pairStart]
  const slotB = pool[pairStart + 1]

  if (!slotA || !slotB) return pairStart

  if (difficulty === 'easy') {
    return Math.random() < 0.5 ? slotA.position : slotB.position
  }

  // Normal + Hard: prefer the visible card with higher power
  const aVisible = !slotA.is_masked && slotA.character
  const bVisible = !slotB.is_masked && slotB.character

  if (aVisible && bVisible) {
    return slotA.character!.power_level >= slotB.character!.power_level
      ? slotA.position : slotB.position
  }
  if (aVisible) return slotA.position  // take the known card
  if (bVisible) return slotB.position
  return Math.random() < 0.5 ? slotA.position : slotB.position  // both masked → random
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
