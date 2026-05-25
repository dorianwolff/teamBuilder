export { TAG_TO_TECHNIQUE, pickTechniqueFromTags, FALLBACK_TECHNIQUE } from './tagToAnimation'
export { CHARACTER_PROFILES, getCharacterProfile } from './characterProfiles'

import type { CharacterAnimProfile, TechniqueAnim } from '@/types/animation'
import type { Character } from '@/types/character'
import { getCharacterProfile } from './characterProfiles'
import { pickTechniqueFromTags } from './tagToAnimation'

/** Verse-default aura colors */
const VERSE_AURA: Record<string, string> = {
  dbz:       '#fbbf24',
  naruto:    '#f97316',
  one_piece: '#3b82f6',
  hxh:       '#a3e635',
}

/**
 * Build an animation profile for any character.
 * Uses a hand-crafted profile if available, falls back to tag-based generation.
 */
export function resolveAnimProfile(character: Character): CharacterAnimProfile {
  const hand = getCharacterProfile(character.slug)
  if (hand) return hand

  const technique: TechniqueAnim = pickTechniqueFromTags(character.power_tags ?? [])
  return {
    slug:       character.slug,
    auraColor:  VERSE_AURA[character.verse] ?? '#f97316',
    techniques: [technique],
  }
}
