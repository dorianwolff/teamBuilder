'use client'

/**
 * NumberReveal — post-clash score counting animation.
 *
 * Shows a character's effective battle score counting up from 0 with:
 *  - Eased count-up (cubic ease-out feel)
 *  - Random sparkle particles during count-up
 *  - Winner / loser size + colour transition when revealResult = true
 *
 * Modifier descriptions are now shown as floating impact text by
 * BattleAnimationSequence (FloatingModifiers) — NOT by this component.
 */

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { formatPowerLevel } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

interface NumberRevealProps {
  targetScore: number
  baseScore: number
  isWinner: boolean
  charName: string
  active: boolean
  revealResult: boolean
  duration?: number
}

// ─── Sparkle particle ─────────────────────────────────────────────────────────

const SPARKLE_CONFIGS = Array.from({ length: 40 }, (_, i) => ({
  x: (((i * 137.5) % 1) - 0.5) * 90,
  y: -(18 + ((i * 73) % 1) * 52),
  size: 3 + ((i * 41) % 1) * 5,
  dur: 0.55 + ((i * 29) % 1) * 0.35,
}))

function Sparkle({ color, slot }: { color: string; slot: typeof SPARKLE_CONFIGS[0] }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: slot.size, height: slot.size,
        background: color,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
      animate={{ x: slot.x, y: slot.y, opacity: [1, 0.8, 0], scale: [0, 1.5, 0] }}
      transition={{ duration: slot.dur, ease: 'easeOut' }}
    />
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NumberReveal({
  targetScore,
  baseScore,
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

  const buffed   = targetScore > baseScore
  const debuffed = targetScore < baseScore
  const scoreColor = revealResult
    ? (isWinner ? '#4ade80' : '#f87171')
    : buffed ? '#fbbf24' : debuffed ? '#f87171' : '#ffffff'

  useEffect(() => {
    if (!active) return
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    startRef.current = null

    function step(now: number) {
      if (!startRef.current) startRef.current = now
      const t     = Math.min(1, (now - startRef.current) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayScore(Math.floor(eased * targetScore))
      if (Math.random() < 0.22) {
        setSparkleKeys(prev => [...prev.slice(-20), Date.now() + Math.random() * 1000])
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
    <div className="relative flex flex-col items-center gap-1">
      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {active && sparkleKeys.map((k, ki) => (
          <Sparkle key={k} color={scoreColor} slot={SPARKLE_CONFIGS[ki % SPARKLE_CONFIGS.length]} />
        ))}
      </div>

      {/* Character name */}
      <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-medium truncate max-w-[110px] sm:max-w-[150px]">
        {charName}
      </p>

      {/* Score */}
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

      {/* Multiplier badge during count — replaces bottom badges */}
      {active && !countDone && buffed && (
        <motion.span
          className="text-xs font-bold text-amber-400 tabular-nums"
          initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          ×{(targetScore / baseScore).toFixed(2)}
        </motion.span>
      )}
      {active && !countDone && debuffed && (
        <motion.span
          className="text-xs font-bold text-red-400 tabular-nums"
          initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          ×{(targetScore / baseScore).toFixed(2)}
        </motion.span>
      )}
    </div>
  )
}
