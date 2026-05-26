'use client'

/**
 * Hunter × Hunter–verse specific visual effects.
 * Every component is hand-crafted around the exact source-material technique.
 *
 * AdultGonEffect      — Ink-black forbidden aura; white ghost-eyes stare from the void;
 *                       single compression-detonation palm strike shatters the ground.
 * GodspeedEffect      — Body converts to pure electricity; six dodge afterimages scatter;
 *                       Narukami thunderbolt falls from the sky with branching filaments.
 * ZeroHandEffect      — Prayer orbs converge; golden Kannon mandala briefly blazes;
 *                       beam cycles red→orange→yellow→green→blue→purple→white nova.
 * BungeeGumEffect     — Playing cards launch across the field; pink elastic strands reach
 *                       and snap; theatrical magician's flourish on impact.
 * SkillHunterEffect   — The grimoire opens; eight stolen-ability aura rings layer
 *                       simultaneously in different colours — every technique at once.
 * EmperorTimeEffect   — Crimson eyes flood the whole screen red; eight metallic chain
 *                       paths erupt from the attacker; Chain Jail prison bars close.
 * RisingSunEffect     — Darkness first; a small ball ascends; the miniature sun expands
 *                       into a blinding orange-red corona that burns the entire field.
 * TerpsichoraEffect   — Cat-ear silhouette materialises; faint marionette strings hang
 *                       from above; rapid mechanical strike positions fire in sequence.
 * RoyalPhotonEffect   — Meruem's absorbed Nen: crushing dark aura → directional blast
 *                       → gold photon motes scatter (Pouf's light) → golden void nova.
 */

import { motion } from 'framer-motion'

interface EffectProps {
  color: string
  secondaryColor?: string
  side: 'left' | 'right'
}

// ─────────────────────────────────────────────────────────────────────────────
//  GON ADULT — FORBIDDEN JAJANKEN: ROCK
// ─────────────────────────────────────────────────────────────────────────────

const GON_TENDRILS_L = [
  'M22,62 C17,44 23,28 18,10', 'M26,58 C31,40 23,24 29,7',
  'M18,68 C13,52 19,36 14,18', 'M25,72 C29,56 21,44 26,28',
  'M15,60 C11,44 17,30 12,14', 'M30,64 C36,48 27,34 32,18',
]
const GON_TENDRILS_R = GON_TENDRILS_L.map(p =>
  p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_: string, x: string, y: string) =>
    `${(100 - parseFloat(x)).toFixed(1)},${y}`))

const GON_CRACKS_L = [
  'M82,68 L100,64', 'M82,68 L99,74', 'M82,68 L94,84',
  'M82,68 L86,93',  'M82,68 L74,92', 'M82,68 L64,85',
]
const GON_CRACKS_R = [
  'M18,68 L0,64', 'M18,68 L1,74', 'M18,68 L6,84',
  'M18,68 L14,93', 'M18,68 L26,92', 'M18,68 L36,85',
]

export function AdultGonEffect({ side }: EffectProps) {
  const originX  = side === 'left' ? 22 : 78
  const impactX  = side === 'left' ? 82 : 18
  const tendrils = side === 'left' ? GON_TENDRILS_L : GON_TENDRILS_R
  const cracks   = side === 'left' ? GON_CRACKS_L   : GON_CRACKS_R

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Ink-black flood — the wrong darkness pours from his body */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${originX}% 55%, #030803 0%, #060e06 30%, #0a100a 65%, transparent 90%)` }}
        animate={{ opacity: [0, 0.92, 0.97, 0.68, 0] }}
        transition={{ duration: 3.4, times: [0, 0.14, 0.36, 0.72, 1] }}
      />

      {/* Full screen dark vignette — everything is consumed */}
      <motion.div
        className="absolute inset-0 bg-black"
        animate={{ opacity: [0, 0.5, 0.4, 0.15, 0] }}
        transition={{ duration: 3.0, times: [0, 0.2, 0.45, 0.75, 1] }}
      />

      {/* White ghost eyes — two cold dots staring through the void */}
      {([-11, 11] as const).map((offset, i) => (
        <motion.div
          key={`eye-${i}`}
          className="absolute rounded-full"
          style={{
            width: 9, height: 6,
            left: `calc(${originX}% + ${offset}px)`,
            top: '37%',
            background: 'radial-gradient(circle, #ffffff 0%, #d1fae5 55%, transparent 88%)',
            filter: 'blur(0.8px)',
            boxShadow: '0 0 16px 6px rgba(255,255,255,0.9)',
          }}
          animate={{ opacity: [0, 0, 0.95, 0.75, 1.0, 0] }}
          transition={{ duration: 2.9, times: [0, 0.13, 0.27, 0.5, 0.73, 1] }}
        />
      ))}

      {/* Shadow tendrils rising — the aura that should not exist */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {tendrils.map((d, i) => (
          <motion.path
            key={`tendril-${i}`} d={d}
            stroke="#0d1e0d" strokeWidth="2.8" strokeLinecap="round" fill="none"
            style={{ filter: 'blur(2.5px)' }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 0.85, 0.5, 0] }}
            transition={{ duration: 1.7, delay: 0.07 + i * 0.1, ease: 'easeOut' }}
          />
        ))}
      </svg>

      {/* Dark-green core aura — condensed, wrongly coloured, oppressive */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 95, height: 130,
          left: `${originX}%`, top: '48%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, #042a0a 0%, #05380c 22%, #020802 55%, transparent 80%)',
          filter: 'blur(14px)',
        }}
        animate={{ scale: [0, 1.5, 2.1, 1.3], opacity: [0, 0.95, 1, 0.25] }}
        transition={{ duration: 1.9, delay: 0.15, times: [0, 0.22, 0.52, 1] }}
      />

      {/* Coiling dark aura rings — electricity that looks wrong */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={`ring-${i}`}
          className="absolute rounded-full border"
          style={{
            width: 60 + i * 24, height: 60 + i * 24,
            left: `${originX}%`, top: '48%',
            transform: 'translate(-50%, -50%)',
            borderColor: '#4ade8033',
            filter: 'blur(2.5px)',
          }}
          animate={{ scale: [0.8, 1.06, 0.9, 1.12, 0], opacity: [0, 0.55, 0.38, 0.6, 0] }}
          transition={{ duration: 0.85, delay: 0.55 + i * 0.16, repeat: 1, repeatDelay: 0.18 }}
        />
      ))}

      {/* Strike loading — all aura compresses to fist */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 38, height: 38,
          left: `${side === 'left' ? originX + 7 : originX - 7}%`,
          top: '52%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #d1fae5dd 0%, #4ade8088 38%, transparent 75%)',
          filter: 'blur(5px)',
        }}
        animate={{ scale: [0, 2.8, 0.15], opacity: [0, 1, 0] }}
        transition={{ duration: 0.42, delay: 1.38 }}
      />

      {/* Ground cracks radiating from impact */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0 0 4px #22c55e)' }}
      >
        {cracks.map((d, i) => (
          <motion.path
            key={`crack-${i}`} d={d}
            stroke={i === 0 ? '#4ade80' : '#16a34a'}
            strokeWidth={1.9 - i * 0.14}
            strokeLinecap="square" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 1, 0.7, 0] }}
            transition={{ duration: 0.26, delay: 1.54 + i * 0.033 }}
          />
        ))}
      </svg>

      {/* Shockwave rings — the detonation on contact */}
      {[60, 118, 180].map((size, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute rounded-full border-2"
          style={{
            left: `${impactX}%`, top: '66%',
            transform: 'translate(-50%, -50%)',
            borderColor: '#4ade8077',
          }}
          initial={{ width: 0, height: 0, opacity: 0.9 }}
          animate={{ width: size, height: size * 0.4, opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.56 + i * 0.12 }}
        />
      ))}

      {/* White flash — compression detonates on contact */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${impactX}% 64%, #ffffff 0%, #d1fae5 20%, transparent 52%)` }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ duration: 0.25, delay: 1.54 }}
      />

      {/* Energy disperses upward — all potential burned in one moment */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <motion.div
          key={`drift-${i}`}
          className="absolute rounded-full"
          style={{
            width: 3 + (i % 3), height: 3 + (i % 3),
            left: `${originX + (-13 + i * 3.6)}%`,
            top: '46%',
            background: '#4ade80bb',
            filter: 'blur(1.2px)',
          }}
          animate={{ y: -(88 + i * 13), opacity: [0, 0.72, 0], scale: [0, 1.3, 0] }}
          transition={{ duration: 1.1 + i * 0.09, delay: 2.15 + i * 0.07 }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  KILLUA — GODSPEED: NARUKAMI (THUNDERBOLT)
// ─────────────────────────────────────────────────────────────────────────────

const KIL_GHOSTS_L = [
  { x: 56, y: 27 }, { x: 73, y: 56 }, { x: 47, y: 69 },
  { x: 66, y: 17 }, { x: 83, y: 39 }, { x: 38, y: 43 },
]
const KIL_GHOSTS_R = KIL_GHOSTS_L.map(p => ({ x: 100 - p.x, y: p.y }))

const KIL_WEB_L = [
  'M22,50 L56,27', 'M56,27 L73,56', 'M73,56 L83,39',
  'M22,50 L47,69', 'M47,69 L66,17', 'M66,17 L56,27',
  'M56,27 L38,43', 'M38,43 L47,69',
]
const KIL_WEB_R = KIL_WEB_L.map(p =>
  p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_: string, x: string, y: string) =>
    `${(100 - parseFloat(x)).toFixed(1)},${y}`))

const NARUKAMI_BOLT_L     = 'M22,0 L20,15 L24,22 L21,32 L23,42 L22,50'
const NARUKAMI_BOLT_R     = 'M78,0 L80,15 L76,22 L79,32 L77,42 L78,50'
const NARUKAMI_BRANCHES_L = ['M20,15 L11,24', 'M24,22 L33,28', 'M21,32 L13,38', 'M23,42 L32,46']
const NARUKAMI_BRANCHES_R = ['M80,15 L89,24', 'M76,22 L67,28', 'M79,32 L87,38', 'M77,42 L68,46']
const KIL_DISCHARGE_L    = 'M22,50 L50,45 L80,49'
const KIL_DISCHARGE_R    = 'M78,50 L50,45 L20,49'

export function GodspeedEffect({ side }: EffectProps) {
  const originX   = side === 'left' ? 22 : 78
  const ghosts    = side === 'left' ? KIL_GHOSTS_L        : KIL_GHOSTS_R
  const web       = side === 'left' ? KIL_WEB_L           : KIL_WEB_R
  const bolt      = side === 'left' ? NARUKAMI_BOLT_L      : NARUKAMI_BOLT_R
  const branches  = side === 'left' ? NARUKAMI_BRANCHES_L  : NARUKAMI_BRANCHES_R
  const discharge = side === 'left' ? KIL_DISCHARGE_L      : KIL_DISCHARGE_R

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Electrified aura around the body */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 72, height: 108,
          left: `${originX}%`, top: '48%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, #ffffff22 0%, #38bdf433 22%, #7dd3fc18 55%, transparent 80%)',
          filter: 'blur(7px)',
          border: '1px solid #38bdf866',
        }}
        animate={{ scale: [0, 1.5, 1.15, 1.6, 1.2], opacity: [0, 0.9, 0.7, 0.9, 0] }}
        transition={{ duration: 2.0, times: [0, 0.18, 0.38, 0.62, 1] }}
      />

      {/* Six ghost afterimages — the positions Killua just occupied */}
      {ghosts.map((g, i) => (
        <motion.div
          key={`ghost-${i}`}
          className="absolute"
          style={{
            width: 16, height: 28,
            left: `${g.x}%`, top: `${g.y}%`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(ellipse, #bfdbfe44 0%, #38bdf422 45%, transparent 78%)',
            filter: 'blur(4px)',
            borderRadius: '40%',
            border: '1px solid #38bdf455',
          }}
          animate={{ opacity: [0, 0.72, 0.45, 0] }}
          transition={{ duration: 0.52, delay: 0.38 + i * 0.07 }}
        />
      ))}

      {/* Electric web — lightning connecting all afterimage positions */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0 0 3px #38bdf8)' }}
      >
        {web.map((d, i) => (
          <motion.path
            key={`web-${i}`} d={d}
            stroke="#7dd3fc" strokeWidth="0.65" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 0], opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.28, delay: 0.42 + i * 0.055 }}
          />
        ))}
      </svg>

      {/* Narukami bolt — thick white-hot channel + halo + branches */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Halo blur */}
        <motion.path
          d={bolt} stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" fill="none"
          style={{ filter: 'blur(4px)' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1], opacity: [0, 0.65, 0] }}
          transition={{ duration: 0.22, delay: 1.42 }}
        />
        {/* White-hot core */}
        <motion.path
          d={bolt} stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" fill="none"
          style={{ filter: 'drop-shadow(0 0 6px #ffffff)' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1], opacity: [0, 1, 0.9, 0] }}
          transition={{ duration: 0.16, delay: 1.44, ease: 'linear' }}
        />
        {/* Branching filaments */}
        {branches.map((d, i) => (
          <motion.path
            key={`branch-${i}`} d={d}
            stroke="#7dd3fc" strokeWidth="1.1" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.12, delay: 1.46 + i * 0.02 }}
          />
        ))}
      </svg>

      {/* Sky flash — bolt connecting at attacker position */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at ${originX}% 5%, #ffffff44 0%, #38bdf822 28%, transparent 60%)` }}
        animate={{ opacity: [0, 0.92, 0] }}
        transition={{ duration: 0.18, delay: 1.44 }}
      />

      {/* Ground electrification at impact point */}
      <motion.div
        className="absolute"
        style={{
          left: `${originX}%`, bottom: '4%',
          transform: 'translateX(-50%)',
          width: 130, height: 16,
          background: 'radial-gradient(ellipse, #38bdf8aa 0%, transparent 72%)',
          filter: 'blur(3px)',
        }}
        animate={{ opacity: [0, 0.95, 0], scaleX: [0, 1.5, 0] }}
        transition={{ duration: 0.28, delay: 1.46 }}
      />

      {/* Discharge arc — electricity leaps to target */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0 0 4px #38bdf8)' }}
      >
        <motion.path
          d={discharge} stroke="#bfdbfe" strokeWidth="1.6"
          strokeLinecap="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.88, 0] }}
          transition={{ duration: 0.2, delay: 1.63 }}
        />
      </svg>

      {/* Continuous body sparks throughout */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <motion.div
          key={`spark-${i}`}
          className="absolute rounded-full"
          style={{
            width: 3, height: 3,
            left: `${originX + (-9 + i * 3.6)}%`,
            top: `${28 + (i % 4) * 13}%`,
            background: '#ffffff',
            boxShadow: '0 0 5px 2px #38bdf8',
          }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.6, 0] }}
          transition={{ duration: 0.18, delay: 0.28 + i * 0.2, repeat: 6, repeatDelay: 0.14 }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  NETERO — ZERO HAND: ALL REMAINING NEN IN ONE PRAYER
// ─────────────────────────────────────────────────────────────────────────────

// Kannon mandala spokes — 12 golden radial lines from Netero's position
const KANNON_SPOKES_L = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 30) * Math.PI / 180
  const ex = (22 + Math.cos(a) * 32).toFixed(1)
  const ey = (50 + Math.sin(a) * 26).toFixed(1)
  return `M22,50 L${ex},${ey}`
})
const KANNON_SPOKES_R = KANNON_SPOKES_L.map(p =>
  p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_: string, x: string, y: string) =>
    `${(100 - parseFloat(x)).toFixed(1)},${y}`))

const SPECTRUM_COLORS = ['#ef4444', '#f97316', '#fbbf24', '#4ade80', '#38bdf8', '#a855f7', '#ffffff']
const NOVA_PARTICLES = [
  { dx: 45, dy: -30, size: 5 }, { dx: -20, dy: -44, size: 4 }, { dx: 60, dy: 8, size: 5 },
  { dx: 25, dy: -55, size: 6 }, { dx: -38, dy: -22, size: 4 }, { dx: 72, dy: -15, size: 3 },
  { dx: 8, dy: -62, size: 5 },  { dx: 48, dy: 28, size: 4 },   { dx: -55, dy: 10, size: 3 },
  { dx: 80, dy: -35, size: 5 },
]

export function ZeroHandEffect({ side }: EffectProps) {
  const originX = side === 'left' ? 22 : 78
  const spokes  = side === 'left' ? KANNON_SPOKES_L : KANNON_SPOKES_R

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Prayer orbs — two sources of energy converging */}
      {([-32, 32] as const).map((offset, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            width: 22, height: 22,
            left: `${originX}%`, top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, #fffbdd 0%, #fbbf24 55%, transparent 85%)',
            filter: 'blur(3px)',
            boxShadow: '0 0 14px 5px #fbbf2488',
          }}
          initial={{ x: offset * 2.8, opacity: 0 }}
          animate={{ x: 0, opacity: [0, 0.9, 1, 0] }}
          transition={{ duration: 0.75, delay: i * 0.05, ease: 'easeIn' }}
        />
      ))}

      {/* Golden Kannon mandala — divine presence manifests */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0 0 5px #fbbf24)' }}
      >
        {spokes.map((d, i) => (
          <motion.path
            key={`spoke-${i}`} d={d}
            stroke="#fbbf24" strokeWidth="0.75" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 0], opacity: [0, 0.72, 0] }}
            transition={{ duration: 0.55, delay: 0.62 + i * 0.022 }}
          />
        ))}
        {/* Concentric prayer circles */}
        {[11, 21, 31].map((r, i) => (
          <motion.circle
            key={`ring-${i}`}
            cx={originX} cy={50} r={r}
            stroke="#fbbf2477" strokeWidth="0.55" fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.65, 0] }}
            transition={{ duration: 0.5, delay: 0.66 + i * 0.08 }}
          />
        ))}
      </svg>

      {/* Kannon glow aura */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 80, height: 65,
          left: `${originX}%`, top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #fbbf2444 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
        animate={{ scale: [0, 1.5, 0], opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.0, delay: 0.6 }}
      />

      {/* Spectrum beam — cycling through all colours toward opponent */}
      {SPECTRUM_COLORS.map((c, i) => (
        <motion.div
          key={`spectrum-${i}`}
          className="absolute top-1/2"
          style={{
            left: side === 'left' ? `${originX}%` : 0,
            right: side === 'right' ? `${100 - originX}%` : 'auto',
            height: i === SPECTRUM_COLORS.length - 1 ? 30 : 18,
            marginTop: -(i === SPECTRUM_COLORS.length - 1 ? 15 : 9),
            transformOrigin: side === 'left' ? 'left center' : 'right center',
            background: `linear-gradient(${side === 'left' ? 'to right' : 'to left'}, ${c}cc, ${c}55, transparent)`,
            filter: 'blur(2.5px)',
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 1, 0], opacity: [0, 0.85, 0] }}
          transition={{ duration: 0.18, delay: 1.22 + i * 0.1, ease: 'easeInOut' }}
        />
      ))}

      {/* Final white beam — pure release */}
      <motion.div
        className="absolute top-1/2"
        style={{
          left: side === 'left' ? `${originX}%` : 0,
          right: side === 'right' ? `${100 - originX}%` : 'auto',
          height: 34, marginTop: -17,
          transformOrigin: side === 'left' ? 'left center' : 'right center',
          background: `linear-gradient(${side === 'left' ? 'to right' : 'to left'}, #ffffff, #fffbdd88, transparent)`,
          filter: 'blur(1px)',
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 0.9, 0] }}
        transition={{ duration: 0.52, delay: 1.94 }}
      />

      {/* White nova */}
      <motion.div
        className="absolute inset-0 bg-white"
        animate={{ opacity: [0, 0.88, 0] }}
        transition={{ duration: 0.3, delay: 1.96 }}
      />

      {/* Emptiness — Netero completely drained */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${originX}% 50%, #00000055 0%, transparent 52%)` }}
        animate={{ opacity: [0, 0, 0.72, 0.38, 0] }}
        transition={{ duration: 1.6, times: [0, 0.38, 0.54, 0.8, 1] }}
      />

      {/* Golden residue particles settling after the nova */}
      {NOVA_PARTICLES.map((p, i) => {
        const rx = side === 'left' ? p.dx : -p.dx
        return (
          <motion.div
            key={`residue-${i}`}
            className="absolute rounded-full"
            style={{
              width: p.size, height: p.size,
              left: `${originX}%`, top: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#fbbf2499',
            }}
            animate={{ x: rx, y: p.dy, opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.75, delay: 2.3 + i * 0.06 }}
          />
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  HISOKA — BUNGEE GUM (PROPERTIES OF BOTH RUBBER AND GUM)
// ─────────────────────────────────────────────────────────────────────────────

const CARD_CONFIGS = [
  { x: 55, y: 20, angle: 32,  delay: 0.08, speed: 0.55 },
  { x: 70, y: 45, angle: -18, delay: 0.14, speed: 0.48 },
  { x: 80, y: 65, angle: 25,  delay: 0.05, speed: 0.52 },
  { x: 60, y: 80, angle: -40, delay: 0.20, speed: 0.60 },
  { x: 45, y: 30, angle: 55,  delay: 0.11, speed: 0.44 },
  { x: 85, y: 30, angle: -12, delay: 0.17, speed: 0.50 },
  { x: 65, y: 60, angle: 38,  delay: 0.03, speed: 0.58 },
  { x: 75, y: 15, angle: -28, delay: 0.22, speed: 0.46 },
]
const CARD_CONFIGS_R = CARD_CONFIGS.map(c => ({ ...c, x: 100 - c.x, angle: -c.angle }))

// Pink Bungee Gum strand paths — stretching from attacker to various attach points
const GUM_STRANDS_L = [
  'M22,50 C40,30 60,28 75,42',
  'M22,50 C35,60 55,65 78,58',
  'M22,50 C42,22 62,18 80,30',
  'M22,50 C38,72 58,76 76,68',
]
const GUM_STRANDS_R = GUM_STRANDS_L.map(p =>
  p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_: string, x: string, y: string) =>
    `${(100 - parseFloat(x)).toFixed(1)},${y}`))

export function BungeeGumEffect({ side }: EffectProps) {
  const originX = side === 'left' ? 22 : 78
  const cards   = side === 'left' ? CARD_CONFIGS   : CARD_CONFIGS_R
  const strands = side === 'left' ? GUM_STRANDS_L  : GUM_STRANDS_R

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Theatrical performer aura — Hisoka's showmanship */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${originX}% 50%, #f9a8d422 0%, transparent 60%)` }}
        animate={{ opacity: [0, 0.8, 0.5, 0.8, 0] }}
        transition={{ duration: 2.8, times: [0, 0.2, 0.5, 0.7, 1] }}
      />

      {/* Flying playing cards */}
      {cards.map((c, i) => (
        <motion.div
          key={`card-${i}`}
          className="absolute"
          style={{
            width: 10, height: 14,
            left: `${originX}%`, top: '50%',
            transform: `translate(-50%, -50%) rotate(${c.angle}deg)`,
            background: 'linear-gradient(135deg, #fff 60%, #f9a8d4 100%)',
            border: '0.5px solid #f472b6',
            borderRadius: '1px',
            boxShadow: '0 0 4px #f9a8d488',
          }}
          animate={{
            x:       side === 'left' ? (c.x - originX) * 5 : (c.x - originX) * 5,
            y:       (c.y - 50) * 3.5,
            opacity: [0, 1, 0.9, 0],
            rotate:  [c.angle, c.angle + 180],
          }}
          transition={{ duration: c.speed, delay: c.delay }}
        />
      ))}

      {/* Pink Bungee Gum strands — the elastic trap */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0 0 3px #f472b6)' }}
      >
        {strands.map((d, i) => (
          <motion.path
            key={`strand-${i}`} d={d}
            stroke="#f9a8d4" strokeWidth="1.0" strokeLinecap="round" fill="none"
            style={{ filter: 'blur(0.5px)' }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 0.8, 0], opacity: [0, 0.75, 0.9, 0] }}
            transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
          />
        ))}
      </svg>

      {/* Bungee Gum snap — elastic release flash */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 55, height: 55,
          left: side === 'left' ? '75%' : '25%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #f9a8d4aa 0%, #f472b655 40%, transparent 72%)',
          filter: 'blur(6px)',
        }}
        animate={{ scale: [0, 2.2, 0.4, 0], opacity: [0, 0.9, 0.6, 0] }}
        transition={{ duration: 0.35, delay: 1.28 }}
      />

      {/* Confetti sparkle — the theatrical showman finish */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
        <motion.div
          key={`confetti-${i}`}
          className="absolute"
          style={{
            width: 4, height: 4,
            left: `${(side === 'left' ? 70 : 30) + (-12 + i * 2.2)}%`,
            top: '48%',
            background: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#f9a8d4' : '#ffffff',
            borderRadius: i % 2 === 0 ? '50%' : '0',
          }}
          animate={{
            x:       (-15 + i * 2.5) * 3,
            y:       [0, -25 - (i % 4) * 12, 40 + (i % 3) * 10],
            opacity: [0, 1, 0.8, 0],
            rotate:  [0, 180 + i * 30],
          }}
          transition={{ duration: 0.9, delay: 1.32 + i * 0.04 }}
        />
      ))}

      {/* Lingering pink aura — Hisoka's always watching */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${originX}% 50%, #f9a8d415 0%, transparent 45%)` }}
        animate={{ opacity: [0, 0, 0.7, 0.3, 0] }}
        transition={{ duration: 1.8, times: [0, 0.45, 0.58, 0.8, 1] }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  CHROLLO — SKILL HUNTER: THE GRIMOIRE OPENS
// ─────────────────────────────────────────────────────────────────────────────

// Six stolen ability aura colours (different characters' Nen)
const STOLEN_COLORS = ['#ef4444', '#fbbf24', '#4ade80', '#38bdf8', '#a855f7', '#f472b6']
const PAGE_CONFIGS  = [
  { angle: 28,  tx: 1.8, ty: -1.4, delay: 0.38 },
  { angle: -35, tx: -2.2, ty: -1.2, delay: 0.44 },
  { angle: 55,  tx: 1.4, ty: 0.8,  delay: 0.40 },
  { angle: -18, tx: 2.5, ty: 0.5,  delay: 0.46 },
  { angle: 72,  tx: 0.8, ty: -2.0, delay: 0.42 },
  { angle: -60, tx: -1.8, ty: 0.9, delay: 0.48 },
  { angle: 40,  tx: -1.2, ty: -1.8, delay: 0.36 },
  { angle: -25, tx: 1.6, ty: 1.5, delay: 0.50 },
]

export function SkillHunterEffect({ side }: EffectProps) {
  const originX = side === 'left' ? 22 : 78

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Dark tint — Chrollo's calm menace */}
      <motion.div
        className="absolute inset-0 bg-black"
        animate={{ opacity: [0, 0.35, 0.28, 0.15, 0] }}
        transition={{ duration: 3.2, times: [0, 0.15, 0.4, 0.75, 1] }}
      />

      {/* The grimoire — dark hardcover book opening */}
      <motion.div
        className="absolute"
        style={{
          width: 30, height: 38,
          left: `${originX}%`, top: '42%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(160deg, #1e293b 0%, #0f172a 60%, #1e293b 100%)',
          border: '1px solid #475569',
          borderRadius: '2px',
          boxShadow: '0 0 12px #33415566',
        }}
        initial={{ scale: 0, opacity: 0, rotateY: 90 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1, 0], rotateY: [90, 0, 0, -90] }}
        transition={{ duration: 1.2, times: [0, 0.2, 0.72, 1] }}
      />

      {/* Grimoire glow — a page is being activated */}
      <motion.div
        className="absolute rounded-sm"
        style={{
          width: 26, height: 34,
          left: `${originX}%`, top: '42%',
          transform: 'translate(-50%, -50%)',
          background: '#fbbf2411',
          filter: 'blur(4px)',
          boxShadow: '0 0 8px #fbbf2444',
        }}
        animate={{ opacity: [0, 0, 0.8, 0] }}
        transition={{ duration: 0.8, delay: 0.28 }}
      />

      {/* Pages flying out — the Bandit's Secret unleashing */}
      {PAGE_CONFIGS.map((p, i) => (
        <motion.div
          key={`page-${i}`}
          className="absolute"
          style={{
            width: 14, height: 18,
            left: `${originX}%`, top: '42%',
            transform: `translate(-50%, -50%) rotate(${p.angle}deg)`,
            background: 'linear-gradient(135deg, #e2e8f0 60%, #cbd5e1 100%)',
            border: '0.5px solid #94a3b8',
            borderRadius: '1px',
          }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x:       p.tx * 55,
            y:       p.ty * 45,
            opacity: [0, 0.9, 0.7, 0],
            rotate:  [p.angle, p.angle + 120],
          }}
          transition={{ duration: 0.65, delay: p.delay }}
        />
      ))}

      {/* Six stolen ability aura rings — all active simultaneously */}
      {STOLEN_COLORS.map((c, i) => (
        <motion.div
          key={`stolen-${i}`}
          className="absolute rounded-full border-2"
          style={{
            width:  50 + i * 18,
            height: 50 + i * 18,
            left: `${originX}%`, top: '50%',
            transform: 'translate(-50%, -50%)',
            borderColor: `${c}88`,
            filter: 'blur(1.5px)',
            boxShadow: `0 0 8px ${c}44`,
          }}
          animate={{
            scale:   [0, 1.12, 0.96, 1.08, 0],
            opacity: [0, 0.75, 0.55, 0.7, 0],
          }}
          transition={{ duration: 1.8, delay: 0.8 + i * 0.1, times: [0, 0.2, 0.5, 0.75, 1] }}
        />
      ))}

      {/* Forehead cross glow — Chrollo's signature mark */}
      <motion.div
        className="absolute"
        style={{
          left: `${originX}%`, top: '30%',
          transform: 'translate(-50%, -50%)',
          width: 12, height: 12,
          background: 'radial-gradient(circle, #f8fafc88 0%, transparent 70%)',
          filter: 'blur(2px)',
        }}
        animate={{ opacity: [0, 0.9, 0.6, 0] }}
        transition={{ duration: 1.5, delay: 0.22 }}
      />

      {/* Multi-colour strike — all stolen abilities firing */}
      {STOLEN_COLORS.map((c, i) => (
        <motion.div
          key={`strike-${i}`}
          className="absolute top-1/2"
          style={{
            left:   side === 'left' ? `${originX}%` : 0,
            right:  side === 'right' ? `${100 - originX}%` : 'auto',
            height: 6, marginTop: -3 + (i - 3) * 2.5,
            transformOrigin: side === 'left' ? 'left center' : 'right center',
            background: `linear-gradient(${side === 'left' ? 'to right' : 'to left'}, ${c}99, transparent)`,
            filter: 'blur(1px)',
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 1, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.25, delay: 1.9 + i * 0.06 }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  KURAPIKA — EMPEROR TIME + CHAIN JAIL
// ─────────────────────────────────────────────────────────────────────────────

// Eight chain paths erupting from attacker in all directions
const CHAINS_L = [
  'M22,50 L55,22', 'M22,50 L65,40', 'M22,50 L70,58',
  'M22,50 L58,72', 'M22,50 L38,78', 'M22,50 L16,68',
  'M22,50 L10,38', 'M22,50 L18,25',
]
const CHAINS_R = CHAINS_L.map(p =>
  p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_: string, x: string, y: string) =>
    `${(100 - parseFloat(x)).toFixed(1)},${y}`))

// Prison bars on opponent's side
const PRISON_BARS_L = [
  'M72,15 L72,85', 'M78,15 L78,85', 'M84,15 L84,85', 'M90,15 L90,85',
  'M68,35 L95,35', 'M68,55 L95,55', 'M68,70 L95,70',
]
const PRISON_BARS_R = [
  'M28,15 L28,85', 'M22,15 L22,85', 'M16,15 L16,85', 'M10,15 L10,85',
  'M5,35 L32,35', 'M5,55 L32,55', 'M5,70 L32,70',
]

// Chain link node positions along the paths
const CHAIN_NODES_L = [
  { x: 38, y: 36 }, { x: 55, y: 22 }, { x: 44, y: 45 },
  { x: 65, y: 40 }, { x: 50, y: 63 }, { x: 58, y: 72 },
]
const CHAIN_NODES_R = CHAIN_NODES_L.map(p => ({ x: 100 - p.x, y: p.y }))

export function EmperorTimeEffect({ side }: EffectProps) {
  const originX = side === 'left' ? 22 : 78
  const chains  = side === 'left' ? CHAINS_L      : CHAINS_R
  const bars    = side === 'left' ? PRISON_BARS_L : PRISON_BARS_R
  const nodes   = side === 'left' ? CHAIN_NODES_L : CHAIN_NODES_R

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Screen washes crimson — Emperor Time activated */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, #7f1d1d44 0%, #450a0a33 50%, transparent 80%)' }}
        animate={{ opacity: [0, 0.85, 0.7, 0.4, 0] }}
        transition={{ duration: 3.2, times: [0, 0.18, 0.42, 0.75, 1] }}
      />

      {/* Crimson eye glow — the scarlet eyes activate */}
      {([-10, 10] as const).map((offset, i) => (
        <motion.div
          key={`eye-${i}`}
          className="absolute rounded-full"
          style={{
            width: 10, height: 7,
            left: `calc(${originX}% + ${offset}px)`,
            top: '34%',
            background: 'radial-gradient(circle, #dc2626 0%, #991b1b 55%, transparent 85%)',
            filter: 'blur(0.5px)',
            boxShadow: '0 0 16px 6px rgba(220,38,38,0.85)',
          }}
          animate={{ opacity: [0, 0, 1, 0.85, 1, 0] }}
          transition={{ duration: 3.0, times: [0, 0.1, 0.22, 0.5, 0.72, 1] }}
        />
      ))}

      {/* Chains erupting from attacker */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0 0 3px #dc2626)' }}
      >
        {chains.map((d, i) => (
          <motion.path
            key={`chain-${i}`} d={d}
            stroke="#dc2626" strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="3 2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 0.85, 0.65] }}
            transition={{ duration: 0.38, delay: 0.55 + i * 0.07 }}
          />
        ))}

        {/* Chain link nodes */}
        {nodes.map((n, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={n.x} cy={n.y} r={1.8}
            fill="#dc2626" stroke="#7f1d1d" strokeWidth="0.5"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0.8] }}
            transition={{ duration: 0.2, delay: 0.6 + i * 0.09 }}
          />
        ))}

        {/* Chain Jail prison bars — caging the opponent */}
        {bars.map((d, i) => (
          <motion.path
            key={`bar-${i}`} d={d}
            stroke="#dc262666" strokeWidth="0.9"
            strokeLinecap="round" fill="none"
            style={{ filter: 'blur(0.5px)' }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 0.6, 0.4] }}
            transition={{ duration: 0.3, delay: 1.2 + i * 0.06 }}
          />
        ))}
      </svg>

      {/* Crimson shockwave from activation */}
      {[0, 1].map(i => (
        <motion.div
          key={`shockwave-${i}`}
          className="absolute rounded-full border-2"
          style={{
            left: `${originX}%`, top: '50%',
            transform: 'translate(-50%, -50%)',
            borderColor: '#dc262677',
          }}
          initial={{ width: 0, height: 0, opacity: 0.9 }}
          animate={{ width: 120 + i * 80, height: 90 + i * 60, opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.48 + i * 0.15 }}
        />
      ))}

      {/* Judgment chain tip — the blade at the heart */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 6, height: 6,
          left: side === 'left' ? '76%' : '24%',
          top: '48%',
          transform: 'translate(-50%, -50%)',
          background: '#fbbf24',
          boxShadow: '0 0 8px 3px #fbbf24aa',
        }}
        animate={{ opacity: [0, 0, 0.9, 0] }}
        transition={{ duration: 0.6, delay: 1.55, times: [0, 0.3, 0.6, 1] }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  FEITAN — PAIN PACKER: RISING SUN
// ─────────────────────────────────────────────────────────────────────────────

// 16 solar corona rays radiating from the sun position
const CORONA_RAYS = Array.from({ length: 16 }, (_, i) => {
  const a = (i * 22.5) * Math.PI / 180
  const sx = (50 + Math.cos(a) * 8).toFixed(1)
  const sy = (28 + Math.sin(a) * 8).toFixed(1)
  const ex = (50 + Math.cos(a) * 38).toFixed(1)
  const ey = (28 + Math.sin(a) * 32).toFixed(1)
  return `M${sx},${sy} L${ex},${ey}`
})

const EMBER_CONFIGS = [
  { x: 38, y: 55, size: 3, delay: 1.8 }, { x: 55, y: 60, size: 4, delay: 1.95 },
  { x: 44, y: 65, size: 3, delay: 1.85 }, { x: 60, y: 52, size: 5, delay: 2.0 },
  { x: 35, y: 70, size: 3, delay: 1.9 }, { x: 62, y: 62, size: 4, delay: 2.1 },
  { x: 50, y: 72, size: 3, delay: 1.88 }, { x: 42, y: 58, size: 4, delay: 2.05 },
  { x: 58, y: 70, size: 3, delay: 1.92 }, { x: 48, y: 48, size: 5, delay: 1.82 },
]

export function RisingSunEffect({ side }: EffectProps) {
  const originX = side === 'left' ? 22 : 78

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Darkness first — pain accumulates in black silence */}
      <motion.div
        className="absolute inset-0 bg-black"
        animate={{ opacity: [0, 0.75, 0.55, 0, 0, 0] }}
        transition={{ duration: 3.4, times: [0, 0.18, 0.36, 0.55, 0.8, 1] }}
      />

      {/* Feitan's suffering aura — dark red glowing from body */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 50, height: 65,
          left: `${originX}%`, top: '52%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, #7f1d1d44 0%, transparent 72%)',
          filter: 'blur(8px)',
        }}
        animate={{ scale: [0, 1.4, 0.8], opacity: [0, 0.7, 0] }}
        transition={{ duration: 1.0, times: [0, 0.6, 1] }}
      />

      {/* Small aura ball ascending — Pain Packer charging */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 14, height: 14,
          left: `${originX}%`, top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #fef08a 0%, #f97316 55%, #dc2626 85%, transparent 100%)',
          filter: 'blur(2px)',
          boxShadow: '0 0 10px 4px #f9731699',
        }}
        animate={{ y: [0, -90], scale: [0, 0.8, 1.4, 2.0], opacity: [0, 1, 1, 0.9] }}
        transition={{ duration: 0.9, delay: 0.65, ease: 'easeOut' }}
      />

      {/* The sun forms — expanding solar body */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: '50%', top: '28%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #fffbdd 0%, #fef08a 20%, #f97316 45%, #dc2626 68%, transparent 85%)',
          filter: 'blur(3px)',
          boxShadow: '0 0 30px 12px #f9731688',
        }}
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{ width: [0, 20, 55, 70], height: [0, 20, 55, 70], opacity: [0, 1, 1, 0.95] }}
        transition={{ duration: 0.8, delay: 1.3, times: [0, 0.2, 0.65, 1] }}
      />

      {/* Solar corona — radial rays from the sun */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0 0 4px #f97316)' }}
      >
        {CORONA_RAYS.map((d, i) => (
          <motion.path
            key={`ray-${i}`} d={d}
            stroke={i % 3 === 0 ? '#fef08a' : '#f97316'}
            strokeWidth={i % 2 === 0 ? 1.2 : 0.7}
            strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 0.9, 0.7] }}
            transition={{ duration: 0.35, delay: 1.55 + i * 0.025 }}
          />
        ))}
      </svg>

      {/* Heat distortion — air shimmering around the sun */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={`heat-${i}`}
          className="absolute rounded-full border"
          style={{
            left: '50%', top: '28%',
            transform: 'translate(-50%, -50%)',
            borderColor: `#f9731644`,
            filter: 'blur(3px)',
          }}
          initial={{ width: 0, height: 0, opacity: 0.7 }}
          animate={{ width: 80 + i * 50, height: 65 + i * 40, opacity: 0 }}
          transition={{ duration: 0.65, delay: 1.62 + i * 0.14 }}
        />
      ))}

      {/* Everything burns — full field orange-white wash */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 28%, #f9731655 0%, #f9731522 38%, transparent 65%)' }}
        animate={{ opacity: [0, 0, 0.95, 0.7, 0] }}
        transition={{ duration: 2.0, times: [0, 0.42, 0.58, 0.78, 1] }}
      />

      {/* Blinding white-out at peak */}
      <motion.div
        className="absolute inset-0 bg-white"
        animate={{ opacity: [0, 0, 0.7, 0] }}
        transition={{ duration: 0.4, delay: 1.7, times: [0, 0.3, 0.6, 1] }}
      />

      {/* Embers drifting down — heat aftermath */}
      {EMBER_CONFIGS.map((e, i) => (
        <motion.div
          key={`ember-${i}`}
          className="absolute rounded-full"
          style={{
            width: e.size, height: e.size,
            left: `${e.x}%`, top: `${e.y}%`,
            background: i % 2 === 0 ? '#fbbf24' : '#f97316',
            filter: 'blur(0.8px)',
            boxShadow: `0 0 4px ${i % 2 === 0 ? '#fbbf24' : '#f97316'}`,
          }}
          animate={{ y: [0, 30, 55], opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.9, delay: e.delay }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  NEFERPITOU — TERPSICHORA: COMBAT PUPPET
// ─────────────────────────────────────────────────────────────────────────────

// Marionette strings descending from above to the attacker
const STRINGS_DOWN_L = [
  'M16,0 L16,48', 'M22,0 L22,48', 'M28,0 L28,52',
  'M14,0 L19,45', 'M30,0 L25,52',
]
const STRINGS_DOWN_R = [
  'M84,0 L84,48', 'M78,0 L78,48', 'M72,0 L72,52',
  'M86,0 L81,45', 'M70,0 L75,52',
]

// Strings extending toward opponent — the puppet reaches
const STRINGS_ACROSS_L = [
  'M22,48 C40,36 62,30 78,42',
  'M22,52 C38,60 60,64 76,56',
  'M22,48 C42,20 64,18 80,32',
]
const STRINGS_ACROSS_R = STRINGS_ACROSS_L.map(p =>
  p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_: string, x: string, y: string) =>
    `${(100 - parseFloat(x)).toFixed(1)},${y}`))

// Rapid mechanical strike positions — the corpse-puppet combat speed
const STRIKE_POS_L = [
  { x: 35, y: 45, delay: 1.6 }, { x: 62, y: 38, delay: 1.72 },
  { x: 75, y: 55, delay: 1.84 }, { x: 55, y: 30, delay: 1.68 },
]
const STRIKE_POS_R = STRIKE_POS_L.map(p => ({ x: 100 - p.x, y: p.y, delay: p.delay }))

export function TerpsichoraEffect({ side }: EffectProps) {
  const originX      = side === 'left' ? 22 : 78
  const stringsDown  = side === 'left' ? STRINGS_DOWN_L   : STRINGS_DOWN_R
  const stringsAcross= side === 'left' ? STRINGS_ACROSS_L : STRINGS_ACROSS_R
  const strikePos    = side === 'left' ? STRIKE_POS_L     : STRIKE_POS_R

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Pale atmospheric dread — Pitou's killing intent */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${originX}% 48%, #fce7f322 0%, transparent 60%)` }}
        animate={{ opacity: [0, 0.7, 0.5, 0.6, 0] }}
        transition={{ duration: 3.2, times: [0, 0.18, 0.45, 0.72, 1] }}
      />

      {/* Cat ear triangles — Neferpitou's silhouette materialises */}
      {([-8, 8] as const).map((offset, i) => (
        <motion.div
          key={`ear-${i}`}
          className="absolute"
          style={{
            left: `calc(${originX}% + ${offset}px)`,
            top: '20%',
            width: 0, height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderBottom: '14px solid #f9a8d488',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(0.5px)',
          }}
          animate={{ opacity: [0, 0.85, 0.7, 0] }}
          transition={{ duration: 2.4, times: [0, 0.18, 0.65, 1] }}
        />
      ))}

      {/* Ruby eyes */}
      {([-9, 9] as const).map((offset, i) => (
        <motion.div
          key={`peye-${i}`}
          className="absolute rounded-full"
          style={{
            width: 6, height: 4,
            left: `calc(${originX}% + ${offset}px)`,
            top: '32%',
            background: 'radial-gradient(circle, #dc2626 0%, #7f1d1d 65%, transparent 90%)',
            boxShadow: '0 0 8px 3px rgba(220,38,38,0.7)',
            filter: 'blur(0.3px)',
          }}
          animate={{ opacity: [0, 0, 0.9, 0.75, 0.95, 0] }}
          transition={{ duration: 2.8, times: [0, 0.14, 0.28, 0.5, 0.72, 1] }}
        />
      ))}

      {/* Marionette strings from above — the puppet attached */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {stringsDown.map((d, i) => (
          <motion.path
            key={`sdown-${i}`} d={d}
            stroke="#f9a8d466" strokeWidth="0.6" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 0.55, 0.4] }}
            transition={{ duration: 0.45, delay: 0.22 + i * 0.06 }}
          />
        ))}

        {/* Strings extending to target */}
        {stringsAcross.map((d, i) => (
          <motion.path
            key={`sacross-${i}`} d={d}
            stroke="#dc262655" strokeWidth="0.7" strokeLinecap="round" fill="none"
            strokeDasharray="2 2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 0.6, 0.4] }}
            transition={{ duration: 0.55, delay: 0.9 + i * 0.1 }}
          />
        ))}
      </svg>

      {/* Mechanical strike flashes — impossible precision */}
      {strikePos.map((p, i) => (
        <motion.div
          key={`strike-${i}`}
          className="absolute rounded-full"
          style={{
            width: 12, height: 12,
            left: `${p.x}%`, top: `${p.y}%`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, #f9a8d4cc 0%, transparent 70%)',
            filter: 'blur(2px)',
          }}
          animate={{ scale: [0, 2.5, 0], opacity: [0, 0.85, 0] }}
          transition={{ duration: 0.15, delay: p.delay }}
        />
      ))}

      {/* Blood-red ground glow — combat aftermath */}
      <motion.div
        className="absolute"
        style={{
          left: 0, right: 0, bottom: '5%',
          height: 12,
          background: `linear-gradient(to ${side === 'left' ? 'right' : 'left'}, transparent, #dc262633, transparent)`,
          filter: 'blur(4px)',
        }}
        animate={{ opacity: [0, 0, 0.8, 0.5, 0] }}
        transition={{ duration: 2.0, times: [0, 0.38, 0.55, 0.78, 1] }}
      />

      {/* Killer intent aura — sub-0.1s activation to first strike */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 60, height: 80,
          left: `${originX}%`, top: '48%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(ellipse, #f9a8d41a 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
        animate={{ scale: [0.9, 1.15, 0.95, 1.18, 0], opacity: [0, 0.6, 0.42, 0.62, 0] }}
        transition={{ duration: 3.0, times: [0, 0.22, 0.45, 0.68, 1] }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  MERUEM — ROYAL PHOTON: ABSORBED NEN + DIRECTIONAL BLAST
// ─────────────────────────────────────────────────────────────────────────────

// Gold photon motes scattered across the field (Pouf's Scales ability)
const PHOTON_MOTES = [
  { x: 40, y: 25, size: 4, delay: 1.0 }, { x: 65, y: 18, size: 3, delay: 1.15 },
  { x: 55, y: 40, size: 5, delay: 0.95 }, { x: 72, y: 55, size: 3, delay: 1.2 },
  { x: 48, y: 62, size: 4, delay: 1.05 }, { x: 80, y: 38, size: 5, delay: 0.9 },
  { x: 36, y: 48, size: 3, delay: 1.1 }, { x: 60, y: 68, size: 4, delay: 1.25 },
  { x: 88, y: 25, size: 3, delay: 1.0 }, { x: 45, y: 78, size: 5, delay: 1.18 },
  { x: 75, y: 72, size: 3, delay: 0.98 }, { x: 68, y: 32, size: 4, delay: 1.12 },
]
const PHOTON_MOTES_R = PHOTON_MOTES.map(m => ({ ...m, x: 100 - m.x }))

// Rage Blast — Youpi's directional aura wave path
const RAGE_BLAST_L = 'M22,50 C35,40 55,38 100,46'
const RAGE_BLAST_R = 'M78,50 C65,40 45,38 0,46'

export function RoyalPhotonEffect({ side }: EffectProps) {
  const originX = side === 'left' ? 22 : 78
  const motes   = side === 'left' ? PHOTON_MOTES   : PHOTON_MOTES_R
  const blast   = side === 'left' ? RAGE_BLAST_L   : RAGE_BLAST_R

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Absolute crushing aura — Meruem's density distorts the field */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${originX}% 50%, #0a0614 0%, #110a1f 35%, #080510 65%, transparent 88%)` }}
        animate={{ opacity: [0, 0.88, 0.82, 0.55, 0] }}
        transition={{ duration: 3.4, times: [0, 0.16, 0.38, 0.72, 1] }}
      />

      {/* Aura pressure rings — the King's presence alone knocks back air */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={`pressure-${i}`}
          className="absolute rounded-full border"
          style={{
            left: `${originX}%`, top: '50%',
            transform: 'translate(-50%, -50%)',
            borderColor: '#fbbf2433',
            filter: 'blur(2px)',
          }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 60 + i * 55, height: 48 + i * 42, opacity: 0 }}
          transition={{ duration: 0.9, delay: 0.12 + i * 0.22 }}
        />
      ))}

      {/* Youpi's Rage Blast — concentrated directional burst */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Blast glow */}
        <motion.path
          d={blast} stroke="#6d28d9" strokeWidth="8"
          strokeLinecap="round" fill="none"
          style={{ filter: 'blur(6px)' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.55, 0] }}
          transition={{ duration: 0.6, delay: 0.65 }}
        />
        {/* Blast core */}
        <motion.path
          d={blast} stroke="#a855f7" strokeWidth="2.5"
          strokeLinecap="round" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.45, delay: 0.68 }}
        />
      </svg>

      {/* Gold photon motes — Pouf's scales carry intelligence */}
      {motes.map((m, i) => (
        <motion.div
          key={`mote-${i}`}
          className="absolute rounded-full"
          style={{
            width: m.size, height: m.size,
            left: `${m.x}%`, top: `${m.y}%`,
            background: 'radial-gradient(circle, #fef08a 0%, #fbbf24 55%, transparent 85%)',
            filter: 'blur(0.8px)',
            boxShadow: '0 0 5px 2px #fbbf2488',
          }}
          animate={{ opacity: [0, 0.85, 0.65, 0], scale: [0, 1.4, 0.8, 0] }}
          transition={{ duration: 0.8, delay: m.delay }}
        />
      ))}

      {/* Absolute golden nova — all absorbed power converges */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: `${originX}%`, top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #fbbf24cc 0%, #92400e88 30%, transparent 65%)',
          filter: 'blur(12px)',
        }}
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{ width: [0, 180, 80], height: [0, 140, 60], opacity: [0, 0.95, 0] }}
        transition={{ duration: 0.55, delay: 1.65 }}
      />

      {/* Dark aftermath — the King absorbs all light */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${originX}% 50%, #000000 0%, transparent 45%)` }}
        animate={{ opacity: [0, 0, 0.6, 0.25, 0] }}
        transition={{ duration: 1.6, times: [0, 0.42, 0.55, 0.8, 1] }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  ILLUMI ZOLDYCK — NEEDLE CONTROL: COLD MANIPULATION
// ─────────────────────────────────────────────────────────────────────────────
// Illumi's Nen: implant a needle to destroy free will permanently.
// Silver needles descend from above in staggered sequence — actual rainfall.
// Cold white-silver atmosphere. Thin threads extend from each needle to the
// puppet target. Four mechanical jerk flashes show the marionette combat.
// Alien circular eyes. No emotion, no warmth. Clinical, wrong, final.

// Twelve needle x-positions and stagger delays
const ILL_NEEDLES_L = [
  { x: 14, delay: 0.05 }, { x: 18, delay: 0.12 }, { x: 22, delay: 0.08 },
  { x: 26, delay: 0.18 }, { x: 30, delay: 0.14 }, { x: 16, delay: 0.22 },
  { x: 20, delay: 0.02 }, { x: 24, delay: 0.26 }, { x: 12, delay: 0.16 },
  { x: 28, delay: 0.10 }, { x: 10, delay: 0.30 }, { x: 32, delay: 0.20 },
]
const ILL_NEEDLES_R = ILL_NEEDLES_L.map(n => ({ x: 100 - n.x, delay: n.delay }))

// Silver threads from needle tips to puppet target area
const ILL_THREADS_L = [
  'M14,48 C18,54 28,60 38,65', 'M18,48 C22,52 32,58 42,62',
  'M22,48 C26,52 36,56 46,60', 'M26,48 C30,52 40,58 52,62',
  'M30,48 C34,54 46,60 58,64', 'M20,48 C26,58 38,62 50,66',
  'M24,48 C28,56 42,64 54,68', 'M16,48 C20,56 32,62 44,66',
]
const ILL_THREADS_R = ILL_THREADS_L.map(p =>
  p.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_: string, x: string, y: string) =>
    `${(100 - parseFloat(x)).toFixed(1)},${y}`))

// Mechanical jerk positions — the controlled body twitches with impossible precision
const ILL_JERKS_L = [
  { x: 58, y: 42, delay: 1.55 }, { x: 64, y: 55, delay: 1.70 },
  { x: 72, y: 38, delay: 1.85 }, { x: 68, y: 62, delay: 2.00 },
]
const ILL_JERKS_R = ILL_JERKS_L.map(j => ({ x: 100 - j.x, y: j.y, delay: j.delay }))

export function NeedleControlEffect({ side }: EffectProps) {
  const originX = side === 'left' ? 22 : 78
  const needles = side === 'left' ? ILL_NEEDLES_L : ILL_NEEDLES_R
  const threads = side === 'left' ? ILL_THREADS_L : ILL_THREADS_R
  const jerks   = side === 'left' ? ILL_JERKS_L   : ILL_JERKS_R

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Cold silver-white atmosphere — Illumi's presence is ice-cold dread */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${originX}% 48%, #f8fafc22 0%, transparent 58%)` }}
        animate={{ opacity: [0, 0.7, 0.5, 0.6, 0] }}
        transition={{ duration: 2.8, times: [0, 0.18, 0.45, 0.72, 1] }}
      />

      {/* Silver needles descending from above — staggered like actual rain */}
      {needles.map((n, i) => (
        <motion.div
          key={`needle-${i}`}
          className="absolute"
          style={{
            width: 1.5,
            left: `${n.x}%`,
            top: 0,
            background: 'linear-gradient(to bottom, #e2e8f0 0%, #94a3b8 50%, #e2e8f0 100%)',
            transformOrigin: 'top center',
            filter: 'drop-shadow(0 0 2px #e2e8f0)',
          }}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: ['0%', '50%'], opacity: [0, 0.9, 0.8] }}
          transition={{ duration: 0.22, delay: n.delay + 0.12, ease: 'easeIn' }}
        />
      ))}

      {/* Needle tip glow — glints at the insertion point */}
      {needles.slice(0, 6).map((n, i) => (
        <motion.div
          key={`tip-${i}`}
          className="absolute rounded-full"
          style={{
            width: 4, height: 4,
            left: `${n.x}%`, top: '48%',
            transform: 'translate(-50%, -50%)',
            background: '#e2e8f0',
            boxShadow: '0 0 5px 2px #94a3b888',
            filter: 'blur(0.5px)',
          }}
          animate={{ opacity: [0, 0.8, 0.6, 0], scale: [0, 1.5, 1, 0] }}
          transition={{ duration: 0.4, delay: n.delay + 0.35 }}
        />
      ))}

      {/* Silver threads — impossibly thin lines from each needle to the puppet */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {threads.map((d, i) => (
          <motion.path
            key={`thread-${i}`} d={d}
            stroke="#94a3b866" strokeWidth="0.4" strokeLinecap="round" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 0.55, 0.4] }}
            transition={{ duration: 0.35, delay: 0.5 + i * 0.05 }}
          />
        ))}
      </svg>

      {/* Mechanical jerk flashes — the puppet moves at impossible angles */}
      {jerks.map((j, i) => (
        <motion.div
          key={`jerk-${i}`}
          className="absolute"
          style={{
            width: 18, height: 28,
            left: `${j.x}%`, top: `${j.y}%`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(ellipse, #e2e8f044 0%, transparent 72%)',
            filter: 'blur(3px)',
            borderRadius: '35%',
            border: '1px solid #94a3b833',
          }}
          animate={{ opacity: [0, 0.75, 0], scale: [0.8, 1.15, 0.8] }}
          transition={{ duration: 0.12, delay: j.delay, repeat: 2, repeatDelay: 0.12 }}
        />
      ))}

      {/* Alien circular eyes — two silver discs, no humanity whatsoever */}
      {([-9, 9] as const).map((offset, i) => (
        <motion.div
          key={`eye-${i}`}
          className="absolute rounded-full"
          style={{
            width: 8, height: 8,
            left: `calc(${originX}% + ${offset}px)`,
            top: '34%',
            background: 'radial-gradient(circle, #e2e8f0 0%, #94a3b8 60%, transparent 90%)',
            filter: 'blur(0.3px)',
            boxShadow: '0 0 6px 2px #e2e8f077',
          }}
          animate={{ opacity: [0, 0, 0.9, 0.8, 0.9, 0] }}
          transition={{ duration: 2.6, times: [0, 0.12, 0.24, 0.52, 0.72, 1] }}
        />
      ))}

      {/* Subdued silver aura — no warmth, no colour, just cold precision */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 55, height: 80,
          left: `${originX}%`, top: '48%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, #e2e8f011 0%, transparent 72%)',
          filter: 'blur(8px)',
        }}
        animate={{ scale: [0.9, 1.05, 0.95, 1.1, 0.8], opacity: [0, 0.45, 0.35, 0.5, 0] }}
        transition={{ duration: 2.6, times: [0, 0.25, 0.5, 0.75, 1] }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  UVOGIN — BIG BANG IMPACT: PURE ENHANCEMENT
// ─────────────────────────────────────────────────────────────────────────────
// Uvogin has no special Nen ability. He is pure Enhancement — the strongest
// body in the Phantom Troupe. No tricks. No transmutation. No emission. ONE fist.
// Raw copper-red aura erupts from his body. The fist travels with earthquake
// force. Impact crazes the ground in every direction. Shockwave rings with real
// WEIGHT. Debris flies. No subtlety, no ceremony — the purest attack in Nen.

const UVOG_CRACKS_L = [
  'M82,68 L100,62', 'M82,68 L98,72',
  'M82,68 L96,82',  'M82,68 L85,96',
  'M82,68 L74,95',  'M82,68 L60,90',
  'M82,68 L50,88',  'M82,68 L64,100',
]
const UVOG_CRACKS_R = [
  'M18,68 L0,62',  'M18,68 L2,72',
  'M18,68 L4,82',  'M18,68 L15,96',
  'M18,68 L26,95', 'M18,68 L40,90',
  'M18,68 L50,88', 'M18,68 L36,100',
]

// Debris chunks flying from impact
const UVOG_DEBRIS_L = [
  { dx: 38, dy: -28, delay: 1.42 }, { dx: -18, dy: -42, delay: 1.50 },
  { dx: 50, dy:  14, delay: 1.38 }, { dx:  22, dy: -55, delay: 1.55 },
  { dx:-32, dy: -18, delay: 1.46 }, { dx:  58, dy: -10, delay: 1.48 },
]
const UVOG_DEBRIS_R = UVOG_DEBRIS_L.map(d => ({ ...d, dx: -d.dx }))

export function BigBangImpactEffect({ side }: EffectProps) {
  const originX = side === 'left' ? 22 : 78
  const impactX = side === 'left' ? 82 : 18
  const cracks  = side === 'left' ? UVOG_CRACKS_L : UVOG_CRACKS_R
  const debris  = side === 'left' ? UVOG_DEBRIS_L  : UVOG_DEBRIS_R

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Raw copper-red Enhancement atmosphere — pure body power, no element */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${originX}% 52%, #431407 0%, #1c0805 35%, transparent 70%)` }}
        animate={{ opacity: [0, 0.65, 0.78, 0.55, 0] }}
        transition={{ duration: 3.0, times: [0, 0.12, 0.35, 0.7, 1] }}
      />

      {/* Enhancement aura eruption — no finesse, pure body radiating power */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 78, height: 110,
          left: `${originX}%`, top: '48%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, #ea580c66 0%, #c2410c44 28%, #7c2d1233 55%, transparent 78%)',
          filter: 'blur(9px)',
        }}
        animate={{ scale: [0, 1.5, 1.2, 1.7, 0.4], opacity: [0, 0.9, 0.7, 0.95, 0] }}
        transition={{ duration: 1.4, times: [0, 0.18, 0.38, 0.62, 1] }}
      />

      {/* The fist traveling — no beam, just a copper sphere moving fast */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 22, height: 22,
          left: `${originX}%`, top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #fb923c 0%, #ea580c 40%, #7c2d12 70%, transparent 90%)',
          filter: 'blur(2px)',
          boxShadow: '0 0 14px 5px #ea580c88',
        }}
        animate={{ x: [0, 0, (impactX - originX) * 4.8], scale: [0, 1.2, 0.9], opacity: [0, 1, 0.85] }}
        transition={{ duration: 1.2, delay: 0.5, times: [0, 0.12, 1], ease: 'easeIn' }}
      />

      {/* IMPACT FLASH — earthquake-force hit */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 65, height: 65,
          left: `${impactX}%`, top: '68%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #fef3c7 0%, #fb923ccc 30%, transparent 70%)',
          filter: 'blur(7px)',
        }}
        animate={{ scale: [0, 3.0, 0.3, 0], opacity: [0, 0.95, 0.6, 0] }}
        transition={{ duration: 0.35, delay: 1.7 }}
      />

      {/* Ground cracks radiating from impact — the earth can't hold this punch */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ filter: 'drop-shadow(0 0 3px #ea580c)' }}
      >
        {cracks.map((d, i) => (
          <motion.path
            key={`crack-${i}`} d={d}
            stroke={i < 4 ? '#fb923c' : '#ea580c'}
            strokeWidth={1.8 - i * 0.1} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 1, 0.7] }}
            transition={{ duration: 0.22, delay: 1.74 + i * 0.028 }}
          />
        ))}
      </svg>

      {/* Shockwave rings — physical weight, not energy rings */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={`wave-${i}`}
          className="absolute rounded-full border-2"
          style={{
            left: `${impactX}%`, top: '68%',
            transform: 'translate(-50%, -50%)',
            borderColor: i === 0 ? '#fb923c99' : `#ea580c${i === 1 ? '66' : '44'}`,
            filter: 'blur(1.5px)',
          }}
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{ width: 70 + i * 70, height: 50 + i * 50, opacity: [0.85, 0] }}
          transition={{ duration: 0.55, delay: 1.76 + i * 0.14 }}
        />
      ))}

      {/* Debris flying from impact — rock, concrete, ground material */}
      {debris.map((d, i) => (
        <motion.div
          key={`debris-${i}`}
          className="absolute"
          style={{
            width: 5 + (i % 3), height: 4 + (i % 2),
            left: `${impactX}%`, top: '68%',
            transform: `translate(-50%, -50%) rotate(${i * 28}deg)`,
            background: '#92400e',
            filter: 'blur(0.8px)',
          }}
          animate={{ x: d.dx, y: d.dy, opacity: [0, 0.9, 0.6, 0], scale: [0, 1.2, 0.8, 0] }}
          transition={{ duration: 0.7, delay: d.delay }}
        />
      ))}

      {/* Raw Enhancement particles erupting upward — visible Nen from the body */}
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <motion.div
          key={`erupt-${i}`}
          className="absolute rounded-full"
          style={{
            width: 4 + (i % 3), height: 4 + (i % 3),
            left: `${originX + (-10 + i * 3.3)}%`,
            top: '50%',
            background: i % 2 === 0 ? '#fb923c' : '#ea580c',
            filter: 'blur(1.5px)',
          }}
          animate={{ y: -(65 + i * 16), opacity: [0, 0.88, 0], scale: [0, 1.3, 0] }}
          transition={{ duration: 0.8 + i * 0.07, delay: 0.2 + i * 0.08 }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  GING FREECSS — NEN COPY: PERFECT NEUTRALITY
// ─────────────────────────────────────────────────────────────────────────────
// Ging's Nen has no category, no colour — it is perfectly neutral. He can
// observe any technique and return it amplified with deeper understanding.
// Coloured particles stream in from the opponent side. A white mirror sphere
// absorbs them. A flash of total comprehension. Then white particles stream
// BACK — more numerous, purer, harder. Ging barely moves throughout.

// Incoming particles — opponent's coloured technique flowing toward Ging
const GING_IN_L = [
  { sx: 85, sy: 28, delay: 0.08 }, { sx: 90, sy: 45, delay: 0.14 },
  { sx: 82, sy: 60, delay: 0.06 }, { sx: 88, sy: 72, delay: 0.10 },
  { sx: 78, sy: 35, delay: 0.12 }, { sx: 92, sy: 55, delay: 0.05 },
  { sx: 86, sy: 80, delay: 0.16 }, { sx: 80, sy: 20, delay: 0.09 },
]
const GING_IN_R = GING_IN_L.map(p => ({ sx: 100 - p.sx, sy: p.sy, delay: p.delay }))

// Return particles — amplified, white, streamed back to the opponent
const GING_RETURN_L = [
  { tx: 82, ty: 25, delay: 1.08 }, { tx: 88, ty: 42, delay: 1.14 },
  { tx: 80, ty: 58, delay: 1.06 }, { tx: 86, ty: 70, delay: 1.10 },
  { tx: 76, ty: 32, delay: 1.12 }, { tx: 90, ty: 52, delay: 1.05 },
  { tx: 84, ty: 78, delay: 1.16 }, { tx: 78, ty: 18, delay: 1.09 },
  { tx: 92, ty: 65, delay: 1.18 }, { tx: 74, ty: 48, delay: 1.04 },
]
const GING_RETURN_R = GING_RETURN_L.map(p => ({ tx: 100 - p.tx, ty: p.ty, delay: p.delay }))

// The 8 colours representing various Nen categories / abilities being absorbed
const GING_IN_COLORS = ['#4ade80', '#38bdf8', '#f97316', '#a855f7', '#fbbf24', '#ef4444', '#ec4899', '#22d3ee']

export function NenCopyEffect({ side }: EffectProps) {
  const originX  = side === 'left' ? 22 : 78
  const incoming = side === 'left' ? GING_IN_L     : GING_IN_R
  const returned = side === 'left' ? GING_RETURN_L  : GING_RETURN_R

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Perfectly neutral silver — no element, no category, total balance */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${originX}% 50%, #f8fafc18 0%, transparent 55%)` }}
        animate={{ opacity: [0, 0.55, 0.4, 0.55, 0] }}
        transition={{ duration: 3.0, times: [0, 0.18, 0.45, 0.72, 1] }}
      />

      {/* Incoming coloured particles — opponent's technique flowing toward Ging */}
      {incoming.map((p, i) => {
        const dx = (originX - p.sx) * 4.5
        const dy = (50 - p.sy) * 3.5
        return (
          <motion.div
            key={`in-${i}`}
            className="absolute rounded-full"
            style={{
              width: 5, height: 5,
              left: `${p.sx}%`, top: `${p.sy}%`,
              transform: 'translate(-50%, -50%)',
              background: GING_IN_COLORS[i % GING_IN_COLORS.length],
              filter: 'blur(1px)',
              boxShadow: `0 0 4px 2px ${GING_IN_COLORS[i % GING_IN_COLORS.length]}77`,
            }}
            animate={{ x: [0, dx], y: [0, dy], opacity: [0, 0.8, 0], scale: [0, 1.2, 0] }}
            transition={{ duration: 0.5, delay: p.delay, ease: 'easeIn' }}
          />
        )
      })}

      {/* Ging's neutral absorption sphere — colourless white, a perfect mirror */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 30, height: 30,
          left: `${originX}%`, top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #ffffff44 0%, #e2e8f022 35%, transparent 72%)',
          border: '1px solid #e2e8f055',
          filter: 'blur(3px)',
        }}
        animate={{ scale: [0, 1.4, 1.1, 1.5, 0], opacity: [0, 0.7, 0.55, 0.75, 0] }}
        transition={{ duration: 2.8, times: [0, 0.22, 0.45, 0.68, 1] }}
      />

      {/* Mirror flash — the moment of total comprehension */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${originX}% 50%, #ffffff33 0%, transparent 40%)` }}
        animate={{ opacity: [0, 0, 0.85, 0] }}
        transition={{ duration: 0.25, delay: 0.72 }}
      />

      {/* Return particles — amplified, white, more numerous than what came in */}
      {returned.map((p, i) => {
        const dx = (p.tx - originX) * 4.5
        const dy = (p.ty - 50) * 3.5
        return (
          <motion.div
            key={`ret-${i}`}
            className="absolute rounded-full"
            style={{
              width: 6, height: 6,
              left: `${originX}%`, top: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#f8fafc',
              filter: 'blur(1px)',
              boxShadow: '0 0 5px 2px #e2e8f088',
            }}
            animate={{ x: [0, dx], y: [0, dy], opacity: [0, 0.9, 0.6, 0], scale: [0, 1.4, 0.8, 0] }}
            transition={{ duration: 0.6, delay: p.delay, ease: 'easeOut' }}
          />
        )
      })}

      {/* Very faint text — Ging's philosophical understanding */}
      <motion.div
        className="absolute"
        style={{
          left: `${originX}%`, top: '18%',
          transform: 'translate(-50%, -50%)',
          color: '#94a3b877',
          fontSize: '8px',
          fontStyle: 'italic',
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
        }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.8, delay: 0.68 }}
      >
        returned
      </motion.div>

      {/* Aftermath — Ging's neutral aura, unchanged. He was just watching. */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 55, height: 75,
          left: `${originX}%`, top: '48%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(ellipse, #f8fafc11 0%, transparent 72%)',
          filter: 'blur(8px)',
        }}
        animate={{ scale: [0.95, 1.05, 0.95, 1.02], opacity: [0, 0.4, 0.3, 0.35, 0] }}
        transition={{ duration: 2.5, times: [0, 0.28, 0.55, 0.8, 1] }}
      />
    </div>
  )
}
