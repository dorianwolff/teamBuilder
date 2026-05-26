'use client'

/**
 * BattleAnimationSequence — v2
 *
 * Cinematic overlay for round resolution.
 *
 * Sequence:
 *   1.  Overlay fade in
 *   2.  MY card enters first (isPlayerA → charA; else charB)
 *   3.  Opponent's card enters
 *   4.  VS badge
 *   5.  CLASH (perfectly centred via inset-x-0 flex justify-center)
 *   6.  Technique A — label floats ABOVE charA's card, effect fires left→right
 *   7.  Technique B — label floats ABOVE charB's card, effect fires right→left
 *   8.  Number reveal — both scores count up from 0; winner grows/green, loser shrinks/red
 *   9.  Result pause
 *   10. Overlay outro → onComplete()
 *
 * Props added in v2:
 *   - round      — full BattleRound for scores + modifiers
 *   - playerAId  — to determine winner side
 *   - playerBId  — same
 */

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { resolveAnimProfile } from '@/data/animations'
import { AuraGlow, AuraParticles } from './AuraGlow'
import { EffectOverlay } from './EffectOverlay'
import { NumberReveal } from './NumberReveal'
import { cn } from '@/lib/utils/cn'
import type { Character } from '@/types/character'
import type { BattleRound } from '@/types/game'
import type { BattleModifier } from '@/types/game'
import type { TechniqueAnim, AnimationType } from '@/types/animation'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BattleAnimationSequenceProps {
  charA: Character
  charB: Character
  /** Full resolved round — provides scores, modifiers, winner */
  round: BattleRound
  /** user_id of player A */
  playerAId: string
  /** user_id of player B */
  playerBId: string
  /** True when the current viewer is Player A */
  isPlayerA: boolean
  onComplete: () => void
}

interface AnimState {
  overlayIn:    boolean
  portraitA:    boolean
  auraA:        boolean
  portraitB:    boolean
  auraB:        boolean
  vsShow:       boolean
  clash:        boolean
  techniqueA:   boolean
  effectA:      boolean
  techniqueB:   boolean
  effectB:      boolean
  numberReveal: boolean
  revealResult: boolean
  overlayOut:   boolean
}

const INIT: AnimState = {
  overlayIn: false, portraitA: false, auraA: false,
  portraitB: false, auraB: false, vsShow: false,
  clash: false, techniqueA: false, effectA: false,
  techniqueB: false, effectB: false,
  numberReveal: false, revealResult: false, overlayOut: false,
}

// ─── Technique text styles ────────────────────────────────────────────────────

const TYPE_STYLES: Partial<Record<AnimationType, string>> = {
  ki_aura:              'font-black tracking-tight uppercase',
  ki_beam:              'font-black tracking-tight uppercase',
  sharingan:            'font-bold tracking-widest italic',
  genjutsu:             'font-bold tracking-widest italic',
  nen_aura:             'font-black tracking-wide',
  chain_jail:           'font-black tracking-wide',
  haki_burst:           'font-black tracking-widest uppercase',
  time_stop:            'font-light tracking-[0.3em] uppercase',
  sword:                'font-bold italic tracking-tight',
  divine:               'font-light tracking-[0.25em] uppercase',
  shadow:               'font-bold tracking-widest italic',
  darkness:             'font-black tracking-widest uppercase',
  gear5:                'font-black tracking-tight uppercase',
  chidori:              'font-black tracking-tight uppercase',
  kamui:                'font-bold tracking-[0.2em] italic',
  eight_gates:          'font-black tracking-widest uppercase',
  gentle_fist:          'font-light tracking-[0.3em] uppercase',
  rasengan:             'font-black tracking-tight uppercase',
  bijuu:                'font-black tracking-widest uppercase',
  physical:             'font-black tracking-tight uppercase',
  elemental_fire:       'font-black tracking-tight uppercase',
  elemental_lightning:  'font-black tracking-tight uppercase',
  elemental_wind:       'font-black tracking-tight uppercase',
  explosion:            'font-black tracking-widest uppercase',
}

// ─── CharPortrait ─────────────────────────────────────────────────────────────

/**
 * A character portrait with:
 * - Entrance animation (slides in from side)
 * - Aura glow + particles
 * - Technique label positioned ABOVE the card (not overlapping)
 * - Combat physics (lean, shake, damage flash)
 */
function CharPortrait({
  character,
  side,
  showAura,
  showParticles,
  color,
  visible,
  isAttacking = false,
  isReceiving = false,
  isClash = false,
  technique,
  showLabel = false,
}: {
  character: Character
  side: 'left' | 'right'
  showAura: boolean
  showParticles: boolean
  color: string
  visible: boolean
  isAttacking?: boolean
  isReceiving?: boolean
  isClash?: boolean
  technique?: TechniqueAnim | null
  showLabel?: boolean
}) {
  const xEnter  = side === 'left' ? -80 : 80
  const attackX = side === 'left' ? 24 : -24

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 flex flex-col items-center',
            side === 'left'
              ? 'left-4 sm:left-10 md:left-16'
              : 'right-4 sm:right-10 md:right-16',
          )}
          initial={{ opacity: 0, x: xEnter, scale: 0.7 }}
          animate={{
            opacity: 1,
            x: isAttacking ? attackX : 0,
            scale: isAttacking ? 1.08 : isReceiving ? 0.94 : 1,
            rotate: isAttacking ? (side === 'left' ? 4 : -4) : 0,
          }}
          exit={{ opacity: 0, x: xEnter * 0.4, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {/* Shake wrapper — shakes on receive / clash */}
          <motion.div
            animate={
              isClash
                ? { x: [0, -7, 7, -5, 5, -3, 3, 0] }
                : isReceiving
                  ? { x: [0, -4, 4, -3, 3, -2, 2, 0] }
                  : { x: 0 }
            }
            transition={
              isClash
                ? { duration: 0.35, repeat: Infinity }
                : isReceiving
                  ? { duration: 0.45, repeat: Infinity, repeatDelay: 0.15 }
                  : { duration: 0.2 }
            }
            className="relative flex flex-col items-center"
          >
            {/* ── Technique label — floats ABOVE the card ── */}
            <AnimatePresence>
              {showLabel && technique && (
                <motion.div
                  className={cn(
                    'absolute bottom-full mb-4 z-40',
                    'flex flex-col gap-0.5',
                    // Align inward from the card edge so text never bleeds off-screen
                    side === 'left'
                      ? 'left-0 items-start text-left'
                      : 'right-0 items-end text-right',
                    'w-max max-w-[160px] sm:max-w-[230px] md:max-w-[300px]',
                  )}
                  initial={{ opacity: 0, y: 14, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 340, damping: 24 }}
                >
                  {/* Background glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl blur-2xl pointer-events-none"
                    style={{ background: `${technique.color}55` }}
                    animate={{ opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  {/* Technique name */}
                  <motion.p
                    className={cn(
                      'relative text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight drop-shadow-lg',
                      TYPE_STYLES[technique.type] ?? 'font-bold',
                    )}
                    style={{ color: technique.color }}
                    animate={{
                      textShadow: [
                        `0 0 8px ${technique.color}88`,
                        `0 0 24px ${technique.color}cc`,
                        `0 0 8px ${technique.color}88`,
                      ],
                    }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    {technique.name}
                  </motion.p>
                  {/* Flavour text */}
                  {technique.flavour && (
                    <motion.p
                      className="relative text-[10px] sm:text-xs text-white/60 font-normal tracking-wide"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      {technique.flavour}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Card portrait ── */}
            <div className="relative w-28 h-36 sm:w-36 sm:h-48 md:w-44 md:h-60 rounded-2xl overflow-hidden shadow-2xl">
              {showAura && <AuraGlow color={color} intensity="high" pulse />}

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/character-img/${character.verse}/${character.slug}`}
                alt={character.name}
                className="object-cover object-top w-full h-full relative z-10"
              />

              {/* Colour tint overlay */}
              <motion.div
                className="absolute inset-0 z-20 pointer-events-none"
                style={{ background: `${color}22`, mixBlendMode: 'screen' }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />

              {/* Damage flash when receiving */}
              {isReceiving && (
                <motion.div
                  className="absolute inset-0 z-30 pointer-events-none rounded-2xl bg-black"
                  animate={{ opacity: [0.15, 0.4, 0.15] }}
                  transition={{ duration: 0.45, repeat: Infinity }}
                />
              )}
            </div>

            {/* Name tag */}
            <motion.p
              className="mt-2 text-xs sm:text-sm font-bold text-white/80 text-center drop-shadow-lg max-w-[120px] sm:max-w-none leading-tight"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {character.name}
            </motion.p>

            {/* Entrance particles */}
            {showParticles && (
              <div className="absolute inset-0 pointer-events-none">
                <AuraParticles color={color} count={10} />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── FloatingModifiers — cinematic impact text during the fight sequence ──────
//
// Modifier descriptions float on-screen while scores count up.
// Left column = events that hurt / buff A-side (debuffs on A, buffs from B).
// Right column = events that hurt / buff B-side.
//
// Positioning: anchored to screen edge so they NEVER overflow regardless of
// device width. Left items use `left: 2%`; right items use `right: 2%`.
// maxWidth is clamped to `min(38vw, 220px)` which gives:
//   mobile 375px  →  ~143px  (safe)
//   tablet 768px  →  ~220px
//   desktop 1200+ →   220px

const FM_SLOTS_L = [{ y: 11 }, { y: 34 }, { y: 57 }, { y: 78 }]
const FM_SLOTS_R = [{ y:  9 }, { y: 32 }, { y: 55 }, { y: 76 }]

function FloatingModifiers({ modifiers, active }: { modifiers: BattleModifier[]; active: boolean }) {
  if (!active) return null
  const items = modifiers
    .filter(m => m.description && (m.score_delta_a !== 0 || m.score_delta_b !== 0))
    .slice(0, 6)
  if (items.length === 0) return null

  let leftCount  = 0
  let rightCount = 0

  return (
    <div className="absolute inset-0 pointer-events-none z-[26]">
      {items.map((m, i) => {
        const isNegA = m.score_delta_a < 0
        const isPosA = m.score_delta_a > 0
        const isNegB = m.score_delta_b < 0
        const isPosB = m.score_delta_b > 0

        const onLeft = isNegA || isPosB
        const slotY  = onLeft
          ? FM_SLOTS_L[leftCount++  % FM_SLOTS_L.length].y
          : FM_SLOTS_R[rightCount++ % FM_SLOTS_R.length].y

        const isNeg  = isNegA || isNegB
        const isPos  = isPosA || isPosB
        const initX  = onLeft ? -28 : 28

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              [onLeft ? 'left' : 'right']: '2%',
              top: `${slotY}%`,
              maxWidth: 'min(38vw, 220px)',
            }}
            initial={{ opacity: 0, x: initX, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], x: 0, scale: [0.5, 1.12, 1, 0.95] }}
            transition={{
              duration: 2.8,
              delay: 0.06 + i * 0.20,
              times:   [0, 0.08, 0.60, 1],
              ease: 'easeOut',
            }}
          >
            <p
              className={cn(
                'text-xs sm:text-sm font-bold leading-tight',
                'px-2.5 py-1.5 rounded-xl border backdrop-blur-sm',
                onLeft ? 'text-left' : 'text-right',
                isNeg
                  ? 'text-red-200 bg-red-950/85 border-red-500/55'
                  : isPos
                    ? 'text-emerald-200 bg-emerald-950/85 border-emerald-500/55'
                    : 'text-white/80 bg-black/65 border-white/20',
              )}
              style={{
                boxShadow: isNeg
                  ? '0 0 18px #ef444440, inset 0 0 8px #ef444418'
                  : isPos
                    ? '0 0 18px #22c55e40, inset 0 0 8px #22c55e18'
                    : 'none',
                textShadow: isNeg
                  ? '0 0 10px #fca5a5cc'
                  : isPos ? '0 0 10px #6ee7b7cc'
                  : 'none',
              }}
            >
              {m.description}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── ClashEffect ──────────────────────────────────────────────────────────────

function ClashEffect({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* White flash */}
          <motion.div
            className="absolute inset-0 bg-white pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, times: [0, 0.1, 0.3, 0.5, 1] }}
          />

          {/* Impact rings */}
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 rounded-full border-2 pointer-events-none z-40"
              style={{ borderColor: '#fbbf24' }}
              initial={{ width: 0, height: 0, x: '-50%', y: '-50%', opacity: 1 }}
              animate={{ width: 200 + i * 120, height: 200 + i * 120, x: '-50%', y: '-50%', opacity: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          ))}

          {/* CLASH text — centred with inset-x-0 + flex justify-center (no translate trick) */}
          <motion.div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none z-40"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.5, 1.2, 0.8] }}
            transition={{ duration: 0.9, times: [0, 0.2, 0.6, 1] }}
          >
            <p
              className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-widest drop-shadow-2xl"
              style={{ textShadow: '0 0 20px #fbbf24, 0 0 50px #f59e0b, 0 0 80px #ffffff' }}
            >
              CLASH
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BattleAnimationSequence({
  charA,
  charB,
  round,
  playerAId,
  isPlayerA,
  onComplete,
}: BattleAnimationSequenceProps) {
  const [s, setS]                       = useState<AnimState>(INIT)
  const [techniqueA, setTechniqueA]     = useState<TechniqueAnim | null>(null)
  const [techniqueB, setTechniqueB]     = useState<TechniqueAnim | null>(null)
  const ran                             = useRef(false)

  const winnerIsA = round.winner_id === playerAId

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const profileA = resolveAnimProfile(charA)
    const profileB = resolveAnimProfile(charB)
    const tA = profileA.techniques[0]
    const tB = profileB.techniques[0]
    setTechniqueA(tA)
    setTechniqueB(tB)

    async function run() {
      // ── 1. Overlay fade in ────────────────────────────────────────────────
      setS(p => ({ ...p, overlayIn: true }))
      await delay(500)

      // ── 2. MY card enters first ───────────────────────────────────────────
      if (isPlayerA) {
        setS(p => ({ ...p, portraitA: true, auraA: true }))
        await delay(750)
        setS(p => ({ ...p, portraitB: true, auraB: true }))
      } else {
        setS(p => ({ ...p, portraitB: true, auraB: true }))
        await delay(750)
        setS(p => ({ ...p, portraitA: true, auraA: true }))
      }
      await delay(750)

      // ── 3. VS badge ───────────────────────────────────────────────────────
      setS(p => ({ ...p, vsShow: true }))
      await delay(1000)

      // ── 4. CLASH ──────────────────────────────────────────────────────────
      setS(p => ({ ...p, vsShow: false, clash: true }))
      await delay(950)
      setS(p => ({ ...p, clash: false }))
      await delay(400)

      // ── 5. Technique A  +  number reveal START together (threaded) ───────
      // Number reveal runs concurrently so scores count up DURING the fight.
      // duration=5600 ms covers (techA 2500 + gap 400 + techB 2500 + gap 400) = 5800 ms
      // so the count-up completes a beat before revealResult, giving a satisfying pause.
      setS(p => ({ ...p, techniqueA: true, effectA: true, numberReveal: true }))
      await delay(2500)
      setS(p => ({ ...p, techniqueA: false, effectA: false }))
      await delay(400)

      // ── 6. Technique B  (number reveal still running in background) ───────
      setS(p => ({ ...p, techniqueB: true, effectB: true }))
      await delay(2500)
      setS(p => ({ ...p, techniqueB: false, effectB: false }))
      // Short gap — count-up finishes here, ~200 ms of silence before result
      await delay(400)

      // ── 7. Show winner/loser result state ─────────────────────────────────
      // Total elapsed since numberReveal: 2500+400+2500+400 = 5800 ms ≥ 5600 ms duration
      setS(p => ({ ...p, revealResult: true }))
      await delay(1600)

      // ── 9. Outro ──────────────────────────────────────────────────────────
      setS(p => ({
        ...p,
        overlayOut: true,
        portraitA: false, auraA: false,
        portraitB: false, auraB: false,
      }))
      await delay(600)

      onComplete()
    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AnimatePresence>
      {s.overlayIn && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: s.overlayOut ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          style={{ background: 'radial-gradient(ellipse at center, #0d0d1a 0%, #000000 100%)' }}
        >
          {/* Ambient colour wash from both technique colours */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0.08, 0.18, 0.08] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              background: techniqueA && techniqueB
                ? `linear-gradient(135deg, ${techniqueA.color}22 0%, transparent 50%, ${techniqueB.color}22 100%)`
                : 'transparent',
            }}
          />

          {/* ── Char A (always left) ─────────────────────────────────────── */}
          <CharPortrait
            character={charA}
            side="left"
            showAura={s.auraA}
            showParticles={s.auraA}
            color={techniqueA?.color ?? '#f97316'}
            visible={s.portraitA}
            isAttacking={s.techniqueA}
            isReceiving={s.techniqueB}
            isClash={s.clash}
            technique={techniqueA}
            showLabel={s.techniqueA}
          />

          {/* ── Char B (always right) ─────────────────────────────────────── */}
          <CharPortrait
            character={charB}
            side="right"
            showAura={s.auraB}
            showParticles={s.auraB}
            color={techniqueB?.color ?? '#3b82f6'}
            visible={s.portraitB}
            isAttacking={s.techniqueB}
            isReceiving={s.techniqueA}
            isClash={s.clash}
            technique={techniqueB}
            showLabel={s.techniqueB}
          />

          {/* ── Effect overlays ─────────────────────────────────────────────── */}
          {s.effectA && techniqueA && (
            <EffectOverlay
              type={techniqueA.type}
              color={techniqueA.color}
              secondaryColor={techniqueA.secondaryColor}
              side="left"
            />
          )}
          {s.effectB && techniqueB && (
            <EffectOverlay
              type={techniqueB.type}
              color={techniqueB.color}
              secondaryColor={techniqueB.secondaryColor}
              side="right"
            />
          )}

          {/* ── VS badge ─────────────────────────────────────────────────────── */}
          <AnimatePresence>
            {s.vsShow && (
              <motion.div
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center z-30 pointer-events-none"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <p
                  className="text-3xl sm:text-5xl font-black text-white/90 drop-shadow-2xl tracking-widest"
                  style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)' }}
                >
                  VS
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Clash ─────────────────────────────────────────────────────────── */}
          <ClashEffect visible={s.clash} />

          {/* ── Floating modifier impact text (scattered over screen during number reveal) */}
          <FloatingModifiers
            modifiers={round.modifiers_applied ?? []}
            active={s.numberReveal || s.revealResult}
          />

          {/* ── Number reveal section ─────────────────────────────────────────── */}
          <AnimatePresence>
            {s.numberReveal && (
              <motion.div
                className="absolute inset-x-0 bottom-8 sm:bottom-12 flex justify-center items-end gap-8 sm:gap-16 md:gap-28 z-20 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
              >
                <NumberReveal
                  targetScore={round.effective_score_a}
                  baseScore={charA.power_level}
                  isWinner={winnerIsA}
                  charName={charA.name}
                  active={s.numberReveal}
                  revealResult={s.revealResult}
                  duration={5600}
                />
                <NumberReveal
                  targetScore={round.effective_score_b}
                  baseScore={charB.power_level}
                  isWinner={!winnerIsA}
                  charName={charB.name}
                  active={s.numberReveal}
                  revealResult={s.revealResult}
                  duration={5600}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip hint */}
          <motion.p
            className="absolute bottom-2 inset-x-0 text-center text-white/15 text-xs pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Animation playing…
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
