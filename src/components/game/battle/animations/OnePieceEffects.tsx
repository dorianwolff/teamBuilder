'use client'

/**
 * One Piece-verse specific visual effects.
 * Each effect is hand-crafted around real source-material techniques
 * and aimed from the attacker's side toward the opponent.
 *
 * ConquerorsHakiEffect — The power of a King; black lightning tears the sky
 *   and an invisible pressure wave knocks out all who lack the will to resist.
 *   Signature of Shanks, Gol D. Roger, Kaido, Silvers Rayleigh.
 *
 * AsuraEffect — Roronoa Zoro's demon-king manifestation.
 *   Three ghost faces of Asura materialise behind him; six arms appear holding
 *   nine blades.  Nine simultaneous phantom slashes carve toward the opponent.
 *
 * DiableJambeEffect — Sanji sets his leg ablaze through pure rotational friction.
 *   Ifrit Jambe produces white-blue "inferno fire" — the hottest technique.
 *   A blazing kick-arc of hell-fire carves through the air toward the enemy.
 *
 * GuraGuraEffect — Whitebeard cracks the very air with a single fist.
 *   The Gura Gura no Mi turns his body into the epicentre of an earthquake;
 *   reality fractures like glass, seismic waves roll outward, the sky splits.
 */

import { motion } from 'framer-motion'

interface EffectProps {
  color: string
  secondaryColor?: string
  side: 'left' | 'right'
}

// ─── Conqueror's Haki — Black Lightning, King's Pressure ─────────────────────

// Pre-computed SVG lightning paths for both sides
// side='left': attacker at ~22% x; side='right': attacker at ~78% x
// Each path is a jagged multi-point line (M start L ... joints)
const LIGHTNING_L = [
  'M22,55 L34,38 L27,27 L44,13 L37,5 L56,22 L72,38 L83,52',
  'M24,63 L31,46 L21,33 L40,19 L33,10',
  'M17,49 L29,35 L19,24 L38,12 L29,3',
  'M27,69 L40,52 L35,39 L54,27 L47,15 L65,31 L81,48',
  'M14,43 L23,30 L16,20 L30,7',
  'M20,58 L38,44 L32,33 L50,20 L44,10 L60,25',
]
const LIGHTNING_R = LIGHTNING_L.map(p =>
  p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${(100 - parseFloat(x)).toFixed(1)},${y}`)
)

const BOLT_DELAYS  = [0.10, 0.28, 0.45, 0.62, 0.80, 0.95]
const BOLT_WIDTHS  = [2.2, 1.8, 1.4, 1.9, 1.0, 1.6]
const BOLT_LENGTHS = [0.65, 0.50, 0.55, 0.72, 0.40, 0.58]

export function ConquerorsHakiEffect({ color, secondaryColor, side }: EffectProps) {
  const originX = side === 'left' ? 22 : 78
  const paths    = side === 'left' ? LIGHTNING_L : LIGHTNING_R
  const accent   = secondaryColor ?? '#7f1d1d'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Sky darkens — the will of a King oppresses the world */}
      <motion.div
        className="absolute inset-0 bg-black"
        animate={{ opacity: [0, 0.58, 0.42, 0.62, 0.28, 0] }}
        transition={{ duration: 3.4, times: [0, 0.12, 0.32, 0.52, 0.78, 1] }}
      />

      {/* Pressure aura radiating from the Haki user */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at ${originX}% 55%, ${accent}55 0%, ${color}22 28%, transparent 58%)`,
        }}
        animate={{ opacity: [0, 1, 0.75, 0.95, 0] }}
        transition={{ duration: 2.8 }}
      />

      {/* Primary SVG — hard black lightning bolts */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: `drop-shadow(0 0 2.5px ${accent})` }}
      >
        {paths.map((d, i) => (
          <motion.path
            key={`bolt-${i}`}
            d={d}
            stroke="#000000"
            strokeWidth={BOLT_WIDTHS[i]}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 0.85, 0] }}
            transition={{ duration: BOLT_LENGTHS[i], delay: BOLT_DELAYS[i], ease: 'easeOut' }}
          />
        ))}
      </svg>

      {/* Secondary SVG — soft glow halo around the main bolts */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: 'blur(3px)', opacity: 0.35 }}
      >
        {paths.slice(0, 3).map((d, i) => (
          <motion.path
            key={`glow-${i}`}
            d={d}
            stroke={accent}
            strokeWidth={BOLT_WIDTHS[i] * 3}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 0], opacity: [0, 0.6, 0] }}
            transition={{ duration: BOLT_LENGTHS[i] + 0.3, delay: BOLT_DELAYS[i] + 0.05 }}
          />
        ))}
      </svg>

      {/* Invisible pressure rings expanding from the user */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={`ring-${i}`}
          className="absolute border rounded-full"
          style={{
            left: `${originX}%`,
            top: '55%',
            transform: 'translate(-50%, -50%)',
            borderColor: `${color}44`,
          }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 100 + i * 90, height: 65 + i * 55, opacity: 0 }}
          transition={{ duration: 0.95, delay: 0.25 + i * 0.18 }}
        />
      ))}

      {/* White crack flash — sky splitting under the pressure */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.28, 0] }}
        transition={{ duration: 0.18, delay: 0.72 }}
      />

      {/* Vignette — the world around them darkens */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at ${originX}% 50%, transparent 10%, rgba(0,0,0,0.72) 88%)` }}
        animate={{ opacity: [0, 0.9, 0.55, 0.85, 0] }}
        transition={{ duration: 3.2, times: [0, 0.35, 0.55, 0.75, 1] }}
      />
    </div>
  )
}

// ─── Asura — Three-Sword Demon King ──────────────────────────────────────────

// Pre-computed 9 sword-slash directions (stable — no Math.random in JSX)
const SLASH_CONFIG = [
  { angle: -40, delay: 0.90, width: 2.5, len: 72 },
  { angle: -22, delay: 0.95, width: 2.0, len: 82 },
  { angle: -10, delay: 1.00, width: 2.8, len: 90 },
  { angle:   0, delay: 1.05, width: 2.2, len: 85 },
  { angle:  12, delay: 1.10, width: 2.4, len: 88 },
  { angle:  25, delay: 1.00, width: 1.8, len: 76 },
  { angle:  38, delay: 0.95, width: 2.0, len: 70 },
  { angle: -55, delay: 1.15, width: 1.6, len: 60 },
  { angle:  50, delay: 1.15, width: 1.6, len: 62 },
]

// Demon face positions relative to attacker (horizontal offset, vertical %)
const FACE_CONFIG = [
  { dx: 0,   top: 22, scale: 1.0,   delay: 0.10 }, // centre
  { dx: -28, top: 18, scale: 0.72,  delay: 0.22 }, // left ghost
  { dx:  28, top: 20, scale: 0.72,  delay: 0.30 }, // right ghost
]

export function AsuraEffect({ color, secondaryColor, side }: EffectProps) {
  const originX = side === 'left' ? '28%' : '72%'
  const originPct = side === 'left' ? 28 : 72
  const slashDir  = side === 'left' ? 1 : -1    // +1 → right, -1 → left
  const green     = color  // typically '#4ade80'
  const dark      = secondaryColor ?? '#052e16'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Demonic atmosphere — void-green darkness */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at ${originX} 50%, ${dark}cc 0%, ${green}22 45%, transparent 70%)`,
        }}
        animate={{ opacity: [0, 1, 0.8, 0.95, 0] }}
        transition={{ duration: 3, times: [0, 0.15, 0.45, 0.7, 1] }}
      />

      {/* Full-screen creeping darkness */}
      <motion.div
        className="absolute inset-0 bg-black"
        animate={{ opacity: [0, 0.45, 0.3, 0.5, 0] }}
        transition={{ duration: 2.8, times: [0, 0.2, 0.5, 0.72, 1] }}
      />

      {/* Three Asura ghost faces — each slightly different size/position */}
      {FACE_CONFIG.map((fc, i) => {
        const faceLeft = side === 'left'
          ? `calc(${originX} + ${fc.dx}px)`
          : `calc(${originX} - ${fc.dx}px)`
        return (
          <motion.div
            key={`face-${i}`}
            className="absolute"
            style={{
              top: `${fc.top}%`,
              left: faceLeft,
              transform: 'translate(-50%, 0)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, fc.scale * 1.25, fc.scale], opacity: [0, 0.75, 0.55, 0.7, 0] }}
            transition={{ duration: 2.2, delay: fc.delay, times: [0, 0.18, 0.4, 0.75, 1] }}
          >
            {/* Ghost head shape */}
            <div
              style={{
                width: 52 * fc.scale,
                height: 62 * fc.scale,
                borderRadius: '50% 50% 45% 45%',
                background: `radial-gradient(circle at 50% 38%, ${green}66 0%, ${dark}88 60%, transparent 85%)`,
                border: `1px solid ${green}55`,
                filter: 'blur(1.5px)',
                boxShadow: `0 0 22px 8px ${green}44`,
              }}
            />
            {/* Eyes — two glowing dots */}
            {[28, 72].map(ex => (
              <div
                key={ex}
                className="absolute rounded-full"
                style={{
                  width: 6 * fc.scale,
                  height: 5 * fc.scale,
                  background: green,
                  top: '38%',
                  left: `${ex}%`,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 8px 3px ${green}cc`,
                }}
              />
            ))}
          </motion.div>
        )
      })}

      {/* Nine sword slashes radiating toward the opponent */}
      {SLASH_CONFIG.map((s, i) => (
        <motion.div
          key={`slash-${i}`}
          className="absolute"
          style={{
            width: 2,
            height: s.len,
            left: `${originPct}%`,
            top: '52%',
            background: `linear-gradient(to top, transparent 0%, ${green}cc 35%, #ffffff 55%, ${green}aa 75%, transparent 100%)`,
            transformOrigin: 'bottom center',
            transform: `translate(-50%, -100%) rotate(${slashDir > 0 ? s.angle : -s.angle}deg)`,
            boxShadow: `0 0 4px 1px ${green}66`,
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1.2, 0], opacity: [0, 1, 0.7, 0] }}
          transition={{ duration: 0.32, delay: s.delay, ease: 'easeOut' }}
        />
      ))}

      {/* Green aura sparks flying outward */}
      {Array.from({ length: 14 }).map((_, i) => {
        const sparkAngle  = (i / 14) * 360
        const sparkRadius = 35 + (i % 4) * 18
        const sx = Math.cos((sparkAngle * Math.PI) / 180) * sparkRadius * slashDir
        const sy = Math.sin((sparkAngle * Math.PI) / 180) * sparkRadius * 0.6
        return (
          <motion.div
            key={`spark-${i}`}
            className="absolute rounded-full"
            style={{
              width: 3 + (i % 3),
              height: 3 + (i % 3),
              background: i % 3 === 0 ? '#ffffff' : green,
              left: `${originPct}%`,
              top: '52%',
              transform: 'translate(-50%,-50%)',
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{ x: sx, y: sy, opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{ duration: 0.5 + (i % 4) * 0.08, delay: 0.85 + (i % 5) * 0.04 }}
          />
        )
      })}

      {/* Flash of demonic energy at the moment of strike */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `${dark}dd` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.55, 0] }}
        transition={{ duration: 0.18, delay: 1.08 }}
      />
    </div>
  )
}

// ─── Diable Jambe — Infernal Fire Kick ────────────────────────────────────────

// Pre-computed fire particle positions (no Math.random in JSX)
const FIRE_PARTICLES = [
  { x: 2,  y: 65, size: 8,  dy: -55, delay: 0.0,  dur: 1.0 },
  { x: 10, y: 55, size: 12, dy: -70, delay: 0.05, dur: 1.2 },
  { x: 18, y: 70, size: 7,  dy: -45, delay: 0.1,  dur: 0.9 },
  { x: 6,  y: 60, size: 10, dy: -60, delay: 0.15, dur: 1.1 },
  { x: 22, y: 58, size: 6,  dy: -40, delay: 0.2,  dur: 0.85 },
  { x: 14, y: 72, size: 9,  dy: -65, delay: 0.08, dur: 1.15 },
  { x: 25, y: 63, size: 5,  dy: -50, delay: 0.25, dur: 0.95 },
  { x: 4,  y: 68, size: 11, dy: -58, delay: 0.12, dur: 1.05 },
  { x: 30, y: 57, size: 7,  dy: -48, delay: 0.18, dur: 1.0  },
  { x: 8,  y: 75, size: 8,  dy: -62, delay: 0.22, dur: 1.1  },
  { x: 20, y: 53, size: 13, dy: -72, delay: 0.03, dur: 1.3  },
  { x: 16, y: 66, size: 5,  dy: -42, delay: 0.28, dur: 0.88 },
]

// Kick arc path — curves from attacker's foot through a powerful arc toward opponent
const KICK_ARC_L = 'M28,72 Q45,25 82,48'   // left → right
const KICK_ARC_R = 'M72,72 Q55,25 18,48'   // right → left

export function DiableJambeEffect({ color, secondaryColor, side }: EffectProps) {
  const legX      = side === 'left' ? 22 : 78   // where the leg originates
  const kickArc   = side === 'left' ? KICK_ARC_L : KICK_ARC_R
  const fireColor = color            // blue-white: '#3b82f6' or orange: '#f97316'
  const coreColor = secondaryColor ?? '#ffffff'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Hell-fire atmosphere — infernal light flooding from the attacker */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at ${legX}% 68%, ${fireColor}77 0%, ${fireColor}22 35%, transparent 62%)`,
        }}
        animate={{ opacity: [0, 0.9, 0.7, 1, 0] }}
        transition={{ duration: 2.8, times: [0, 0.15, 0.45, 0.68, 1] }}
      />

      {/* Spinning fire vortex on the leg — the friction-ignition buildup */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={`vortex-${i}`}
          className="absolute rounded-full"
          style={{
            width: 50 - i * 10,
            height: 70 - i * 14,
            left: `${legX}%`,
            top: '65%',
            transform: 'translate(-50%, -50%)',
            background: i === 0
              ? `radial-gradient(circle, ${coreColor}cc 0%, ${fireColor}88 50%, transparent 80%)`
              : `radial-gradient(circle, ${fireColor}66 0%, transparent 70%)`,
            filter: `blur(${i * 2}px)`,
            boxShadow: `0 0 ${22 - i * 5}px ${10 - i * 2}px ${fireColor}66`,
          }}
          animate={{
            rotate: [0, i % 2 === 0 ? 720 : -720],
            scale:  [0.6, 1.3, 1.1, 1.4, 0.8],
            opacity: [0, 1, 0.85, 1, 0.5],
          }}
          transition={{
            rotate:  { duration: 1.8 - i * 0.2, repeat: 1, ease: 'easeInOut' },
            scale:   { duration: 2.2, times: [0, 0.18, 0.4, 0.7, 1] },
            opacity: { duration: 2.2, times: [0, 0.18, 0.4, 0.7, 1] },
            delay: i * 0.08,
          }}
        />
      ))}

      {/* Rising fire particles from the burning leg */}
      {FIRE_PARTICLES.map((p, i) => {
        const px = side === 'left' ? p.x : 100 - p.x - 30
        return (
          <motion.div
            key={`fire-${i}`}
            className="absolute rounded-full"
            style={{
              width:  p.size,
              height: p.size * 1.4,
              left:   `${px}%`,
              top:    `${p.y}%`,
              background: i % 3 === 0
                ? `radial-gradient(circle, ${coreColor} 20%, ${fireColor} 70%, transparent 100%)`
                : `radial-gradient(circle, ${fireColor}dd 30%, transparent 80%)`,
              filter: 'blur(1.5px)',
            }}
            initial={{ y: 0, opacity: 0, scale: 0 }}
            animate={{ y: p.dy, opacity: [0, 0.9, 0.7, 0], scale: [0, 1.2, 0.8, 0] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: 1, repeatDelay: 0.05 }}
          />
        )
      })}

      {/* SVG — blazing kick arc from leg to opponent */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Core arc — the kick's fire trail */}
        <motion.path
          d={kickArc}
          stroke={coreColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          style={{ filter: `drop-shadow(0 0 4px ${fireColor})` }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 0.9, 0] }}
          transition={{ duration: 0.55, delay: 0.55, ease: 'easeOut' }}
        />
        {/* Wide glow around the arc */}
        <motion.path
          d={kickArc}
          stroke={fireColor}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          style={{ filter: 'blur(3px)', opacity: 0.5 }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.55, 0] }}
          transition={{ duration: 0.7, delay: 0.52 }}
        />
      </svg>

      {/* Heat distortion wave spreading from impact */}
      {[0, 1].map(i => (
        <motion.div
          key={`heat-${i}`}
          className="absolute border rounded-full"
          style={{
            left: side === 'left' ? '80%' : '20%',
            top: '48%',
            transform: 'translate(-50%, -50%)',
            borderColor: `${fireColor}66`,
          }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 60 + i * 50, height: 60 + i * 50, opacity: 0 }}
          transition={{ duration: 0.7, delay: 1.02 + i * 0.12 }}
        />
      ))}

      {/* Final impact flash */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${side === 'left' ? '80%' : '20%'} 48%, ${coreColor}cc 0%, transparent 50%)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.75, 0] }}
        transition={{ duration: 0.25, delay: 1.05 }}
      />
    </div>
  )
}

// ─── Pika Pika no Mi — Speed of Light: Yasakani no Magatama ─────────────────

// Pre-computed laser beam paths (SVG lines in viewBox 0 0 100 100)
// side='left': origin near (22, Y) → opponent side right edge
// side='right': mirror of left
const LASER_PATHS_L = [
  'M22,38 L100,28',
  'M22,44 L100,42',
  'M22,50 L100,54',
  'M22,56 L100,62',
  'M22,62 L100,75',
  'M22,33 L100,18',
  'M22,68 L100,84',
  'M22,41 L100,36',
  'M22,53 L100,48',
  'M22,60 L100,68',
  'M22,35 L100,22',
  'M22,47 L100,44',
]
const LASER_PATHS_R = LASER_PATHS_L.map(p =>
  p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${(100 - parseFloat(x)).toFixed(1)},${y}`)
)

// Light orbs scattered around the origin — pre-charge buildup
const LIGHT_ORBS = [
  { ox: 12, oy: 30, size: 7,  delay: 0.05 },
  { ox: 28, oy: 22, size: 5,  delay: 0.09 },
  { ox: 8,  oy: 45, size: 6,  delay: 0.02 },
  { ox: 32, oy: 38, size: 4,  delay: 0.12 },
  { ox: 6,  oy: 60, size: 8,  delay: 0.07 },
  { ox: 24, oy: 68, size: 5,  delay: 0.14 },
  { ox: 15, oy: 78, size: 6,  delay: 0.04 },
  { ox: 35, oy: 55, size: 4,  delay: 0.11 },
  { ox: 10, oy: 15, size: 5,  delay: 0.16 },
  { ox: 30, oy: 12, size: 7,  delay: 0.08 },
]

// Lens-flare streaks (prismatic diagonal lines)
const LENS_FLARES = [
  { angle: 28,  length: 55, delay: 0.38, opacity: 0.55 },
  { angle: -18, length: 45, delay: 0.42, opacity: 0.40 },
  { angle: 52,  length: 38, delay: 0.36, opacity: 0.45 },
  { angle: -42, length: 60, delay: 0.44, opacity: 0.35 },
  { angle: 8,   length: 72, delay: 0.40, opacity: 0.50 },
]

const BEAM_DELAYS  = [0.30, 0.32, 0.30, 0.34, 0.36, 0.28, 0.38, 0.31, 0.33, 0.35, 0.29, 0.33]
const BEAM_LENGTHS = [0.12, 0.10, 0.12, 0.11, 0.13, 0.10, 0.14, 0.11, 0.12, 0.13, 0.10, 0.11]

export function LightSpeedEffect({ color, secondaryColor, side }: EffectProps) {
  const originX   = side === 'left' ? 22 : 78
  const paths     = side === 'left' ? LASER_PATHS_L : LASER_PATHS_R
  const gold      = color.includes('fef') || color.includes('fbb') ? color : '#fef9c3'
  const coreWhite = secondaryColor ?? '#ffffff'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Step 1 — Solar aura builds at the attacker's position */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 120,
          height: 120,
          left: `${originX}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${coreWhite} 10%, ${gold}cc 35%, ${gold}44 65%, transparent 80%)`,
          filter: 'blur(8px)',
        }}
        animate={{ scale: [0, 2.5, 1.8, 0.8], opacity: [0, 1, 0.9, 0.2] }}
        transition={{ duration: 0.55, times: [0, 0.18, 0.5, 1] }}
      />

      {/* Step 2 — Pre-charge orbs gathering around origin */}
      {LIGHT_ORBS.map((orb, i) => {
        const ox = side === 'left' ? orb.ox : 100 - orb.ox
        return (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full"
            style={{
              width:   orb.size,
              height:  orb.size,
              left:    `${ox}%`,
              top:     `${orb.oy}%`,
              background: `radial-gradient(circle, ${coreWhite} 20%, ${gold}cc 60%, transparent 90%)`,
              filter: 'blur(1px)',
              boxShadow: `0 0 ${orb.size * 2}px ${orb.size}px ${gold}99`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.8, 1.2, 0], opacity: [0, 1, 0.8, 0] }}
            transition={{ duration: 0.4, delay: orb.delay }}
          />
        )
      })}

      {/* Step 3 — Screen-wide blinding flash (the attack fires) */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at ${originX}% 50%, ${coreWhite}ee 0%, ${gold}99 35%, transparent 65%)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.85, 0] }}
        transition={{ duration: 0.35, delay: 0.28, times: [0, 0.12, 0.4, 1] }}
      />

      {/* Step 4 — Laser volley SVG beams */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Glowing beam halos */}
        {paths.map((d, i) => (
          <motion.path
            key={`halo-${i}`}
            d={d}
            stroke={gold}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            style={{ filter: 'blur(3px)' }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.6, 0.4, 0] }}
            transition={{ duration: BEAM_LENGTHS[i] + 0.14, delay: BEAM_DELAYS[i] }}
          />
        ))}
        {/* Core beam lines (white-hot centre) */}
        {paths.map((d, i) => (
          <motion.path
            key={`beam-${i}`}
            d={d}
            stroke={coreWhite}
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 0.9, 0] }}
            transition={{ duration: BEAM_LENGTHS[i], delay: BEAM_DELAYS[i], ease: 'linear' }}
          />
        ))}
      </svg>

      {/* Step 5 — Lens flare star-burst at origin */}
      {LENS_FLARES.map((flare, i) => (
        <motion.div
          key={`flare-${i}`}
          className="absolute"
          style={{
            left:   `${originX}%`,
            top:    '50%',
            width:  `${flare.length}%`,
            height: 1.5,
            transform: `translate(-50%, -50%) rotate(${flare.angle}deg)`,
            background: `linear-gradient(to right, transparent, ${coreWhite}${Math.round(flare.opacity * 255).toString(16).padStart(2,'0')}, transparent)`,
            filter: 'blur(1px)',
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 1, 0.7, 0], opacity: [0, flare.opacity, flare.opacity * 0.5, 0] }}
          transition={{ duration: 0.5, delay: flare.delay }}
        />
      ))}

      {/* Step 6 — Impact zone glow at the opponent side */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 90,
          height: 90,
          left: side === 'left' ? '88%' : '12%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${coreWhite}dd 0%, ${gold}88 40%, transparent 75%)`,
          filter: 'blur(6px)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2, 0.5, 0], opacity: [0, 1, 0.7, 0] }}
        transition={{ duration: 0.4, delay: 0.44, times: [0, 0.15, 0.55, 1] }}
      />

      {/* Step 7 — Afterglow: the battlefield still shines */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at ${originX}% 50%, ${gold}22 0%, transparent 55%)` }}
        animate={{ opacity: [0, 0, 0.9, 0.3, 0] }}
        transition={{ duration: 2.2, times: [0, 0.3, 0.5, 0.8, 1] }}
      />
    </div>
  )
}

// ─── Gura Gura no Mi — Reality-Crack Earthquake ───────────────────────────────

// Pre-computed crack lines radiating from the fist impact point
// SVG paths in viewBox="0 0 100 100"; origin near attacker's fist (~30% or ~70%)
// For side='left': fist at ~30,50; cracks spread right and toward opponent
const CRACK_PATHS_L = [
  // Primary crack — crosses entire screen to opponent
  'M30,50 L44,44 L40,36 L58,28 L53,18 L68,32 L82,42 L100,38',
  // Upward fracture branch
  'M30,50 L28,38 L35,28 L28,15',
  // Downward fracture branch
  'M30,50 L38,62 L32,74 L44,85',
  // Mid-right branch
  'M44,44 L55,40 L62,46 L72,38 L85,44',
  // Upper-right branch
  'M40,36 L48,26 L58,22 L70,28',
  // Short downward branch
  'M38,62 L48,68 L55,64 L65,72',
  // Spiderweb detail cracks
  'M58,28 L65,24 L70,18',
  'M58,28 L62,36 L70,34',
]
const CRACK_PATHS_R = CRACK_PATHS_L.map(p =>
  p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${(100 - parseFloat(x)).toFixed(1)},${y}`)
)

const CRACK_DELAYS  = [0.05, 0.12, 0.15, 0.22, 0.28, 0.35, 0.40, 0.44]
const CRACK_WIDTHS  = [2.4, 1.8, 1.8, 1.4, 1.2, 1.2, 0.8, 0.8]
const CRACK_LENGTHS = [0.7, 0.45, 0.42, 0.5, 0.44, 0.42, 0.35, 0.35]

// Debris particle pre-computed configs
const DEBRIS = [
  { dx:  55, dy: -35, size: 5, delay: 0.18 },
  { dx: -20, dy: -48, size: 3, delay: 0.22 },
  { dx:  70, dy:  10, size: 4, delay: 0.25 },
  { dx:  30, dy: -60, size: 6, delay: 0.15 },
  { dx: -40, dy: -25, size: 4, delay: 0.30 },
  { dx:  80, dy: -15, size: 3, delay: 0.20 },
  { dx:  10, dy: -70, size: 5, delay: 0.12 },
  { dx:  50, dy:  30, size: 4, delay: 0.28 },
  { dx: -60, dy: -10, size: 3, delay: 0.33 },
  { dx:  90, dy: -40, size: 6, delay: 0.16 },
  { dx: -15, dy: -55, size: 4, delay: 0.26 },
  { dx:  65, dy:  20, size: 3, delay: 0.35 },
]

export function GuraGuraEffect({ color, side }: EffectProps) {
  const fistX     = side === 'left' ? 30 : 70
  const paths     = side === 'left' ? CRACK_PATHS_L : CRACK_PATHS_R
  const white     = color.includes('fff') ? '#e0f2fe' : '#ffffff'

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Earthquake atmosphere — the world shudders */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${fistX}% 50%, ${white}44 0%, transparent 55%)` }}
        animate={{ opacity: [0, 1, 0.7, 0.9, 0] }}
        transition={{ duration: 2.5 }}
      />

      {/* Screen tremble — seismic oscillation */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: [0, -4, 3, -5, 2, -3, 4, -2, 1, 0],
          y: [0, 2, -3, 4, -2, 3, -4, 1, -2, 0],
        }}
        transition={{ duration: 1.0, delay: 0.1, times: [0,.1,.2,.3,.4,.5,.6,.7,.9,1] }}
      >
        {/* Main SVG crack layer — white fracture lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ filter: `drop-shadow(0 0 3px ${white})` }}
        >
          {paths.map((d, i) => (
            <motion.path
              key={`crack-${i}`}
              d={d}
              stroke={white}
              strokeWidth={CRACK_WIDTHS[i]}
              strokeLinecap="square"
              strokeLinejoin="miter"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1], opacity: [0, 1, 0.9] }}
              transition={{ duration: CRACK_LENGTHS[i], delay: CRACK_DELAYS[i], ease: 'easeOut' }}
            />
          ))}
        </svg>

        {/* Seismic energy glow behind cracks */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ filter: 'blur(4px)', opacity: 0.45 }}
        >
          {paths.slice(0, 4).map((d, i) => (
            <motion.path
              key={`glow-${i}`}
              d={d}
              stroke={white}
              strokeWidth={CRACK_WIDTHS[i] * 2.5}
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1], opacity: [0, 0.6, 0.3] }}
              transition={{ duration: CRACK_LENGTHS[i] + 0.2, delay: CRACK_DELAYS[i] }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Seismic shockwave rings expanding from the fist */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={`wave-${i}`}
          className="absolute rounded-full border-2"
          style={{
            left: `${fistX}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            borderColor: `${white}88`,
          }}
          initial={{ width: 0, height: 0, opacity: 0.9 }}
          animate={{ width: 80 + i * 70, height: 50 + i * 45, opacity: 0 }}
          transition={{ duration: 0.85, delay: 0.05 + i * 0.18 }}
        />
      ))}

      {/* Debris particles flying from the impact */}
      {DEBRIS.map((d, i) => {
        const rx = side === 'left' ? d.dx : -d.dx
        return (
          <motion.div
            key={`debris-${i}`}
            className="absolute rounded-sm"
            style={{
              width:  d.size,
              height: d.size * 0.6,
              background: i % 4 === 0 ? white : `${white}99`,
              left:  `${fistX}%`,
              top:   '50%',
              transform: 'translate(-50%,-50%)',
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x:       rx,
              y:       d.dy,
              opacity: [0, 1, 0.8, 0],
              scale:   [0, 1.4, 0.9, 0],
              rotate:  rx * 2,
            }}
            transition={{ duration: 0.55 + (i % 4) * 0.08, delay: d.delay, ease: 'easeOut' }}
          />
        )
      })}

      {/* Blinding white flash — the fist connecting with the air */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.65, 0.1, 0.4, 0] }}
        transition={{ duration: 0.5, delay: 0.04, times: [0, 0.08, 0.25, 0.6, 1] }}
      />

      {/* Afterglow — the energy lingers in the cracks */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${fistX}% 50%, ${white}33 0%, transparent 50%)` }}
        animate={{ opacity: [0, 0, 0.8, 0.4, 0] }}
        transition={{ duration: 2.2, times: [0, 0.2, 0.45, 0.75, 1] }}
      />
    </div>
  )
}
