export type Verse = 'one_piece' | 'naruto' | 'dbz' | 'hxh'

export type TagColor =
  | 'fire' | 'water' | 'lightning' | 'wind' | 'earth'
  | 'ice'  | 'dark'  | 'light'    | 'love' | 'default'

export interface PowerTag {
  id: string
  name: string        // display name, e.g. "Lightning"
  slug: string        // snake_case key, e.g. "lightning"
  color: TagColor
  description: string
}

export interface StrengthEntry {
  tag: string         // tag slug
  coefficient: number // 0.0–1.0 — how much of that damage type is nullified
  description?: string
}

export interface WeaknessEntry {
  tag: string
  coefficient: number // 0.0–1.0 — extra damage multiplier taken
  description?: string
}

export interface DrawCondition {
  character_slug: string
  reason: string
  tag_color?: TagColor // defaults to 'love' for emotional draws
}

/**
 * Trait-based engagement modifiers.
 *
 * trait_weaknesses: when the OPPONENT has a listed trait, this character's
 *   total effective score is multiplied down by (1 - coefficient).
 *   Example: Sanji has { trait: "female", coefficient: 0.7 } → against a female
 *   opponent his total offense is reduced to 30%.
 *
 * trait_strengths: when the OPPONENT has a listed trait, this character's
 *   total effective score is boosted by coefficient.
 *   Example: Meruem has { trait: "non_combatant", coefficient: 0.5 } → against a
 *   non-combatant his total offense is multiplied by 1.5.
 */
export interface TraitWeaknessEntry {
  trait: string
  coefficient: number  // 0.0–1.0 — fraction of this character's offense removed
  description?: string
}

export interface TraitStrengthEntry {
  trait: string
  coefficient: number  // 0.0+ — fraction added to this character's offense multiplier
  description?: string
}

// Full character definition as stored in DB / seed JSON
export interface Character {
  id: string                    // uuid from DB
  slug: string                  // unique snake_case e.g. "luffy_gear5"
  name: string                  // display name
  verse: Verse
  arc_version: string           // e.g. "Gear 5 – Wano Arc"
  power_level: number           // main ranking number (float, very precise)
  martial_ratio: number         // 0.0–1.0
  power_tags: string[]          // tag slugs for their ability types
  strengths: StrengthEntry[]
  weaknesses: WeaknessEntry[]
  cannot_win_against: string[]  // character slugs — always loses
  draw_conditions: DrawCondition[]
  traits?: string[]              // identity/species/code traits e.g. ["human","female","nen_user"]
  trait_weaknesses?: TraitWeaknessEntry[]
  trait_strengths?: TraitStrengthEntry[]
  image_path: string            // relative to /public, e.g. "assets/characters/one_piece/luffy_gear5.png"
  short_description: string
  created_at?: string
}

// Lighter version for draft/battle display (no full formula data)
export interface CharacterSummary {
  id: string
  slug: string
  name: string
  verse: Verse
  arc_version: string
  power_level: number
  image_path: string
  short_description: string
}

// What a player sees — either revealed or masked
export type CharacterVisibility = 'revealed' | 'masked' | 'owned_masked'

export interface DraftCharacter {
  character: Character
  visibility: CharacterVisibility
  position: number // 0-indexed slot in the draft pool
}
