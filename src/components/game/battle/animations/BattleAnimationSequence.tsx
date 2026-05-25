'use client'

/**
 * BattleAnimationSequence
 *
 * Full-screen cinematic overlay that plays before a round result is shown.
 * Flow: overlay in → char A entrance → char A technique → char B entrance →
 *       char B technique → clash flash → overlay out → onComplete()
 *
 * Uses async/await + Promises instead of nested timeouts.
 */

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { resolveAnimProfile } from '@/data/animations'
import { AuraGlow, AuraParticles } from './AuraGlow'
import { TechniqueLabel } from './TechniqueLabel'
import { EffectOverlay } from './EffectOverlay'
import type { Character } from '@/types/character'
import type { TechniqueAnim } from '@/types/animation'

// ─── helpers ─────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

// ─── types ────────────────────────────────────────────────────────────────────

interface BattleAnimationSequenceProps {
  charA: Character
  charB: Character
  /** Whether the current viewer is Player A (determines label sides) */
  isPlayerA: boolean
  onComplete: () => void
}

// State flags that drive visibility of each layer
interface AnimState {
  overlayIn:      boolean
  portraitA:      boolean
  auraA:          boolean
  techniqueA:     boolean
  effectA:        boolean
  portraitB:      boolean
  auraB:          boolean
  techniqueB:     boolean
  effectB:        boolean
  clash:          boolean
  overlayOut:     boolean
}

const INIT: AnimState = {
  overlayIn: false, portraitA: false, auraA: false, techniqueA: false, effectA: false,
  portraitB: false, auraB: false,     techniqueB: false, effectB: false,
  clash: false, overlayOut: false,
}

// ─── sub-components ───────────────────────────────────────────────────────────

/** Character portrait card with aura and particles */
function CharPortrait({
  character,
  side,
  showAura,
  showParticles,
  color,
  visible,
}: {
  character: Character
  side: 'left' | 'right'
  showAura: boolean
  showParticles: boolean
  color: string
  visible: boolean
}) {
  const xEnter = side === 'left' ? -80 : 80

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`absolute top-1/2 -translate-y-1/2 flex flex-col items-center
            ${side === 'left' ? 'left-4 sm:left-10 md:left-16' : 'right-4 sm:right-10 md:right-16'}`}
          initial={{ opacity: 0, x: xEnter, scale: 0.7 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: xEnter * 0.4, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        >
          <div className="relative w-28 h-36 sm:w-36 sm:h-48 md:w-44 md:h-60 rounded-2xl overflow-hidden shadow-2xl">
            {/* Aura behind portrait */}
            {showAura && (
              <AuraGlow color={color} intensity="high" pulse />
            )}

            {/* Portrait */}
            <Image
              src={`/images/characters/${character.image_path}`}
              alt={character.name}
              fill
              className="object-cover object-top relative z-10"
              sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 176px"
            />

            {/* Color overlay tint */}
            <motion.div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{ background: `${color}22`, mixBlendMode: 'screen' }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
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

          {/* Particles on entrance */}
          {showParticles && (
            <div className="absolute inset-0 pointer-events-none">
              <AuraParticles color={color} count={10} />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Central clash flash */
function ClashEffect({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* White flash */}
          <motion.div
            className="absolute inset-0 bg-white pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, times: [0, 0.1, 0.3, 0.5, 1] }}
          />
          {/* Impact rings */}
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 rounded-full border-2 border-gold-400 pointer-events-none"
              initial={{ width: 0, height: 0, x: '-50%', y: '-50%', opacity: 1 }}
              animate={{ width: 200 + i * 120, height: 200 + i * 120, x: '-50%', y: '-50%', opacity: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          ))}
          {/* Clash text */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.4, 1.2, 0.8] }}
            transition={{ duration: 0.9, times: [0, 0.2, 0.6, 1] }}
          >
            <p className="text-4xl sm:text-6xl font-black text-white drop-shadow-2xl"
               style={{ textShadow: '0 0 30px #fbbf24, 0 0 60px #f59e0b' }}>
              ⚔
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export function BattleAnimationSequence({
  charA, charB, isPlayerA, onComplete,
}: BattleAnimationSequenceProps) {
  const [s, setS] = useState<AnimState>(INIT)
  const [techniqueA, setTechniqueA] = useState<TechniqueAnim | null>(null)
  const [techniqueB, setTechniqueB] = useState<TechniqueAnim | null>(null)
  const ran = useRef(false)

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
      // ── 1. Overlay fades in ──────────────────────────────────────────────────
      setS(p => ({ ...p, overlayIn: true }))
      await delay(500)

      // ── 2. Character A entrance ──────────────────────────────────────────────
      setS(p => ({ ...p, portraitA: true, auraA: true }))
      await delay(600)

      // ── 3. Char A technique ──────────────────────────────────────────────────
      setS(p => ({ ...p, techniqueA: true, effectA: true }))
      await delay(2200)

      // ── 4. Fade out A's technique, keep portrait ─────────────────────────────
      setS(p => ({ ...p, techniqueA: false, effectA: false }))
      await delay(300)

      // ── 5. Character B entrance ──────────────────────────────────────────────
      setS(p => ({ ...p, portraitB: true, auraB: true }))
      await delay(600)

      // ── 6. Char B technique ──────────────────────────────────────────────────
      setS(p => ({ ...p, techniqueB: true, effectB: true }))
      await delay(2200)

      // ── 7. Fade out B's technique ────────────────────────────────────────────
      setS(p => ({ ...p, techniqueB: false, effectB: false }))
      await delay(300)

      // ── 8. Clash ─────────────────────────────────────────────────────────────
      setS(p => ({ ...p, clash: true }))
      await delay(1000)
      setS(p => ({ ...p, clash: false }))
      await delay(200)

      // ── 9. Overlay fades out ─────────────────────────────────────────────────
      setS(p => ({
        ...p,
        overlayOut: true,
        portraitA: false, auraA: false,
        portraitB: false, auraB: false,
      }))
      await delay(600)

      // ── Done ─────────────────────────────────────────────────────────────────
      onComplete()
    }

    run()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Determine label sides relative to viewer
  // Player A's character is always on left visually; their label is on left
  const sideA: 'left' | 'right' = 'left'
  const sideB: 'left' | 'right' = 'right'

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
          {/* Ambient background pulse */}
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

          {/* ── Character A ───────────────────────────────────────────── */}
          <CharPortrait
            character={charA}
            side={sideA}
            showAura={s.auraA}
            showParticles={s.auraA}
            color={techniqueA?.color ?? '#f97316'}
            visible={s.portraitA}
          />

          {/* Char A effect overlay */}
          {s.effectA && techniqueA && (
            <EffectOverlay
              type={techniqueA.type}
              color={techniqueA.color}
              secondaryColor={techniqueA.secondaryColor}
              side={sideA}
            />
          )}

          {/* Char A technique label */}
          {techniqueA && (
            <TechniqueLabel
              name={techniqueA.name}
              type={techniqueA.type}
              color={techniqueA.color}
              flavour={techniqueA.flavour}
              visible={s.techniqueA}
              side={sideA}
            />
          )}

          {/* ── Character B ───────────────────────────────────────────── */}
          <CharPortrait
            character={charB}
            side={sideB}
            showAura={s.auraB}
            showParticles={s.auraB}
            color={techniqueB?.color ?? '#3b82f6'}
            visible={s.portraitB}
          />

          {/* Char B effect overlay */}
          {s.effectB && techniqueB && (
            <EffectOverlay
              type={techniqueB.type}
              color={techniqueB.color}
              secondaryColor={techniqueB.secondaryColor}
              side={sideB}
            />
          )}

          {/* Char B technique label */}
          {techniqueB && (
            <TechniqueLabel
              name={techniqueB.name}
              type={techniqueB.type}
              color={techniqueB.color}
              flavour={techniqueB.flavour}
              visible={s.techniqueB}
              side={sideB}
            />
          )}

          {/* ── VS badge ─────────────────────────────────────────────── */}
          <AnimatePresence>
            {(s.portraitA && s.portraitB) && !s.clash && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <div className="flex flex-col items-center gap-1">
                  <p className="text-3xl sm:text-5xl font-black text-white/90 drop-shadow-2xl tracking-widest"
                     style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>
                    VS
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Clash ────────────────────────────────────────────────── */}
          <ClashEffect visible={s.clash} />

          {/* Skip hint */}
          <motion.p
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/20 text-xs pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Animation playing…
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
