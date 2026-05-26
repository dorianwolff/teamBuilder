'use client'

/**
 * Dragon Ball Z / Super specific visual effects.
 * Every component is hand-crafted around the exact source-material technique.
 *
 * UltraInstinctEffect  — Silver aura briefly ignites then VANISHES (mastered state has no aura);
 *                        six perfect dodge-afterimages; one concentrated silver strike at the end.
 * UltraEgoEffect       — Dark purple flame aura CRACKS when hit, then SWELLS stronger;
 *                        damage = power; destroyer ground-wave at the end.
 * HakaiEffect          — Atom-shaped violet orb forms and drifts slowly toward the target;
 *                        target dissolves into drifting purple dust — then absolute void.
 * LegendarySaiyanEffect— Most violent animation in the roster: chaotic asymmetric green aura,
 *                        internal green lightning, blank eyes, then gold ki columns erupt upward.
 * BeastModeEffect      — Vertical magenta geyser erupts from attacker; layered blue-white outer +
 *                        magenta inner aura; crimson eyes lock; constant magenta lightning arcs.
 * SpiritSwordEffect    — Gold+blue dual aura; hope particles gather from the whole field;
 *                        enormous white energy blade charges and cleaves across the screen.
 */

import { motion } from 'framer-motion'

interface EffectProps {
  color: string
  secondaryColor?: string
  side: 'left' | 'right'
}

// ─────────────────────────────────────────────────────────────────────────────
//  GOKU — MASTERED ULTRA INSTINCT
// ─────────────────────────────────────────────────────────────────────────────
// Silver aura ignites briefly, then DISAPPEARS (mastered = internalized power).
// Six pale silver afterimages mark perfect dodge positions.
// Orbiting particles move in precise circles — not explosive, CONTROLLED.
// One concentrated silver strike ends the sequence.

// Six dodge-afterimage positions — Goku's perfect evasion trail
const MUI_GHOSTS_L = [
  { x: 52, y: 25 }, { x: 68, y: 48 }, { x: 44, y: 62 },
  { x: 72, y: 28 }, { x: 38, y: 38 }, { x: 80, y: 58 },
]
const MUI_GHOSTS_R = MUI_GHOSTS_L.map(p => ({ x: 100 - p.x, y: p.y }))

// Orbital particles — eight in precise circular paths (pre-computed positions at t=0)
const ORBITAL_PARTICLES = Array.from({ length: 8 }, (_, i) => {
  const angle = (i * 45) * Math.PI / 180
  return {
    ox: Math.cos(angle) * 22,
    oy: Math.sin(angle) * 16,
    delay: i * 0.04,
  }
})

// Perfect single strike path
const MUI_STRIKE_L = 'M22,50 L88,48'
const MUI_STRIKE_R = 'M78,50 L12,48'

export function UltraInstinctEffect({ side }: EffectProps) {
  const originX  = side === 'left' ? 22 : 78
  const ghosts   = side === 'left' ? MUI_GHOSTS_L : MUI_GHOSTS_R
  const strike   = side === 'left' ? MUI_STRIKE_L : MUI_STRIKE_R

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Initial silver aura ignition — then it vanishes (mastered = no aura) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 110, height: 150,
          left: `${originX}%`, top: '48%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, #f8fafc55 0%, #e0f2fe33 30%, #cbd5e122 60%, transparent 80%)',
          filter: 'blur(12px)',
        }}
        animate={{ scale: [0, 1.6, 0.4, 0], opacity: [0, 0.85, 0.3, 0] }}
        transition={{ duration: 1.1, times: [0, 0.25, 0.6, 1] }}
      />

      {/* Magenta/blue particles briefly scatter — Sign of UI */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const angle = (i * 60) * Math.PI / 180
        const tx = Math.cos(angle) * 35
        const ty = Math.sin(angle) * 28
        return (
          <motion.div
            key={`sign-${i}`}
            className="absolute rounded-full"
            style={{
              width: 5, height: 5,
              left: `${originX}%`, top: '48%',
              transform: 'translate(-50%, -50%)',
              background: i % 2 === 0 ? '#e879f9' : '#818cf8',
              filter: 'blur(1.5px)',
              boxShadow: `0 0 6px 2px ${i % 2 === 0 ? '#e879f9' : '#818cf8'}`,
            }}
            animate={{ x: [0, tx], y: [0, ty], opacity: [0, 0.9, 0], scale: [0, 1.4, 0] }}
            transition={{ duration: 0.45, delay: 0.08 + i * 0.05 }}
          />
        )
      })}

      {/* Six ghost afterimages — perfect dodge positions */}
      {ghosts.map((g, i) => (
        <motion.div
          key={`ghost-${i}`}
          className="absolute"
          style={{
            width: 14, height: 26,
            left: `${g.x}%`, top: `${g.y}%`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(ellipse, #f8fafc33 0%, #e0f2fe22 50%, transparent 80%)',
            filter: 'blur(3px)',
            borderRadius: '40%',
            border: '1px solid #e2e8f033',
          }}
          animate={{ opacity: [0, 0.65, 0.4, 0] }}
          transition={{ duration: 0.6, delay: 0.7 + i * 0.09 }}
        />
      ))}

      {/* Orbital silver particles — perfectly ordered, not chaotic */}
      {ORBITAL_PARTICLES.map((p, i) => (
        <motion.div
          key={`orbital-${i}`}
          className="absolute rounded-full"
          style={{
            width: 4, height: 4,
            left: `${originX}%`, top: '48%',
            transform: 'translate(-50%, -50%)',
            background: '#f8fafc',
            boxShadow: '0 0 4px 2px #e0f2fe',
          }}
          animate={{
            x:       [p.ox, p.ox * 0.7, -p.ox, -p.ox * 0.7, p.ox],
            y:       [p.oy, -p.oy, -p.oy * 0.7, p.oy, p.oy],
            opacity: [0, 0.8, 0.6, 0.8, 0],
          }}
          transition={{ duration: 1.4, delay: 0.65 + p.delay, ease: 'linear' }}
        />
      ))}

      {/* The calm before the strike — field goes quiet, no aura */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at 50% 50%, #e0f2fe08 0%, transparent 60%)' }}
        animate={{ opacity: [0, 0, 0.4, 0.15, 0] }}
        transition={{ duration: 1.5, delay: 0.9, times: [0, 0.3, 0.55, 0.8, 1] }}
      />

      {/* Perfect silver strike — one clean line, no wasted energy */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Silver glow halo */}
        <motion.path
          d={strike} stroke="#e0f2fe" strokeWidth="4" strokeLinecap="round" fill="none"
          style={{ filter: 'blur(4px)' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.2, delay: 2.2 }}
        />
        {/* White-silver core */}
        <motion.path
          d={strike} stroke="#f8fafc" strokeWidth="1.2" strokeLinecap="round" fill="none"
          style={{ filter: 'drop-shadow(0 0 4px #ffffff)' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.14, delay: 2.22, ease: 'linear' }}
        />
      </svg>

      {/* Impact flash — one perfect hit */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 40, height: 40,
          left: side === 'left' ? '88%' : '12%',
          top: '48%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #ffffff 0%, #e0f2fe88 45%, transparent 75%)',
          filter: 'blur(5px)',
        }}
        animate={{ scale: [0, 2.8, 0], opacity: [0, 0.9, 0] }}
        transition={{ duration: 0.28, delay: 2.22 }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  VEGETA — ULTRA EGO: THE DESTROYER'S PRIDE
// ─────────────────────────────────────────────────────────────────────────────
// Dark purple flame aura — heavier and more opaque than any other ki form.
// Crack lines appear IN the aura (the damage he absorbed).
// Then the aura SWELLS, darkens, and explodes — damage = power.
// Destroyer ground wave spreads from impact.

// Crack lines through the aura — damage absorbed, feeding his power
const EGO_CRACKS_L = [
  'M18,42 L28,36 L22,28',
  'M26,58 L32,50 L28,40',
  'M14,50 L20,44 L16,36',
  'M30,62 L22,54 L26,44',
]
const EGO_CRACKS_R = EGO_CRACKS_L.map(p =>
  p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_: string, x: string, y: string) =>
    `${(100 - parseFloat(x)).toFixed(1)},${y}`))

// Purple lightning bolts — internal destroyer power
const EGO_LIGHTNING_L = [
  'M22,50 L30,36 L24,25 L34,12',
  'M18,50 L12,38 L18,28 L10,14',
  'M26,50 L38,40 L32,28 L44,18',
  'M20,50 L26,42 L20,32 L28,20',
]
const EGO_LIGHTNING_R = EGO_LIGHTNING_L.map(p =>
  p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_: string, x: string, y: string) =>
    `${(100 - parseFloat(x)).toFixed(1)},${y}`))

// Destroyer ground wave
const EGO_GROUND_WAVE_L = 'M22,72 C40,62 60,58 100,65'
const EGO_GROUND_WAVE_R = 'M78,72 C60,62 40,58 0,65'

export function UltraEgoEffect({ side }: EffectProps) {
  const originX  = side === 'left' ? 22 : 78
  const cracks   = side === 'left' ? EGO_CRACKS_L     : EGO_CRACKS_R
  const bolts    = side === 'left' ? EGO_LIGHTNING_L   : EGO_LIGHTNING_R
  const wave     = side === 'left' ? EGO_GROUND_WAVE_L : EGO_GROUND_WAVE_R

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Dark purple oppressive atmosphere */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${originX}% 50%, #3b0764 0%, #1e0535 35%, #0c0118 65%, transparent 88%)` }}
        animate={{ opacity: [0, 0.72, 0.88, 0.95, 0.6, 0] }}
        transition={{ duration: 3.6, times: [0, 0.12, 0.32, 0.55, 0.78, 1] }}
      />

      {/* Heavy purple aura — phase 1, initial size */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 80, height: 115,
          left: `${originX}%`, top: '48%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, #7c3aed55 0%, #5b21b633 30%, #3b076422 60%, transparent 80%)',
          filter: 'blur(8px)',
        }}
        animate={{ scale: [0, 1.2, 0.9, 1.6, 2.2, 0.4], opacity: [0, 0.8, 0.65, 0.9, 1, 0] }}
        transition={{ duration: 3.2, times: [0, 0.15, 0.32, 0.52, 0.7, 1] }}
      />

      {/* Crack lines — the damage he absorbed */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0 0 3px #a855f7)' }}
      >
        {cracks.map((d, i) => (
          <motion.path
            key={`crack-${i}`} d={d}
            stroke="#c084fc" strokeWidth="1.4" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 0.85, 0.6] }}
            transition={{ duration: 0.22, delay: 0.55 + i * 0.1 }}
          />
        ))}
      </svg>

      {/* Aura FLARES after absorbing damage — it gets darker and bigger */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 100, height: 140,
          left: `${originX}%`, top: '48%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, #4c1d9566 0%, #2e1065 40%, transparent 72%)',
          filter: 'blur(14px)',
        }}
        animate={{ scale: [0, 0, 1.8, 2.6], opacity: [0, 0, 0.9, 0.6] }}
        transition={{ duration: 2.0, delay: 1.0, times: [0, 0.25, 0.55, 1] }}
      />

      {/* Purple internal lightning — destroyer energy */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0 0 4px #a855f7)' }}
      >
        {bolts.map((d, i) => (
          <motion.path
            key={`bolt-${i}`} d={d}
            stroke={i % 2 === 0 ? '#a855f7' : '#7c3aed'}
            strokeWidth="1.3" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 0], opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.18, delay: 1.3 + i * 0.12, repeat: 2, repeatDelay: 0.2 }}
          />
        ))}
      </svg>

      {/* Eye glow — tyrian purple, magenta pupils — the destroyer's gaze */}
      {([-10, 10] as const).map((offset, i) => (
        <motion.div
          key={`eye-${i}`}
          className="absolute rounded-full"
          style={{
            width: 9, height: 6,
            left: `calc(${originX}% + ${offset}px)`,
            top: '36%',
            background: 'radial-gradient(circle, #e879f9 0%, #a855f7 55%, transparent 88%)',
            filter: 'blur(0.4px)',
            boxShadow: '0 0 12px 5px rgba(168,85,247,0.75)',
          }}
          animate={{ opacity: [0, 0, 0.9, 0.75, 1.0, 0] }}
          transition={{ duration: 3.0, times: [0, 0.14, 0.28, 0.52, 0.72, 1] }}
        />
      ))}

      {/* Destroyer ground wave */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d={wave} stroke="#7c3aed" strokeWidth="2.5"
          strokeLinecap="round" fill="none"
          style={{ filter: 'blur(3px)' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.75, 0] }}
          transition={{ duration: 0.55, delay: 2.45 }}
        />
      </svg>

      {/* Final explosion — swelled power detonates */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={`ring-${i}`}
          className="absolute rounded-full border-2"
          style={{
            left: `${originX}%`, top: '50%',
            transform: 'translate(-50%, -50%)',
            borderColor: `${i === 0 ? '#a855f7' : '#7c3aed'}66`,
            filter: 'blur(1px)',
          }}
          initial={{ width: 0, height: 0, opacity: 0.9 }}
          animate={{ width: 90 + i * 60, height: 70 + i * 45, opacity: 0 }}
          transition={{ duration: 0.6, delay: 2.5 + i * 0.14 }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  BEERUS — HAKAI: DESTRUCTION
// ─────────────────────────────────────────────────────────────────────────────
// An atom-shaped violet orb (sphere + orbiting ring) forms at Beerus's fingertip.
// It drifts slowly toward the opponent — destruction needs no hurry.
// On contact, the target dissolves into drifting purple-lit dust particles.
// Then absolute void — the target simply ceases to exist.

const DUST_PARTICLES = [
  { dx: 18, dy: -12, size: 4 }, { dx: -8, dy: -22, size: 3 },
  { dx: 28, dy:   4, size: 5 }, { dx: 10, dy: -30, size: 3 },
  { dx: -18, dy: -8, size: 4 }, { dx: 34, dy:  -6, size: 3 },
  { dx:  4, dy: -36, size: 4 }, { dx: 22, dy:  14, size: 3 },
  { dx: -24, dy:  5, size: 5 }, { dx: 40, dy: -18, size: 3 },
  { dx: -6, dy: -26, size: 4 }, { dx: 30, dy:  10, size: 3 },
  { dx: 12, dy:  22, size: 4 }, { dx: -14, dy: -18, size: 5 },
  { dx: 36, dy:   2, size: 3 }, { dx:  6, dy: -40, size: 4 },
  { dx: -30, dy: -2, size: 3 }, { dx: 20, dy: -24, size: 4 },
  { dx: -12, dy: 16, size: 3 }, { dx: 42, dy: -10, size: 5 },
  { dx:  2, dy:  28, size: 4 }, { dx: -22, dy: 12, size: 3 },
  { dx: 26, dy: -14, size: 5 }, { dx: -4, dy: -34, size: 3 },
]
const DUST_PARTICLES_R = DUST_PARTICLES.map(p => ({ ...p, dx: -p.dx }))

export function HakaiEffect({ side }: EffectProps) {
  const originX  = side === 'left' ? 22 : 78
  const targetX  = side === 'left' ? 78 : 22
  const dust     = side === 'left' ? DUST_PARTICLES : DUST_PARTICLES_R
  const travelX  = side === 'left' ? (targetX - originX) * 4.8 : (targetX - originX) * 4.8

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Very subtle tint — destruction is quiet */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at 50% 50%, #4c1d9511 0%, transparent 70%)' }}
        animate={{ opacity: [0, 0.6, 0.4, 0] }}
        transition={{ duration: 3.6, times: [0, 0.2, 0.65, 1] }}
      />

      {/* Atom orb — central sphere */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 22, height: 22,
          left: `${originX}%`, top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #c084fc 0%, #7c3aed 45%, #4c1d95 72%, transparent 90%)',
          filter: 'blur(1px)',
          boxShadow: '0 0 14px 5px #a855f788',
        }}
        animate={{ x: [0, travelX], opacity: [0, 1, 1, 0.9] }}
        transition={{ duration: 2.0, delay: 0.4, ease: 'easeIn', times: [0, 0.08, 0.7, 1] }}
      />

      {/* Orbiting ring around the atom */}
      <motion.div
        className="absolute rounded-full border-2"
        style={{
          width: 38, height: 16,
          left: `${originX}%`, top: '50%',
          transform: 'translate(-50%, -50%) rotateX(70deg)',
          borderColor: '#c084fc99',
          filter: 'blur(0.5px)',
        }}
        animate={{ x: [0, travelX], rotateZ: [0, 360], opacity: [0, 0.75, 0.75, 0] }}
        transition={{ duration: 2.0, delay: 0.4, ease: 'easeIn', rotateZ: { duration: 1.6, repeat: 1 } }}
      />

      {/* Target zone — where existence ends */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 55, height: 55,
          left: `${targetX}%`, top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #4c1d9544 0%, transparent 70%)',
          filter: 'blur(8px)',
        }}
        animate={{ scale: [0, 1.3, 0.6], opacity: [0, 0, 0.8, 0] }}
        transition={{ duration: 0.6, delay: 2.35, times: [0, 0.2, 0.65, 1] }}
      />

      {/* Target dissolves into violet dust */}
      {dust.map((p, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute rounded-full"
          style={{
            width: p.size, height: p.size,
            left: `${targetX}%`, top: '50%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, #d8b4fe 0%, #a855f7 55%, transparent 85%)`,
            filter: 'blur(0.8px)',
            boxShadow: '0 0 3px 1px #a855f766',
          }}
          animate={{ x: p.dx, y: p.dy, opacity: [0, 0.9, 0.7, 0], scale: [0, 1.2, 0.8, 0] }}
          transition={{ duration: 0.85, delay: 2.42 + i * 0.025, ease: 'easeOut' }}
        />
      ))}

      {/* Void — absolute nothingness where the target was */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: `${targetX}%`, top: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#000000',
          filter: 'blur(1px)',
        }}
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{ width: [0, 45, 20, 0], height: [0, 45, 20, 0], opacity: [0, 0.95, 0.8, 0] }}
        transition={{ duration: 0.9, delay: 2.88 }}
      />

      {/* Hakai text flash — the word of destruction */}
      <motion.div
        className="absolute"
        style={{
          left: `${originX}%`, top: '22%',
          transform: 'translate(-50%, -50%)',
          color: '#c084fc',
          fontSize: '11px',
          fontFamily: 'serif',
          fontStyle: 'italic',
          letterSpacing: '0.15em',
          textShadow: '0 0 8px #a855f7',
          whiteSpace: 'nowrap',
        }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        破壊
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  BROLY — LEGENDARY SUPER SAIYAN
// ─────────────────────────────────────────────────────────────────────────────
// Most violent animation in the roster.
// Green chaotic aura with golden inner outline; heavy screen shake; green internal
// lightning; eyes go blank white; ki columns erupt upward; sky turns green.

const LSSJ_LIGHTNING_L = [
  'M22,50 L32,34 L26,22 L36,8',
  'M18,50 L10,36 L16,24 L8,10',
  'M26,50 L40,38 L34,24 L46,12',
  'M16,50 L22,40 L14,28 L22,16',
  'M28,48 L38,32 L30,20 L42,6',
]
const LSSJ_LIGHTNING_R = LSSJ_LIGHTNING_L.map(p =>
  p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_: string, x: string, y: string) =>
    `${(100 - parseFloat(x)).toFixed(1)},${y}`))

// Ki columns shooting upward from floor (x positions, side='left')
const KI_COLUMNS_L  = [14, 22, 30, 38, 18]
const KI_COLUMNS_R  = KI_COLUMNS_L.map(x => 100 - x)

export function LegendarySaiyanEffect({ side }: EffectProps) {
  const originX  = side === 'left' ? 22 : 78
  const bolts    = side === 'left' ? LSSJ_LIGHTNING_L : LSSJ_LIGHTNING_R
  const columns  = side === 'left' ? KI_COLUMNS_L     : KI_COLUMNS_R

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Sky turns green — environmental colour shift */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, #052e1644 0%, transparent 55%)' }}
        animate={{ opacity: [0, 0.75, 0.65, 0] }}
        transition={{ duration: 3.8, times: [0, 0.18, 0.7, 1] }}
      />

      {/* Violent screen shake — more aggressive than Whitebeard */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: [0, -6, 5, -8, 4, -5, 7, -3, 5, -6, 3, -4, 2, 0],
          y: [0, 4, -5, 6, -3, 5, -6, 3, -4, 5, -2, 4, -3, 0],
        }}
        transition={{ duration: 1.4, delay: 0.35, times: [0,.07,.14,.21,.28,.35,.43,.5,.57,.64,.71,.78,.86,1] }}
      >
        {/* Chaotic green aura — NOT clean, erupting in uneven surges */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 100, height: 140,
            left: `${originX}%`, top: '46%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(ellipse, #fbbf2444 0%, #4ade8077 18%, #16a34a55 40%, #05260e33 65%, transparent 82%)',
            filter: 'blur(10px)',
          }}
          animate={{
            scale:   [0, 1.4, 1.0, 1.8, 1.3, 2.2, 1.6],
            opacity: [0, 0.9, 0.7, 1.0, 0.8, 0.95, 0.5],
          }}
          transition={{ duration: 2.8, times: [0, 0.14, 0.26, 0.42, 0.56, 0.72, 1] }}
        />

        {/* Green internal lightning — power within the aura */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ filter: 'drop-shadow(0 0 5px #4ade80)' }}
        >
          {bolts.map((d, i) => (
            <motion.path
              key={`bolt-${i}`} d={d}
              stroke={i % 2 === 0 ? '#4ade80' : '#86efac'}
              strokeWidth="1.4" strokeLinecap="round" fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 0], opacity: [0, 0.85, 0] }}
              transition={{ duration: 0.16, delay: 0.62 + i * 0.11, repeat: 3, repeatDelay: 0.28 }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Blank white eyes — the berserker state: consciousness lost */}
      {([-11, 11] as const).map((offset, i) => (
        <motion.div
          key={`eye-${i}`}
          className="absolute rounded-full"
          style={{
            width: 10, height: 7,
            left: `calc(${originX}% + ${offset}px)`,
            top: '36%',
            background: '#ffffff',
            boxShadow: '0 0 8px 3px rgba(255,255,255,0.8)',
          }}
          animate={{ opacity: [0, 0, 0.9, 1, 0.8, 0] }}
          transition={{ duration: 2.5, times: [0, 0.32, 0.44, 0.6, 0.78, 1] }}
        />
      ))}

      {/* Ki columns erupting upward — primal Saiyan power */}
      {columns.map((cx, i) => (
        <motion.div
          key={`col-${i}`}
          className="absolute"
          style={{
            left: `${cx}%`,
            bottom: '0%',
            width: 14 + i * 4,
            transformOrigin: 'bottom center',
            transform: 'translateX(-50%)',
            background: `linear-gradient(to top, #fbbf24cc, #4ade80aa, transparent)`,
            filter: 'blur(4px)',
          }}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: ['0%', '65%', '80%', '0%'], opacity: [0, 0.85, 0.7, 0] }}
          transition={{ duration: 0.9, delay: 1.65 + i * 0.09, times: [0, 0.18, 0.55, 1] }}
        />
      ))}

      {/* Full aura explosion at peak */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at ${originX}% 46%, #4ade8055 0%, #16a34a22 35%, transparent 62%)` }}
        animate={{ opacity: [0, 0, 0.95, 0.5, 0] }}
        transition={{ duration: 1.8, times: [0, 0.38, 0.55, 0.78, 1] }}
      />

      {/* Green aura particles erupting off body */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <motion.div
          key={`erupt-${i}`}
          className="absolute rounded-full"
          style={{
            width: 5 + (i % 3), height: 5 + (i % 3),
            left: `${originX + (-14 + i * 4)}%`,
            top: '46%',
            background: i % 3 === 0 ? '#fbbf24' : '#4ade80',
            filter: 'blur(1.5px)',
          }}
          animate={{ y: -(70 + i * 18), x: (-8 + i * 2) * 2, opacity: [0, 0.9, 0], scale: [0, 1.4, 0] }}
          transition={{ duration: 0.9 + i * 0.07, delay: 0.5 + i * 0.08 }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  GOHAN — BEAST MODE
// ─────────────────────────────────────────────────────────────────────────────
// Power erupts UPWARD — a magenta geyser, not an outward explosion.
// Layered aura: blue-white outer field, magenta inner layer tight to body.
// Magenta lightning arcs CONSTANTLY throughout (not just at explosion).
// Silver-gray hair, crimson red eyes, barely contained fury.

// Vertical geyser paths — power shooting skyward
const BEAST_GEYSER_L = [
  'M22,95 L20,55 L22,20 L21,0',
  'M18,95 L16,60 L18,25 L16,0',
  'M26,95 L28,58 L25,22 L27,0',
]
const BEAST_GEYSER_R = BEAST_GEYSER_L.map(p =>
  p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_: string, x: string, y: string) =>
    `${(100 - parseFloat(x)).toFixed(1)},${y}`))

// Magenta lightning arcing around the body
const BEAST_LIGHTNING_L = [
  'M22,48 L34,36 L28,24 L38,14',
  'M18,50 L8,38 L14,26 L6,14',
  'M26,48 L40,40 L34,28 L44,18',
  'M14,50 L4,42 L10,30 L2,18',
  'M28,50 L42,44 L38,32 L50,22',
]
const BEAST_LIGHTNING_R = BEAST_LIGHTNING_L.map(p =>
  p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_: string, x: string, y: string) =>
    `${(100 - parseFloat(x)).toFixed(1)},${y}`))

export function BeastModeEffect({ side }: EffectProps) {
  const originX = side === 'left' ? 22 : 78
  const geysers = side === 'left' ? BEAST_GEYSER_L     : BEAST_GEYSER_R
  const bolts   = side === 'left' ? BEAST_LIGHTNING_L  : BEAST_LIGHTNING_R

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Dark atmosphere — the rage is barely contained */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${originX}% 50%, #4a044e22 0%, #1a0020 35%, transparent 70%)` }}
        animate={{ opacity: [0, 0.65, 0.78, 0.5, 0] }}
        transition={{ duration: 3.6, times: [0, 0.14, 0.38, 0.72, 1] }}
      />

      {/* Blue-white outer aura field */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 120, height: 165,
          left: `${originX}%`, top: '48%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, transparent 30%, #bfdbfe22 55%, #93c5fd33 70%, transparent 85%)',
          filter: 'blur(10px)',
        }}
        animate={{ scale: [0, 1.2, 1.5, 1.3, 1.6], opacity: [0, 0.7, 0.8, 0.65, 0] }}
        transition={{ duration: 3.2, times: [0, 0.2, 0.45, 0.68, 1] }}
      />

      {/* Magenta inner aura tight to body */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 65, height: 95,
          left: `${originX}%`, top: '48%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, #f0abfc55 0%, #c026d355 30%, #86198f33 60%, transparent 80%)',
          filter: 'blur(6px)',
        }}
        animate={{ scale: [0, 1.3, 1.0, 1.5, 1.2], opacity: [0, 0.9, 0.7, 0.95, 0] }}
        transition={{ duration: 3.0, times: [0, 0.18, 0.38, 0.62, 1] }}
      />

      {/* Magenta geyser erupting UPWARD */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {geysers.map((d, i) => (
          <motion.path
            key={`geyser-${i}`} d={d}
            stroke={i === 0 ? '#f0abfc' : '#e879f9'}
            strokeWidth={3.5 - i * 0.8}
            strokeLinecap="round" fill="none"
            style={{ filter: `blur(${2 + i}px)` }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 0.85, 0.7] }}
            transition={{ duration: 0.38, delay: 0.4 + i * 0.06 }}
          />
        ))}
      </svg>

      {/* Constant magenta lightning — the form crackles nonstop */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0 0 4px #c026d3)' }}
      >
        {bolts.map((d, i) => (
          <motion.path
            key={`bolt-${i}`} d={d}
            stroke={i % 2 === 0 ? '#f0abfc' : '#c026d3'}
            strokeWidth="1.3" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 0], opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.15, delay: 0.55 + i * 0.14, repeat: 4, repeatDelay: 0.35 }}
          />
        ))}
      </svg>

      {/* Crimson red eyes — barely contained fury */}
      {([-10, 10] as const).map((offset, i) => (
        <motion.div
          key={`eye-${i}`}
          className="absolute rounded-full"
          style={{
            width: 10, height: 7,
            left: `calc(${originX}% + ${offset}px)`,
            top: '35%',
            background: 'radial-gradient(circle, #ef4444 0%, #b91c1c 55%, transparent 88%)',
            filter: 'blur(0.4px)',
            boxShadow: '0 0 14px 5px rgba(239,68,68,0.8)',
          }}
          animate={{ opacity: [0, 0, 0, 0.95, 0.8, 1, 0] }}
          transition={{ duration: 3.2, times: [0, 0.22, 0.35, 0.48, 0.6, 0.75, 1] }}
        />
      ))}

      {/* Power eruption flash */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at ${originX}% 48%, #f0abfc44 0%, #c026d322 30%, transparent 60%)` }}
        animate={{ opacity: [0, 0, 0.9, 0.6, 0] }}
        transition={{ duration: 1.8, times: [0, 0.3, 0.5, 0.72, 1] }}
      />

      {/* Upward particle streams — hair rising, energy ascending */}
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <motion.div
          key={`up-${i}`}
          className="absolute rounded-full"
          style={{
            width: 3 + (i % 2), height: 3 + (i % 2),
            left: `${originX + (-10 + i * 3.3)}%`,
            top: '55%',
            background: i % 2 === 0 ? '#f0abfc' : '#bfdbfe',
            filter: 'blur(1px)',
          }}
          animate={{ y: -(75 + i * 12), opacity: [0, 0.8, 0], scale: [0, 1.2, 0] }}
          transition={{ duration: 0.9 + i * 0.08, delay: 0.3 + i * 0.1, repeat: 2, repeatDelay: 0.4 }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  FUTURE TRUNKS — SPIRIT SWORD: SWORD OF HOPE
// ─────────────────────────────────────────────────────────────────────────────
// Dual gold+blue aura erupts — the composite Super Saiyan Rage field.
// Hope particles gather from ALL corners of the screen converging to the sword.
// The blade charges: blue → white → enormous energy sword extension.
// One vertical/diagonal cleaving slash across the field; light trail lingers.

// Hope particles converging from all corners to the attacker's sword hand
const HOPE_PARTICLES_L = [
  { sx: 95, sy: 5,  delay: 0.08 }, { sx: 95, sy: 50, delay: 0.12 },
  { sx: 95, sy: 92, delay: 0.06 }, { sx: 50, sy: 5,  delay: 0.10 },
  { sx: 50, sy: 92, delay: 0.14 }, { sx: 5,  sy: 25, delay: 0.04 },
  { sx: 5,  sy: 72, delay: 0.09 }, { sx: 75, sy: 12, delay: 0.11 },
  { sx: 78, sy: 82, delay: 0.07 }, { sx: 62, sy: 6,  delay: 0.13 },
  { sx: 68, sy: 92, delay: 0.05 }, { sx: 90, sy: 70, delay: 0.15 },
]
const HOPE_PARTICLES_R = HOPE_PARTICLES_L.map(p => ({ ...p, sx: 100 - p.sx }))

// The sword blade paths (charged energy blade)
const SWORD_BLADE_L = 'M28,75 L22,50 L28,22 L24,0'
const SWORD_BLADE_R = 'M72,75 L78,50 L72,22 L76,0'

// The slash path across the screen
const SLASH_PATH_L = 'M22,15 L95,82'
const SLASH_PATH_R = 'M78,15 L5,82'

export function SpiritSwordEffect({ side }: EffectProps) {
  const originX   = side === 'left' ? 22 : 78
  const particles = side === 'left' ? HOPE_PARTICLES_L : HOPE_PARTICLES_R
  const blade     = side === 'left' ? SWORD_BLADE_L    : SWORD_BLADE_R
  const slash     = side === 'left' ? SLASH_PATH_L     : SLASH_PATH_R

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Gold + blue dual aura eruption — Super Saiyan Rage field */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 110, height: 155,
          left: `${originX}%`, top: '48%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, #bfdbfe44 0%, #3b82f633 20%, #fbbf2422 45%, transparent 72%)',
          filter: 'blur(12px)',
        }}
        animate={{ scale: [0, 1.4, 1.1, 1.6, 0], opacity: [0, 0.8, 0.65, 0.75, 0] }}
        transition={{ duration: 3.2, times: [0, 0.18, 0.38, 0.65, 1] }}
      />

      {/* Hope particles gathering from the whole screen */}
      {particles.map((p, i) => {
        const tx = (originX - p.sx) * 4.5
        const ty = (50 - p.sy) * 3.5
        return (
          <motion.div
            key={`hope-${i}`}
            className="absolute rounded-full"
            style={{
              width: 4, height: 4,
              left: `${p.sx}%`, top: `${p.sy}%`,
              transform: 'translate(-50%, -50%)',
              background: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#38bdf8' : '#e0f2fe',
              filter: 'blur(1px)',
              boxShadow: `0 0 4px 2px ${i % 3 === 0 ? '#fbbf2488' : '#38bdf888'}`,
            }}
            animate={{ x: [0, tx], y: [0, ty], opacity: [0, 0.9, 0.75, 0], scale: [0, 1.2, 0] }}
            transition={{ duration: 0.85, delay: p.delay + i * 0.03, ease: 'easeIn' }}
          />
        )
      })}

      {/* Sword blade charging — blue → white energy extension */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Blue phase */}
        <motion.path
          d={blade} stroke="#38bdf8" strokeWidth="3.5"
          strokeLinecap="round" fill="none"
          style={{ filter: 'blur(3px)' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.45, delay: 0.95 }}
        />
        {/* White phase — full charge */}
        <motion.path
          d={blade} stroke="#ffffff" strokeWidth="1.8"
          strokeLinecap="round" fill="none"
          style={{ filter: 'drop-shadow(0 0 6px #38bdf8)' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 0.9, 0] }}
          transition={{ duration: 0.35, delay: 1.42 }}
        />
      </svg>

      {/* The cleaving slash — enormous blade carves across the screen */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Wide glow halo */}
        <motion.path
          d={slash} stroke="#93c5fd" strokeWidth="8"
          strokeLinecap="round" fill="none"
          style={{ filter: 'blur(6px)' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.65, 0] }}
          transition={{ duration: 0.25, delay: 1.82 }}
        />
        {/* Gold inner glow */}
        <motion.path
          d={slash} stroke="#fbbf24" strokeWidth="3"
          strokeLinecap="round" fill="none"
          style={{ filter: 'blur(2px)' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.7, 0] }}
          transition={{ duration: 0.2, delay: 1.84 }}
        />
        {/* White-hot core of the blade */}
        <motion.path
          d={slash} stroke="#ffffff" strokeWidth="1.5"
          strokeLinecap="round" fill="none"
          style={{ filter: 'drop-shadow(0 0 5px #38bdf8)' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.14, delay: 1.86, ease: 'linear' }}
        />
      </svg>

      {/* Blinding flash at full blade extension */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 48%, #ffffff55 0%, #38bdf822 35%, transparent 65%)' }}
        animate={{ opacity: [0, 0.88, 0] }}
        transition={{ duration: 0.22, delay: 1.88 }}
      />

      {/* Light trail lingering in the air — the cut */}
      <motion.div
        className="absolute"
        style={{
          left: 0, right: 0, top: 0, bottom: 0,
          background: `linear-gradient(${side === 'left' ? '145deg' : '35deg'}, transparent 30%, #93c5fd22 50%, transparent 70%)`,
        }}
        animate={{ opacity: [0, 0, 0.8, 0.4, 0] }}
        transition={{ duration: 1.2, times: [0, 0.45, 0.58, 0.8, 1] }}
      />

      {/* Hope aura aftermath — Trunks's determination */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${originX}% 48%, #3b82f611 0%, transparent 45%)` }}
        animate={{ opacity: [0, 0, 0.65, 0.3, 0] }}
        transition={{ duration: 1.5, times: [0, 0.45, 0.6, 0.82, 1] }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  JIREN — POWER IMPACT: WILL MADE PHYSICAL
// ─────────────────────────────────────────────────────────────────────────────
// Jiren's power is not ki — it is compressed WILL.
// Air particles are pulled INWARD before the eruption. A tiny red-gold orb forms
// from nothing. Four oval shockwave rings erupt in perfectly ordered radii —
// not chaotic but PRECISE. Gold will-arcs crack the sky. Ground fissures spread
// at his feet. The sphere drifts to the opponent with terrifying calm, detonates.

const JIREN_FISSURES_L = [
  'M22,72 L40,66 L58,68',
  'M22,72 L34,80 L50,84',
  'M22,72 L44,70 L68,70',
  'M22,72 L10,78 L2,84',
  'M22,72 L8,64 L0,58',
  'M22,72 L16,60 L6,52',
]
const JIREN_FISSURES_R = JIREN_FISSURES_L.map(p =>
  p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_: string, x: string, y: string) =>
    `${(100 - parseFloat(x)).toFixed(1)},${y}`))

const JIREN_ARCS_L = [
  'M22,50 L36,36 L28,22 L42,10',
  'M22,50 L8,38 L14,24 L4,10',
  'M22,50 L46,50 L52,32 L66,18',
  'M22,50 L-2,50 L-6,34 L8,20',
]
const JIREN_ARCS_R = JIREN_ARCS_L.map(p =>
  p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_: string, x: string, y: string) =>
    `${(100 - parseFloat(x)).toFixed(1)},${y}`))

// Inward compression sources — air pulled to the will-sphere before eruption
const JIREN_COMPRESS_L = [
  { sx: 46, sy: 32, delay: 0.12 }, { sx: 56, sy: 64, delay: 0.18 },
  { sx: 34, sy: 66, delay: 0.10 }, { sx: 62, sy: 42, delay: 0.15 },
  { sx: 10, sy: 55, delay: 0.08 }, { sx: 40, sy: 25, delay: 0.20 },
]
const JIREN_COMPRESS_R = JIREN_COMPRESS_L.map(p => ({ sx: 100 - p.sx, sy: p.sy, delay: p.delay }))

export function PowerImpactEffect({ side }: EffectProps) {
  const originX  = side === 'left' ? 22 : 78
  const targetX  = side === 'left' ? 78 : 22
  const fissures = side === 'left' ? JIREN_FISSURES_L  : JIREN_FISSURES_R
  const arcs     = side === 'left' ? JIREN_ARCS_L      : JIREN_ARCS_R
  const compress = side === 'left' ? JIREN_COMPRESS_L   : JIREN_COMPRESS_R
  const travelX  = (targetX - originX) * 4.8

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Oppressive red presence — Jiren's will suppresses the entire field */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${originX}% 50%, #3f0a0a 0%, #1a0404 35%, transparent 72%)` }}
        animate={{ opacity: [0, 0.5, 0.85, 0.72, 0.42, 0] }}
        transition={{ duration: 3.4, times: [0, 0.08, 0.22, 0.48, 0.75, 1] }}
      />

      {/* Air compression — particles pulled INWARD before eruption (opposite of explosion) */}
      {compress.map((p, i) => {
        const dx = (originX - p.sx) * 4.5
        const dy = (50 - p.sy) * 3.5
        return (
          <motion.div
            key={`compress-${i}`}
            className="absolute rounded-full"
            style={{
              width: 4, height: 4,
              left: `${p.sx}%`, top: `${p.sy}%`,
              transform: 'translate(-50%, -50%)',
              background: '#ef4444',
              filter: 'blur(1px)',
              boxShadow: '0 0 4px 2px #ef444477',
            }}
            animate={{ x: [0, dx], y: [0, dy], opacity: [0, 0.8, 0], scale: [0, 1.2, 0] }}
            transition={{ duration: 0.38, delay: p.delay, ease: 'easeIn' }}
          />
        )
      })}

      {/* The compressed will-sphere — small, dense, heavier than any ki blast */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 20, height: 20,
          left: `${originX}%`, top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #fef08a 0%, #ef4444 38%, #7f1d1d 70%, transparent 90%)',
          filter: 'blur(1.5px)',
          boxShadow: '0 0 18px 7px #ef444488',
        }}
        animate={{
          x:       [0, 0, 0, travelX],
          scale:   [0, 1.3, 1.0, 0.35],
          opacity: [0, 1,   1,   0],
        }}
        transition={{ duration: 2.3, delay: 0.5, times: [0, 0.08, 0.22, 1], ease: 'easeIn' }}
      />

      {/* Four shockwave rings — perfectly oval, immense weight to each ring */}
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={`ring-${i}`}
          className="absolute rounded-full border-2"
          style={{
            left: `${originX}%`, top: '50%',
            transform: 'translate(-50%, -50%)',
            borderColor: i === 0 ? '#ef4444cc' : i === 1 ? '#dc262688' : '#b91c1c55',
            filter: 'blur(1px)',
          }}
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{
            width:   [0, 35, 115 + i * 55],
            height:  [0, 26, 85  + i * 42],
            opacity: [0, 0.95, 0],
          }}
          transition={{ duration: 0.58, delay: 0.55 + i * 0.1, times: [0, 0.1, 1] }}
        />
      ))}

      {/* Gold will-lightning — not chaotic, deliberate arcs of compressed power */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0 0 3px #fbbf24)' }}
      >
        {arcs.map((d, i) => (
          <motion.path
            key={`arc-${i}`} d={d}
            stroke={i % 2 === 0 ? '#fbbf24' : '#f59e0b'}
            strokeWidth="1.3" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 0], opacity: [0, 0.88, 0] }}
            transition={{ duration: 0.24, delay: 0.58 + i * 0.09 }}
          />
        ))}
      </svg>

      {/* Ground fissures — the weight of his will cracks the earth beneath him */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0 0 2px #dc2626)' }}
      >
        {fissures.map((d, i) => (
          <motion.path
            key={`fissure-${i}`} d={d}
            stroke={i < 3 ? '#ef4444' : '#dc2626'}
            strokeWidth={1.7 - i * 0.12} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 0.9, 0.7] }}
            transition={{ duration: 0.28, delay: 0.6 + i * 0.04 }}
          />
        ))}
      </svg>

      {/* Impact detonation — the sphere strikes with the force of condensed will */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 55, height: 55,
          left: `${targetX}%`, top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #fef08a 0%, #ef4444aa 38%, transparent 72%)',
          filter: 'blur(6px)',
        }}
        animate={{ scale: [0, 2.8, 0.3, 0], opacity: [0, 0.95, 0.5, 0] }}
        transition={{ duration: 0.38, delay: 2.78 }}
      />

      {/* Quiet burning eyes — meditation + infinite pressure behind the calm */}
      {([-10, 10] as const).map((offset, i) => (
        <motion.div
          key={`eye-${i}`}
          className="absolute rounded-full"
          style={{
            width: 9, height: 5,
            left: `calc(${originX}% + ${offset}px)`,
            top: '36%',
            background: 'radial-gradient(circle, #fef08a 0%, #ef4444 50%, transparent 85%)',
            boxShadow: '0 0 10px 4px #ef444488',
            filter: 'blur(0.4px)',
          }}
          animate={{ opacity: [0, 0, 0.85, 0.9, 0.85, 0] }}
          transition={{ duration: 3.2, times: [0, 0.14, 0.26, 0.55, 0.75, 1] }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  CELL PERFECT — SOLAR KAMEHAMEHA
// ─────────────────────────────────────────────────────────────────────────────
// Cell's Solar Kamehameha would destroy the Earth. Perfect organism, perfect beam.
// Green-gold spiral arms gather in a DNA-helix charge pattern — Cell references
// his own genetic perfection. Then a WIDE beam fires: not a laser but a wall of
// green-gold destruction. Solar flares project perpendicular. The sky goes white.

const SOLAR_SPIRALS_L = [
  'M22,50 C12,24 40,14 50,32',
  'M22,50 C34,74 8,82 2,60',
  'M22,50 C46,40 54,20 38,10',
  'M22,50 C0,56 -6,40 10,26',
]
const SOLAR_SPIRALS_R = SOLAR_SPIRALS_L.map(p =>
  p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_: string, x: string, y: string) =>
    `${(100 - parseFloat(x)).toFixed(1)},${y}`))

// Solar flare y-offsets from beam axis (perpendicular jets)
const SOLAR_FLARE_Y = [-22, -13, 0, 13, 22]

export function SolarKamehamehaEffect({ side }: EffectProps) {
  const originX = side === 'left' ? 22 : 78
  const spirals = side === 'left' ? SOLAR_SPIRALS_L : SOLAR_SPIRALS_R

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Green ki flooding up — charge energy rising from the earth */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at ${originX}% 68%, #052e16 0%, #14532d28 30%, transparent 60%)` }}
        animate={{ opacity: [0, 0.7, 0.85, 0.5, 0] }}
        transition={{ duration: 3.2, times: [0, 0.18, 0.42, 0.72, 1] }}
      />

      {/* Spiral charging arms — DNA helix pattern as perfect Cell charges */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0 0 4px #4ade80)' }}
      >
        {spirals.map((d, i) => (
          <motion.path
            key={`spiral-${i}`} d={d}
            stroke={i % 2 === 0 ? '#4ade80' : '#fbbf24'}
            strokeWidth="1.8" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 0], opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.55, delay: 0.22 + i * 0.08 }}
          />
        ))}
      </svg>

      {/* Charge aura — green-gold pooling at origin as ki concentrates */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 90, height: 70,
          left: `${originX}%`, top: '52%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, #fbbf2444 0%, #4ade8055 28%, #16a34a33 55%, transparent 78%)',
          filter: 'blur(10px)',
        }}
        animate={{ scale: [0, 1.4, 1.8, 0.4], opacity: [0, 0.7, 0.9, 0] }}
        transition={{ duration: 0.95, delay: 0.35, times: [0, 0.25, 0.65, 1] }}
      />

      {/* THE WIDE BEAM — outer glow: not a thin laser, a wall of destruction */}
      <motion.div
        className="absolute"
        style={{
          left: side === 'left' ? `${originX}%` : 0,
          right: side === 'right' ? `${100 - originX}%` : 'auto',
          top: '50%', height: 42, marginTop: -21,
          transformOrigin: side === 'left' ? 'left center' : 'right center',
          background: `linear-gradient(${side === 'left' ? 'to right' : 'to left'}, #fbbf24 0%, #4ade80cc 10%, #16a34a88 42%, #4ade8044 70%, transparent 100%)`,
          filter: 'blur(5px)',
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 0.95, 0.9, 0] }}
        transition={{ duration: 0.62, delay: 0.95 }}
      />

      {/* Beam core — brighter, tighter band down the center */}
      <motion.div
        className="absolute"
        style={{
          left: side === 'left' ? `${originX}%` : 0,
          right: side === 'right' ? `${100 - originX}%` : 'auto',
          top: '50%', height: 16, marginTop: -8,
          transformOrigin: side === 'left' ? 'left center' : 'right center',
          background: `linear-gradient(${side === 'left' ? 'to right' : 'to left'}, #ffffff 0%, #fef9c3cc 12%, #4ade8099 42%, transparent 100%)`,
          filter: 'blur(1px)',
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 0.95, 0] }}
        transition={{ duration: 0.56, delay: 0.98 }}
      />

      {/* Solar flares — perpendicular energy jets projecting from the beam body */}
      {SOLAR_FLARE_Y.map((yOff, i) => (
        <motion.div
          key={`flare-${i}`}
          className="absolute"
          style={{
            left: side === 'left' ? '58%' : '42%',
            top: '50%',
            marginTop: yOff - 4,
            width: 26, height: 8,
            background: 'radial-gradient(ellipse, #fbbf24cc 0%, #4ade8055 50%, transparent 80%)',
            filter: 'blur(3px)',
            transform: `rotate(${yOff > 0 ? 28 : yOff < 0 ? -28 : 0}deg)`,
          }}
          animate={{ opacity: [0, 0.8, 0], scaleX: [0, 1, 0] }}
          transition={{ duration: 0.35, delay: 1.06 + i * 0.06 }}
        />
      ))}

      {/* Blinding green-gold nova at full output — planetary scale */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, #4ade8066 0%, #16a34a22 42%, transparent 70%)' }}
        animate={{ opacity: [0, 0, 0.95, 0] }}
        transition={{ duration: 0.38, delay: 1.02, times: [0, 0.2, 0.6, 1] }}
      />

      {/* White-out — this beam would blot out the sun itself */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `linear-gradient(${side === 'left' ? 'to right' : 'to left'}, transparent 18%, #fffbdd44 52%, #fef9c3aa 78%, #ffffff 100%)` }}
        animate={{ opacity: [0, 0, 0.8, 0] }}
        transition={{ duration: 0.32, delay: 1.06, times: [0, 0.3, 0.65, 1] }}
      />

      {/* Lingering green atmosphere after the beam — residual ki in the air */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `linear-gradient(${side === 'left' ? 'to right' : 'to left'}, transparent 14%, #4ade8011 45%, #16a34a0a 65%, transparent 80%)` }}
        animate={{ opacity: [0, 0, 0.65, 0.3, 0] }}
        transition={{ duration: 1.5, times: [0, 0.38, 0.55, 0.78, 1] }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  FRIEZA BLACK — BLACK FRIEZA
// ─────────────────────────────────────────────────────────────────────────────
// Ten years in the Hyperbolic Time Chamber. Frieza Black is the anti-Gold:
// no ceremony, no showmanship. The aura CONTRACTS inward — the opposite of an
// explosion. Darkness pools around him. Then a single perfect Death Beam fires
// at near-light speed (0.09s draw). The target simply ceases to exist.

const FRIEZA_INWARD_L = [
  'M55,22 C44,30 35,40 22,50',
  'M70,38 C58,42 44,46 22,50',
  'M62,68 C50,62 38,57 22,50',
  'M38,78 C34,68 28,60 22,50',
  'M8,35 C12,40 16,45 22,50',
]
const FRIEZA_INWARD_R = FRIEZA_INWARD_L.map(p =>
  p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_: string, x: string, y: string) =>
    `${(100 - parseFloat(x)).toFixed(1)},${y}`))

const FRIEZA_DEATH_BEAM_L = 'M22,50 L100,50'
const FRIEZA_DEATH_BEAM_R = 'M78,50 L0,50'

// Void particles — matter erased at the point of impact
const FRIEZA_VOID_L = [
  { dx: 22, dy: -18, size: 3 }, { dx: -12, dy: -28, size: 4 },
  { dx: 32, dy:   6, size: 3 }, { dx:  8, dy: -38, size: 3 },
  { dx:-22, dy: -12, size: 4 }, { dx: 38, dy:  -8, size: 3 },
  { dx:  -4, dy: 30, size: 3 }, { dx: 18, dy:  22, size: 4 },
]
const FRIEZA_VOID_R = FRIEZA_VOID_L.map(p => ({ ...p, dx: -p.dx }))

export function BlackFriezaEffect({ side }: EffectProps) {
  const originX  = side === 'left' ? 22 : 78
  const targetX  = side === 'left' ? 78 : 22
  const inward   = side === 'left' ? FRIEZA_INWARD_L      : FRIEZA_INWARD_R
  const beam     = side === 'left' ? FRIEZA_DEATH_BEAM_L  : FRIEZA_DEATH_BEAM_R
  const voidDust = side === 'left' ? FRIEZA_VOID_L         : FRIEZA_VOID_R

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Total silence — darkness descends before anything happens */}
      <motion.div
        className="absolute inset-0 bg-black"
        animate={{ opacity: [0, 0.55, 0.72, 0.45, 0.18, 0] }}
        transition={{ duration: 3.4, times: [0, 0.10, 0.25, 0.55, 0.75, 1] }}
      />

      {/* Imperial dark aura — CONTRACTING not expanding */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 88, height: 122,
          left: `${originX}%`, top: '48%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, #1e1b4b 0%, #0c0a28 30%, #04020e 60%, transparent 80%)',
          filter: 'blur(10px)',
        }}
        animate={{ scale: [0, 1.4, 0.7, 0.5, 0], opacity: [0, 0.9, 0.85, 0.75, 0] }}
        transition={{ duration: 1.5, times: [0, 0.22, 0.52, 0.75, 1] }}
      />

      {/* Inward swirl paths — power concentrating TO origin (unique to Frieza Black) */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0 0 2px #6d28d9)' }}
      >
        {inward.map((d, i) => (
          <motion.path
            key={`inward-${i}`} d={d}
            stroke={i % 2 === 0 ? '#6d28d9' : '#4c1d95'}
            strokeWidth="0.9" strokeLinecap="round" fill="none"
            style={{ filter: 'blur(0.5px)' }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 0], opacity: [0, 0.65, 0] }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: 'easeIn' }}
          />
        ))}
      </svg>

      {/* Imperial silhouette shimmer — 10 years worth of power in a quiet outline */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 28, height: 62,
          left: `${originX}%`, top: '48%',
          transform: 'translate(-50%, -50%)',
          border: '1px solid #4c1d9566',
          filter: 'blur(2px)',
        }}
        animate={{ opacity: [0, 0, 0.8, 0.5, 0] }}
        transition={{ duration: 1.0, delay: 0.5, times: [0, 0.25, 0.55, 0.8, 1] }}
      />

      {/* Death Beam — glow layer: thin, purple, silent */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d={beam} stroke="#4c1d95" strokeWidth="5"
          strokeLinecap="round" fill="none"
          style={{ filter: 'blur(3px)' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.55, 0.4, 0] }}
          transition={{ duration: 0.28, delay: 1.45, times: [0, 0.1, 0.65, 1] }}
        />
        {/* White-hot Death Beam core — 0.09s draw: INSTANT, precise, lethal */}
        <motion.path
          d={beam} stroke="#f8fafc" strokeWidth="1.5"
          strokeLinecap="round" fill="none"
          style={{ filter: 'drop-shadow(0 0 4px #7c3aed)' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.09, delay: 1.47, ease: 'linear' }}
        />
      </svg>

      {/* Void expanding at target — existence erased */}
      <motion.div
        className="absolute rounded-full bg-black"
        style={{
          left: `${targetX}%`, top: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(2px)',
        }}
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{ width: [0, 55, 35, 0], height: [0, 55, 35, 0], opacity: [0, 0.95, 0.85, 0] }}
        transition={{ duration: 0.75, delay: 1.56 }}
      />

      {/* Void particles — matter pulverised and scattered */}
      {voidDust.map((p, i) => (
        <motion.div
          key={`void-${i}`}
          className="absolute rounded-full"
          style={{
            width: p.size, height: p.size,
            left: `${targetX}%`, top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, #7c3aed 0%, #4c1d95 55%, transparent 85%)',
            filter: 'blur(0.8px)',
          }}
          animate={{ x: p.dx * 1.4, y: p.dy * 1.4, opacity: [0, 0.85, 0.6, 0], scale: [0, 1.2, 0.7, 0] }}
          transition={{ duration: 0.7, delay: 1.6 + i * 0.025 }}
        />
      ))}

      {/* Cold tyrian eyes — ten years of patience in a single gaze */}
      {([-10, 10] as const).map((offset, i) => (
        <motion.div
          key={`eye-${i}`}
          className="absolute rounded-full"
          style={{
            width: 8, height: 5,
            left: `calc(${originX}% + ${offset}px)`,
            top: '37%',
            background: 'radial-gradient(circle, #c084fc 0%, #7c3aed 60%, transparent 88%)',
            filter: 'blur(0.5px)',
            boxShadow: '0 0 10px 4px #7c3aed77',
          }}
          animate={{ opacity: [0, 0, 0.9, 0.75, 0.9, 0] }}
          transition={{ duration: 3.0, times: [0, 0.12, 0.24, 0.5, 0.72, 1] }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAJIN BUU PURE — CANDY BEAM: EXTINCTION AMUSEMENT
// ─────────────────────────────────────────────────────────────────────────────
// Pure Buu is a child with the destructive power of a god. He plays.
// Pink bubbles float up innocently — then the head-blob antenna fires a wavy
// candy beam. The target vanishes into cheerful pink dissolve particles.
// More bubbles float afterward because Buu is already bored and happy.

const BUU_BUBBLES_L = [
  { x: 14, y: 75, size: 10, delay: 0.04, rise: -55 },
  { x: 22, y: 80, size: 14, delay: 0.18, rise: -65 },
  { x: 30, y: 72, size: 8,  delay: 0.28, rise: -48 },
  { x: 18, y: 85, size: 12, delay: 0.10, rise: -70 },
  { x: 28, y: 78, size: 9,  delay: 0.22, rise: -58 },
  { x: 12, y: 88, size: 11, delay: 0.33, rise: -62 },
  { x: 24, y: 68, size: 7,  delay: 0.15, rise: -42 },
  { x: 20, y: 90, size: 13, delay: 0.38, rise: -72 },
]
const BUU_BUBBLES_R = BUU_BUBBLES_L.map(b => ({ ...b, x: 100 - b.x }))

// Wavy candy beam — it wobbles like Buu himself
const BUU_BEAM_L = 'M22,50 C42,38 58,62 74,48 C84,40 92,54 100,50'
const BUU_BEAM_R = 'M78,50 C58,38 42,62 26,48 C16,40 8,54 0,50'

// Pink dissolve particles — existence turned to candy
const BUU_DISSOLVE_L = [
  { dx: 24, dy: -18, size: 5 }, { dx: -10, dy: -26, size: 4 },
  { dx: 30, dy:   8, size: 6 }, { dx: 12, dy: -34, size: 4 },
  { dx:-20, dy: -10, size: 5 }, { dx: 36, dy:  -4, size: 4 },
  { dx:  6, dy: -42, size: 5 }, { dx: 28, dy:  18, size: 4 },
  { dx:-26, dy:   8, size: 6 }, { dx: 42, dy: -16, size: 4 },
  { dx: -8, dy:  28, size: 5 }, { dx: 18, dy: -22, size: 4 },
]
const BUU_DISSOLVE_R = BUU_DISSOLVE_L.map(p => ({ ...p, dx: -p.dx }))

export function CandyBeamEffect({ side }: EffectProps) {
  const originX  = side === 'left' ? 22 : 78
  const targetX  = side === 'left' ? 78 : 22
  const bubbles  = side === 'left' ? BUU_BUBBLES_L   : BUU_BUBBLES_R
  const beam     = side === 'left' ? BUU_BEAM_L       : BUU_BEAM_R
  const dissolve = side === 'left' ? BUU_DISSOLVE_L   : BUU_DISSOLVE_R

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Sweet pink innocence — the most dangerous aura in the roster */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${originX}% 55%, #fce7f344 0%, transparent 62%)` }}
        animate={{ opacity: [0, 0.7, 0.55, 0.65, 0] }}
        transition={{ duration: 3.0, times: [0, 0.18, 0.45, 0.72, 1] }}
      />

      {/* Floating pink bubbles — cheerful, innocent, before the erasure */}
      {bubbles.map((b, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full"
          style={{
            width: b.size, height: b.size,
            left: `${b.x}%`, top: `${b.y}%`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, #fdf2f8 20%, #f9a8d499 55%, transparent 82%)',
            border: '0.5px solid #f472b666',
            filter: 'blur(0.8px)',
            boxShadow: '0 0 4px 2px #f9a8d444',
          }}
          animate={{ y: [0, b.rise], opacity: [0, 0.8, 0.9, 0.6, 0], scale: [0, 1, 1.1, 0.9, 0] }}
          transition={{ duration: 0.9 + i * 0.08, delay: b.delay }}
        />
      ))}

      {/* Head-blob antenna glow — the launcher charges up */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 12, height: 12,
          left: `${originX}%`, top: '22%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #f9a8d4 0%, #f472b6 55%, transparent 85%)',
          filter: 'blur(2px)',
          boxShadow: '0 0 10px 4px #f9a8d488',
        }}
        animate={{ scale: [0, 1.5, 2.2, 0.3], opacity: [0, 0.9, 1, 0] }}
        transition={{ duration: 0.55, delay: 0.45 }}
      />

      {/* Candy Beam — wavy, wobbly, deceptively cheerful */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Pink glow halo */}
        <motion.path
          d={beam} stroke="#f9a8d4" strokeWidth="6"
          strokeLinecap="round" fill="none"
          style={{ filter: 'blur(4px)' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.65, 0.55, 0] }}
          transition={{ duration: 0.38, delay: 0.98 }}
        />
        {/* Bright pink core */}
        <motion.path
          d={beam} stroke="#f472b6" strokeWidth="2.5"
          strokeLinecap="round" fill="none"
          style={{ filter: 'drop-shadow(0 0 4px #f9a8d4)' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.3, delay: 1.0, ease: 'linear' }}
        />
        {/* White sparkle core */}
        <motion.path
          d={beam} stroke="#fdf2f8" strokeWidth="1"
          strokeLinecap="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.22, delay: 1.02, ease: 'linear' }}
        />
      </svg>

      {/* Target dissolves — the opponent is now candy */}
      {dissolve.map((p, i) => (
        <motion.div
          key={`candy-${i}`}
          className="absolute rounded-full"
          style={{
            width: p.size, height: p.size,
            left: `${targetX}%`, top: '50%',
            transform: 'translate(-50%, -50%)',
            background: i % 3 === 0 ? '#f9a8d4' : i % 3 === 1 ? '#fbbf24' : '#fdf2f8',
            filter: 'blur(0.8px)',
            boxShadow: `0 0 3px 1px ${i % 3 === 0 ? '#f9a8d4' : '#fbbf24'}66`,
          }}
          animate={{ x: p.dx * 1.6, y: p.dy * 1.6, opacity: [0, 0.9, 0.7, 0], scale: [0, 1.3, 0.9, 0] }}
          transition={{ duration: 0.7, delay: 1.35 + i * 0.03 }}
        />
      ))}

      {/* Post-dissolve bubbles — Buu happy, already bored, playing again */}
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={`post-${i}`}
          className="absolute rounded-full"
          style={{
            width: 8 + i * 2, height: 8 + i * 2,
            left: `${targetX + (-8 + i * 5)}%`,
            top: '60%',
            background: 'radial-gradient(circle, #fdf2f8 20%, #f9a8d477 55%, transparent 82%)',
            border: '0.5px solid #f472b655',
            filter: 'blur(0.8px)',
          }}
          animate={{ y: [0, -(42 + i * 15)], opacity: [0, 0.7, 0], scale: [0, 1, 0.6, 0] }}
          transition={{ duration: 0.85, delay: 2.05 + i * 0.1 }}
        />
      ))}

      {/* Satisfied aura — Buu enjoyed this */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${originX}% 55%, #f9a8d415 0%, transparent 50%)` }}
        animate={{ opacity: [0, 0, 0.6, 0.3, 0] }}
        transition={{ duration: 1.4, times: [0, 0.42, 0.58, 0.8, 1] }}
      />
    </div>
  )
}
