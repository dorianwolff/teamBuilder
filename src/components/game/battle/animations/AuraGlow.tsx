'use client'

import { motion } from 'framer-motion'

interface AuraGlowProps {
  color: string
  intensity?: 'low' | 'medium' | 'high'
  pulse?: boolean
}

/** Radial aura glow rendered behind a character portrait */
export function AuraGlow({ color, intensity = 'medium', pulse = true }: AuraGlowProps) {
  const sizes = { low: 140, medium: 200, high: 280 }
  const size = sizes[intensity]
  const opacity = { low: 0.35, medium: 0.55, high: 0.75 }[intensity]

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0, scale: 0.4 }}
      animate={
        pulse
          ? { opacity: [0, opacity, opacity * 0.7, opacity], scale: [0.4, 1.05, 0.95, 1] }
          : { opacity, scale: 1 }
      }
      transition={{ duration: 0.7, ease: 'easeOut', times: pulse ? [0, 0.4, 0.7, 1] : undefined }}
      style={{ zIndex: 0 }}
    >
      {/* Core glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, ${color}cc 0%, ${color}44 50%, transparent 75%)`,
        }}
      />
      {/* Outer ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: size * 1.4,
          height: size * 1.4,
          background: `radial-gradient(circle, transparent 40%, ${color}22 70%, transparent 90%)`,
        }}
        animate={pulse ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}

/** Particle streaks that shoot outward from the center — used for power-up moments */
export function AuraParticles({ color, count = 12 }: { color: string; count?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 360
        const delay = (i / count) * 0.3
        const len = 40 + Math.random() * 60
        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              width: 2,
              height: len,
              background: `linear-gradient(to top, ${color}, transparent)`,
              transformOrigin: 'bottom center',
              transform: `translateX(-50%) rotate(${angle}deg) translateY(-100%)`,
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: [0, 1, 0], opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}
