import type { Character } from '@/types/character'
import type { BattleModifier } from '@/types/game'

export interface BattleResult {
  winner: Character | null        // null = draw
  loser: Character | null
  is_draw: boolean
  effective_score_a: number
  effective_score_b: number
  modifiers: BattleModifier[]
  summary: string
}

/**
 * Resolve a 1v1 battle between two characters using the full formula.
 *
 * Formula breakdown:
 *   score = martial_component + (power_component * power_modifier)
 *
 * where:
 *   martial_component = power_level * martial_ratio
 *   power_component   = power_level * (1 - martial_ratio)
 *   power_modifier    = product of each opponent-strength nullification applied
 *                       to each of this character's power_tags
 *
 * Special overrides (checked first, before formula):
 *   - cannot_win_against: character always loses
 *   - draw_conditions:    character always draws
 *
 * Weakness mechanic:
 *   If charA has a weakness against a tag that charB uses as a power_tag,
 *   charA's power_modifier is REDUCED by weakness.coefficient, making charA
 *   deal less effective damage (represents taking heavier hits).
 *
 * Strength mechanic:
 *   If charA has a strength against a tag that charB uses as a power_tag,
 *   charB's power modifier for that tag's contribution is reduced by
 *   strength.coefficient (charA is immune/resistant to that damage type).
 */
export function resolveBattle(charA: Character, charB: Character): BattleResult {
  const modifiers: BattleModifier[] = []

  // ── Special overrides ────────────────────────────────────────────────────
  const aCantWin = charA.cannot_win_against.includes(charB.slug)
  const bCantWin = charB.cannot_win_against.includes(charA.slug)

  if (aCantWin && bCantWin) {
    modifiers.push({
      source: 'cannot_win',
      description: 'Both characters have overrides — treated as draw',
      score_delta_a: 0,
      score_delta_b: 0,
    })
    return makeDraw(charA, charB, modifiers, 'Mutual cannot_win override — draw declared.')
  }
  if (aCantWin) {
    modifiers.push({
      source: 'cannot_win',
      character_slug: charB.slug,
      description: `${charA.name} cannot win against ${charB.name}`,
      score_delta_a: -Infinity,
      score_delta_b: 0,
    })
    return makeWin(charB, charA, 0, charA.power_level, modifiers, `${charA.name} cannot win against ${charB.name}.`)
  }
  if (bCantWin) {
    modifiers.push({
      source: 'cannot_win',
      character_slug: charA.slug,
      description: `${charB.name} cannot win against ${charA.name}`,
      score_delta_a: 0,
      score_delta_b: -Infinity,
    })
    return makeWin(charA, charB, charA.power_level, 0, modifiers, `${charB.name} cannot win against ${charA.name}.`)
  }

  // Draw conditions
  const aDrawsB = charA.draw_conditions.find(d => d.character_slug === charB.slug)
  const bDrawsA = charB.draw_conditions.find(d => d.character_slug === charA.slug)
  if (aDrawsB || bDrawsA) {
    const reason = aDrawsB?.reason ?? bDrawsA?.reason ?? 'Special condition'
    modifiers.push({
      source: 'draw',
      description: reason,
      score_delta_a: 0,
      score_delta_b: 0,
    })
    return makeDraw(charA, charB, modifiers, reason)
  }

  // ── Base components ───────────────────────────────────────────────────────
  const martialA = charA.power_level * charA.martial_ratio
  const powerA   = charA.power_level * (1 - charA.martial_ratio)
  const martialB = charB.power_level * charB.martial_ratio
  const powerB   = charB.power_level * (1 - charB.martial_ratio)

  // ── Strength modifiers (defence of A against B's power_tags) ─────────────
  let powerModifierB = 1.0  // how effective B's power abilities are against A
  for (const tagSlug of charB.power_tags) {
    const strength = charA.strengths.find(s => s.tag === tagSlug)
    if (strength) {
      const nullification = Math.min(strength.coefficient, 1.0)
      powerModifierB -= nullification
      modifiers.push({
        source: 'strength',
        tag: tagSlug,
        description: `${charA.name} resists ${tagSlug} (nullifies ${Math.round(nullification * 100)}% of ${charB.name}'s ${tagSlug} power)`,
        score_delta_a: 0,
        score_delta_b: -(powerB * nullification),
      })
    }
  }
  powerModifierB = Math.max(0, powerModifierB)

  let powerModifierA = 1.0  // how effective A's power abilities are against B
  for (const tagSlug of charA.power_tags) {
    const strength = charB.strengths.find(s => s.tag === tagSlug)
    if (strength) {
      const nullification = Math.min(strength.coefficient, 1.0)
      powerModifierA -= nullification
      modifiers.push({
        source: 'strength',
        tag: tagSlug,
        description: `${charB.name} resists ${tagSlug} (nullifies ${Math.round(nullification * 100)}% of ${charA.name}'s ${tagSlug} power)`,
        score_delta_a: -(powerA * nullification),
        score_delta_b: 0,
      })
    }
  }
  powerModifierA = Math.max(0, powerModifierA)

  // ── Weakness modifiers (A is more vulnerable to B's power_tags) ──────────
  for (const tagSlug of charB.power_tags) {
    const weakness = charA.weaknesses.find(w => w.tag === tagSlug)
    if (weakness) {
      const boost = weakness.coefficient
      powerModifierB += boost  // B's power is more effective against A
      modifiers.push({
        source: 'weakness',
        tag: tagSlug,
        description: `${charA.name} is weak to ${tagSlug} (+${Math.round(boost * 100)}% damage from ${charB.name}'s ${tagSlug} powers)`,
        score_delta_a: 0,
        score_delta_b: powerB * boost,
      })
    }
  }

  for (const tagSlug of charA.power_tags) {
    const weakness = charB.weaknesses.find(w => w.tag === tagSlug)
    if (weakness) {
      const boost = weakness.coefficient
      powerModifierA += boost
      modifiers.push({
        source: 'weakness',
        tag: tagSlug,
        description: `${charB.name} is weak to ${tagSlug} (+${Math.round(boost * 100)}% damage from ${charA.name}'s ${tagSlug} powers)`,
        score_delta_a: powerA * boost,
        score_delta_b: 0,
      })
    }
  }

  // ── Raw effective scores (before trait modifiers) ────────────────────────
  const effectiveA = martialA + powerA * powerModifierA
  const effectiveB = martialB + powerB * powerModifierB

  // ── Trait-based engagement modifiers ─────────────────────────────────────
  // trait_weaknesses: when the OPPONENT has this trait, this char's offense ↓
  // trait_strengths:  when the OPPONENT has this trait, this char's offense ↑
  let traitModA = 1.0
  for (const trait of (charB.traits ?? [])) {
    const tw = (charA.trait_weaknesses ?? []).find(w => w.trait === trait)
    if (tw) {
      traitModA -= tw.coefficient
      modifiers.push({
        source: 'weakness',
        tag: trait,
        description: tw.description ?? `${charA.name}'s engagement is hampered against opponents with trait: ${trait}`,
        score_delta_a: -(effectiveA * tw.coefficient),
        score_delta_b: 0,
      })
    }
    const ts = (charA.trait_strengths ?? []).find(s => s.trait === trait)
    if (ts) {
      traitModA += ts.coefficient
      modifiers.push({
        source: 'strength',
        tag: trait,
        description: ts.description ?? `${charA.name}'s effectiveness is boosted against opponents with trait: ${trait}`,
        score_delta_a: effectiveA * ts.coefficient,
        score_delta_b: 0,
      })
    }
  }
  traitModA = Math.max(0, traitModA)

  let traitModB = 1.0
  for (const trait of (charA.traits ?? [])) {
    const tw = (charB.trait_weaknesses ?? []).find(w => w.trait === trait)
    if (tw) {
      traitModB -= tw.coefficient
      modifiers.push({
        source: 'weakness',
        tag: trait,
        description: tw.description ?? `${charB.name}'s engagement is hampered against opponents with trait: ${trait}`,
        score_delta_a: 0,
        score_delta_b: -(effectiveB * tw.coefficient),
      })
    }
    const ts = (charB.trait_strengths ?? []).find(s => s.trait === trait)
    if (ts) {
      traitModB += ts.coefficient
      modifiers.push({
        source: 'strength',
        tag: trait,
        description: ts.description ?? `${charB.name}'s effectiveness is boosted against opponents with trait: ${trait}`,
        score_delta_a: 0,
        score_delta_b: effectiveB * ts.coefficient,
      })
    }
  }
  traitModB = Math.max(0, traitModB)

  const finalA = effectiveA * traitModA
  const finalB = effectiveB * traitModB

  if (finalA > finalB) {
    return makeWin(charA, charB, finalA, finalB, modifiers,
      `${charA.name} prevails with an effective power of ${formatScore(finalA)} vs ${formatScore(finalB)}.`)
  }
  if (finalB > finalA) {
    return makeWin(charB, charA, finalB, finalA, modifiers,
      `${charB.name} prevails with an effective power of ${formatScore(finalB)} vs ${formatScore(finalA)}.`)
  }

  // Exact tie (astronomically rare with floats) — random
  const tieWinner = Math.random() < 0.5 ? charA : charB
  const tieLoser  = tieWinner === charA ? charB : charA
  return makeWin(tieWinner, tieLoser, finalA, finalB, modifiers,
    `Scores were exactly equal — ${tieWinner.name} wins the toss.`)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeWin(
  winner: Character, loser: Character,
  scoreW: number, scoreL: number,
  modifiers: BattleModifier[],
  summary: string,
): BattleResult {
  return {
    winner,
    loser,
    is_draw: false,
    effective_score_a: scoreW,
    effective_score_b: scoreL,
    modifiers,
    summary,
  }
}

function makeDraw(
  a: Character, b: Character,
  modifiers: BattleModifier[],
  summary: string,
): BattleResult {
  return {
    winner: null,
    loser: null,
    is_draw: true,
    effective_score_a: a.power_level,
    effective_score_b: b.power_level,
    modifiers,
    summary,
  }
}

function formatScore(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(2)}K`
  return n.toFixed(0)
}
