'use client'

/**
 * NumberReveal — post-clash score counting animation.
 *
 * Shows a character's effective battle score counting up from 0 with:
 *  - Eased count-up (cubic ease-out feel)
 *  - Random sparkle particles during count-up
 *  - Modifier badges ("strength ×1.3", "weakness -0.5×", etc.) popping up
 *  - Winner / loser size + colour transition when revealResult = true
 */

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPowerLevel } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import type { BattleModifier } from '@/types/game'

interface NumberRevealProps {
  /** The final effective score to count up to */
  targetScore: number
  /** The character's raw power_level (before modifiers) */
  baseScore: number
  /** All modifiers from the round */
  modifiers: BattleModifier[]
  /** True if this score belongs to player_a (used to pick the right delta) */
  isPlayerA: boolean
  /** Whether this side won the round */
  isWinner: boolean
  /** Character display name */
  charName: string
  /** Start counting when true */
  active: boolean
  /** Show winner/loser result styling when true */
  revealResult: boolean
  /** Count-up duration in ms */
  duration?: number
}

// ─── Sparkle particle ─────────────────────────────────────────────────────────

function Sparkle({ color, delay }: { color: string; delay: number }) {
  const x = (Math.random() - 0.5) * 80
  const y = -(20 + Math.random() * 50)
  const size = 3 + Math.random() * 4

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        background: color,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
      animate={{ x, y, opacity: [1, 0.8, 0], scale: [0, 1.5, 0] }}
      transition={{ duration: 0.6 + Math.random() * 0.3, delay, ease: 'easeOut' }}
    />
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NumberReveal({
  targetScore,
  baseScore,
  modifiers,
  isPlayerA,
  isWinner,
  charName,
  active,
  revealResult,
  duration = 2400,
}: NumberRevealProps) {
  const [displayScore, setDisplayScore] = useState(0)
  const [countDone, setCountDone]       = useState(false)
  const [sparkleKeys, setSparkleKeys]   = useState<number[]>([])
  const frameRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  // Colour / size based on result
  const buffed    = targetScore > baseScore
  const debuffed  = targetScore < baseScore
  const scoreColor = revealResult
    ? (isWinner ? '#4ade80' : '#f87171')
    : buffed ? '#fbbf24' : debuffed ? '#f87171' : '#ffffff'

  // Relevant modifiers for this side
  const myModifiers = modifiers.filter(m =>
    (isPlayerA ? m.score_delta_a : m.score_delta_b) !== 0
  )

  // Count-up animation
  useEffect(() => {
    if (!active) return
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    startRef.current = null

    function step(now: number) {
      if (!startRef.current) startRef.current = now
      const t = Math.min(1, (now - startRef.current) / duration)
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - t, 3)
      const current = Math.floor(eased * targetScore)
      setDisplayScore(current)

      // Random sparkles during count
      if (Math.random() < 0.25) {
        setSparkleKeys(prev => [...prev.slice(-24), Date.now() + Math.random() * 1000])
      }

      if (t < 1) {
        frameRef.current = requestAnimationFrame(step)
      } else {
        setDisplayScore(targetScore)
        setCountDone(true)
      }
    }

    frameRef.current = requestAnimationFrame(step)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, targetScore, duration])

  return (
    <div className="relative flex flex-col items-center gap-1.5">
      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {active && sparkleKeys.map(k => (
          <Sparkle key={k} color={scoreColor} delay={0} />
        ))}
      </div>

      {/* Character name tag */}
      <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-medium truncate max-w-[110px] sm:max-w-[150px]">
        {charName}
      </p>

      {/* Score display */}
      <motion.p
        className={cn(
          'font-black tabular-nums leading-none drop-shadow-lg',
          revealResult
            ? (isWinner ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-xl sm:text-2xl md:text-3xl')
            : 'text-2xl sm:text-3xl md:text-4xl',
        )}
        style={{ color: scoreColor, textShadow: `0 0 20px ${scoreColor}88` }}
        animate={
          revealResult
            ? isWinner
              ? { scale: [1, 1.18, 1.12], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1.2)'] }
              : { scale: [1, 0.88, 0.82], filter: ['brightness(1)', 'brightness(0.7)', 'brightness(0.6)'] }
            : {}
        }
        transition={{ duration: 0.8, type: 'spring', stiffness: 200 }}
      >
        {active ? formatPowerLevel(displayScore) : '0'}
      </motion.p>

      {/* Multiplier / buff label visible during count */}
      {active && !countDone && buffed && (
        <motion.span
          className="text-xs font-bold text-amber-400"
          initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ×{(targetScore / baseScore).toFixed(2)}
        </motion.span>
      )}

      {/* Modifier badges after count completes */}
      <AnimatePresence>
        {countDone && myModifiers.map((m, i) => {
          const delta = isPlayerA ? m.score_delta_a : m.score_delta_b
          return (
            <motion.div
              key={i}
              className={cn(
                'px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap border',
                delta > 0
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : delta < 0
                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                    : 'bg-white/10 text-white/50 border-white/20',
              )}
              initial={{ opacity: 0, y: 8, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.12, type: 'spring', stiffness: 320, damping: 20 }}
            >
              {m.description}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
