'use client'

/**
 * Naruto-verse specific visual effects.
 * Each component is carefully designed around the real technique mechanics:
 *
 * ChidoriEffect  — Lightning chakra concentrated into the palm; the crackling
 *                  sounds like 1000 birds chirping (Chidori = 1000 birds).
 *                  A sphere of blue-white lightning forms, sparks scatter forward.
 *
 * KamuiEffect    — Obito / Kakashi Mangekyo Sharingan space-time ninjutsu.
 *                  Creates a spiral vortex that warps and absorbs matter into
 *                  another dimension. The world distorts around a dark void.
 *
 * EightGatesEffect — Removing the body's eight chakra limiters (Eight Gates).
 *                  Gate of Death (8th): blood-red aura, body destroys itself.
 *                  Lower gates: blue-green aura, explosive speed + pressure.
 *                  Characteristic: sweat evaporating under the heat.
 *
 * GentleFistEffect — Hyuga clan taijutsu using Byakugan to see chakra
 *                  pathways. Strikes tenketsu (chakra points) to seal them.
 *                  64/128 Palm strikes delivered with gentle precision.
 */

import { motion } from 'framer-motion'

interface EffectProps {
  color: string
  secondaryColor?: string
  side: 'left' | 'right'
}

// ─── Chidori — Lightning Palm, 1000 Birds ────────────────────────────────────

export function ChidoriEffect({ color, secondaryColor, side }: EffectProps) {
  const cx = side === 'left' ? '38%' : '62%'
  const cy = '56%'
  const sparkDir = side === 'left' ? 1 : -1
  const white = secondaryColor ?? '#ffffff'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Background lightning field */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${cx} ${cy}, ${color}77 0%, ${color}22 35%, transparent 65%)`,
        }}
        animate={{ opacity: [0, 1, 0.75, 1, 0.6, 0] }}
        transition={{ duration: 2, times: [0, 0.15, 0.35, 0.55, 0.8, 1] }}
      />

      {/* Central concentration sphere — the chakra gathering in the palm */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 58, height: 58,
          left: cx, top: cy,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, #ffffff 0%, ${color} 45%, transparent 75%)`,
          boxShadow: `0 0 30px 14px ${color}99, 0 0 60px 28px ${color}44`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2, 1.4, 1.7, 1.4], opacity: [0, 1, 0.9, 1, 0.85] }}
        transition={{ duration: 1.3, times: [0, 0.18, 0.4, 0.65, 1] }}
      />

      {/* Lightning arcs radiating from the palm — thin crackling bolts */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * 360
        const len   = 22 + (i % 3) * 14
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: 1.5,
              height: len,
              left: cx, top: cy,
              background: `linear-gradient(to top, transparent, ${color}, ${white})`,
              transformOrigin: 'bottom center',
              transform: `translate(-50%, -100%) rotate(${angle}deg)`,
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: [0, 1, 0.7, 1, 0], opacity: [0, 0.95, 0.6, 0.9, 0] }}
            transition={{
              duration: 0.22,
              delay: 0.28 + (i % 5) * 0.04,
              repeat: 5,
              repeatDelay: 0.04,
            }}
          />
        )
      })}

      {/* 1000 birds — electric sparks shooting in the attack direction */}
      {Array.from({ length: 28 }).map((_, i) => {
        const spread  = (Math.random() - 0.5) * 90
        const dist    = 70 + Math.random() * 160
        const isWhite = i % 4 === 0
        return (
          <motion.div
            key={`bird-${i}`}
            className="absolute rounded-sm"
            style={{
              width: 4, height: 1.5,
              background: isWhite ? '#ffffff' : color,
              left: cx, top: cy,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: sparkDir * (dist + (Math.random() - 0.5) * 30),
              y: spread,
              opacity: [0, 1, 0.8, 0],
              scale:   [0, 1.8, 0.9, 0],
            }}
            transition={{
              duration: 0.38 + Math.random() * 0.22,
              delay:    0.55 + Math.random() * 0.45,
              ease: 'easeOut',
            }}
          />
        )
      })}

      {/* Bright white flash at thrust moment */}
      <motion.div className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.45, 0] }}
        transition={{ duration: 0.14, delay: 1.05 }}
      />
      {/* Blue afterglow */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `${color}33` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.35, 0] }}
        transition={{ duration: 0.55, delay: 1.15 }}
      />
    </div>
  )
}

// ─── Kamui — Dimensional Vortex Absorption ───────────────────────────────────

export function KamuiEffect({ color, side }: EffectProps) {
  const cx = side === 'left' ? '32%' : '68%'
  // Sharingan red for the eye spiral, then void purple
  const spiralColor = '#dc2626'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* World darkening — the dimension closes in */}
      <motion.div
        className="absolute inset-0 bg-black"
        animate={{ opacity: [0, 0.35, 0.55, 0.25, 0] }}
        transition={{ duration: 2.5, times: [0, 0.2, 0.5, 0.8, 1] }}
      />

      {/* Outer dimensional tear — light bends at edges */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${cx} 50%, transparent 0%, ${color}22 35%, ${color}44 55%, transparent 70%)`,
        }}
        animate={{ opacity: [0, 0.6, 1, 0.4, 0] }}
        transition={{ duration: 2, times: [0, 0.2, 0.5, 0.8, 1] }}
      />

      {/* Space warping grid lines being sucked inward */}
      {Array.from({ length: 7 }).map((_, i) => {
        const y = 10 + i * 13
        return (
          <motion.div
            key={`grid-${i}`}
            className="absolute h-px w-full"
            style={{
              top: `${y}%`,
              background: `linear-gradient(to ${side === 'left' ? 'left' : 'right'}, transparent, ${color}55, transparent)`,
            }}
            animate={{
              scaleX:  [1, 1.15, 0.4, 0],
              x:       [0, side === 'left' ? -15 : 15, side === 'left' ? -50 : 50],
              opacity: [0, 0.7, 0.5, 0],
            }}
            transition={{ duration: 1.6, delay: 0.25 + i * 0.06 }}
          />
        )
      })}

      {/* Concentric spiral rings collapsing inward — Kamui's distinctive look */}
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={`ring-${i}`}
          className="absolute rounded-full border-2"
          style={{
            width: 48 + i * 38,
            height: 48 + i * 38,
            left: cx, top: '50%',
            transform: 'translate(-50%, -50%)',
            borderColor: i === 0 ? spiralColor : `${color}${70 - i * 12}`,
            borderStyle: i < 2 ? 'solid' : 'dashed',
          }}
          initial={{ scale: 1.6, opacity: 0, rotate: 0 }}
          animate={{
            scale:   [1.6, 1.0, 0.3, 0],
            opacity: [0, 0.85, 0.9, 0],
            rotate:  [0, i % 2 === 0 ? 270 : -270],
          }}
          transition={{ duration: 1.9, delay: i * 0.14, ease: 'easeIn' }}
        />
      ))}

      {/* Matter being absorbed — particles converging toward the void */}
      {Array.from({ length: 18 }).map((_, i) => {
        const startX = (Math.random() - 0.5) * 200
        const startY = (Math.random() - 0.5) * 160
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: 3 + Math.random() * 5,
              height: 3 + Math.random() * 5,
              background: i % 3 === 0 ? spiralColor : color,
              left: cx, top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ x: startX, y: startY, opacity: 0, scale: 1 }}
            animate={{ x: 0, y: 0, opacity: [0, 0.9, 0], scale: [1, 0.15] }}
            transition={{
              duration: 0.75 + Math.random() * 0.5,
              delay:    0.35 + Math.random() * 0.65,
            }}
          />
        )
      })}

      {/* Void core — absolute darkness at the center */}
      <motion.div
        className="absolute rounded-full bg-black"
        style={{
          left: cx, top: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 30px 15px ${color}66, inset 0 0 10px 5px ${spiralColor}44`,
        }}
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{
          width:   [0, 22, 65, 45],
          height:  [0, 22, 65, 45],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ duration: 1.9, times: [0, 0.18, 0.58, 1] }}
      />

      {/* Subtle vignette pulse */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${cx} 50%, transparent 20%, #000000 85%)` }}
        animate={{ opacity: [0, 0.4, 0.6, 0.2, 0] }}
        transition={{ duration: 2.5, times: [0, 0.2, 0.5, 0.8, 1] }}
      />
    </div>
  )
}

// ─── Eight Gates — Inner Gate Aura Burst ─────────────────────────────────────

export function EightGatesEffect({ color, side }: EffectProps) {
  const cx = side === 'left' ? '26%' : '74%'
  // Gate of Death (8th) uses red; lower gates use green/blue
  const isDeathGate = color === '#ef4444' || color === '#dc2626'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Explosive aura wash — the gate's energy floods the area */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at ${cx} 60%, ${color}99 0%, ${color}33 40%, transparent 70%)`,
        }}
        animate={{ opacity: [0, 1, 0.85, 1, 0.65, 0] }}
        transition={{ duration: 2.5, times: [0, 0.12, 0.3, 0.5, 0.78, 1] }}
      />

      {/* Shockwave rings exploding outward — air pressure from the gate */}
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={`wave-${i}`}
          className="absolute rounded-full border-2"
          style={{
            left: cx, top: '58%',
            transform: 'translate(-50%, -50%)',
            borderColor: color,
          }}
          initial={{ width: 0, height: 0, opacity: 0.9 }}
          animate={{ width: 90 + i * 105, height: 90 + i * 105, opacity: 0 }}
          transition={{ duration: 0.95, delay: 0.28 + i * 0.16 }}
        />
      ))}

      {/* Speed lines — the user's speed creates visible trails */}
      {Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * 360
        const len   = 35 + Math.random() * 65
        return (
          <motion.div
            key={`speed-${i}`}
            className="absolute"
            style={{
              width: 1.5, height: len,
              left: cx, top: '58%',
              background: `linear-gradient(to top, transparent, ${color}dd)`,
              transformOrigin: 'bottom center',
              transform: `translate(-50%, -100%) rotate(${angle}deg)`,
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: [0, 1.8, 0], opacity: [0, 0.9, 0] }}
            transition={{
              duration: 0.45,
              delay:    0.18 + Math.random() * 0.25,
              repeat:   2,
              repeatDelay: 0.18,
            }}
          />
        )
      })}

      {/* Sweat droplets — signature detail from the manga */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={`sweat-${i}`}
          className="absolute rounded-full"
          style={{
            width: 3,
            height: 5,
            background: 'rgba(180, 220, 255, 0.85)',
            left: side === 'left' ? `${10 + i * 9}%` : `${44 + i * 6}%`,
            top:  `${22 + Math.random() * 42}%`,
          }}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{ y: [-4, -18, -32], opacity: [0, 0.85, 0], scale: [0, 1, 0.5] }}
          transition={{ duration: 0.85 + Math.random() * 0.4, delay: 0.38 + i * 0.1 }}
        />
      ))}

      {/* Gate of Death — blood mist / red steam rising from damaged vessels */}
      {isDeathGate && Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={`steam-${i}`}
          className="absolute rounded-full"
          style={{
            width:  22 + Math.random() * 32,
            height: 22 + Math.random() * 32,
            background: `radial-gradient(circle, ${color}77, transparent)`,
            filter: 'blur(8px)',
            left: side === 'left' ? `${6 + i * 9}%` : `${40 + i * 6}%`,
            top:  `${18 + Math.random() * 60}%`,
          }}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0, 1.6, 1], y: -35 }}
          transition={{
            duration: 1.5 + Math.random() * 0.5,
            delay:    Math.random() * 0.5,
          }}
        />
      ))}

      {/* Central aura burst — the gate itself opening */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: cx, top: '58%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, #ffffff 8%, ${color} 40%, transparent 68%)`,
          boxShadow: `0 0 40px 20px ${color}88`,
        }}
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{ width: [0, 130, 90], height: [0, 130, 90], opacity: [0, 1, 0.65] }}
        transition={{ duration: 0.85, delay: 0.2 }}
      />
    </div>
  )
}

// ─── Gentle Fist — Byakugan, Tenketsu, 64 Palms ──────────────────────────────

export function GentleFistEffect({ color, side }: EffectProps) {
  const eyeLeft = side === 'left' ? '22%' : '78%'
  const palmCx  = side === 'left' ? '32%' : '68%'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Gentle chakra glow — pure and precise, not explosive */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${palmCx} 50%, ${color}44 0%, transparent 58%)`,
        }}
        animate={{ opacity: [0, 1, 0.75, 0] }}
        transition={{ duration: 2.2 }}
      />

      {/* Byakugan — vein network radiating from the eye position */}
      {Array.from({ length: 22 }).map((_, i) => {
        const angle = (i / 22) * 360
        const len   = 28 + (i % 5) * 16
        return (
          <motion.div
            key={`vein-${i}`}
            className="absolute"
            style={{
              width: 1,
              height: len,
              left: eyeLeft, top: '34%',
              background: `linear-gradient(to top, transparent, ${color})`,
              transformOrigin: 'bottom center',
              transform: `translate(-50%, -100%) rotate(${angle}deg)`,
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: [0, 1, 0.9], opacity: [0, 0.7, 0.5] }}
            transition={{ duration: 0.35, delay: i * 0.022 }}
          />
        )
      })}

      {/* Byakugan pupil — the distinctive white, pupil-less eye */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 18, height: 26,
          left: eyeLeft, top: '34%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #ffffff 55%, rgba(220,240,255,0.4) 100%)',
          boxShadow: `0 0 16px 8px ${color}99, 0 0 30px 15px ${color}44`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0.9] }}
        transition={{ duration: 0.38 }}
      />

      {/* Tenketsu points glowing — the chakra pathways lighting up */}
      {[
        { x: 22, y: 24 }, { x: 30, y: 40 }, { x: 18, y: 54 },
        { x: 34, y: 62 }, { x: 14, y: 68 }, { x: 28, y: 75 },
      ].map((pos, i) => {
        const leftVal = side === 'left' ? `${pos.x}%` : `${100 - pos.x}%`
        return (
          <motion.div
            key={`tenketsu-${i}`}
            className="absolute rounded-full"
            style={{
              width: 5, height: 5,
              left: leftVal, top: `${pos.y}%`,
              background: '#ffffff',
              boxShadow: `0 0 8px 4px ${color}77`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2.2, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 0.45, delay: 0.45 + i * 0.14 }}
          />
        )
      })}

      {/* 64 Palms — rapid chakra strikes converging from orbit to target */}
      {Array.from({ length: 32 }).map((_, i) => {
        const angle  = (i / 32) * Math.PI * 2
        const radius = 24 + (i % 5) * 16
        const startX = Math.cos(angle) * radius
        const startY = Math.sin(angle) * radius * 0.55
        return (
          <motion.div
            key={`palm-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: 7, height: 7,
              left: palmCx, top: '55%',
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 6px 3px ${color}88`,
            }}
            initial={{ x: startX, y: startY, scale: 0, opacity: 0 }}
            animate={{
              x:       [startX, startX * 0.35, 0],
              y:       [startY, startY * 0.35, 0],
              scale:   [0, 1.6, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.18 + (i % 5) * 0.025,
              delay:    0.82 + (i / 32) * 0.85,
              ease: 'easeOut',
            }}
          />
        )
      })}

      {/* Final release — soft chakra flash */}
      <motion.div className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.2, 0] }}
        transition={{ duration: 0.25, delay: 1.7 }}
      />
    </div>
  )
}
