'use client'

/**
 * Visual effect overlays keyed by AnimationType.
 * Each exports a single component that renders over the battle background.
 */

import { motion } from 'framer-motion'
import type { AnimationType } from '@/types/animation'
import { ChidoriEffect, KamuiEffect, EightGatesEffect, GentleFistEffect } from './NarutoEffects'
import { ConquerorsHakiEffect, AsuraEffect, DiableJambeEffect, GuraGuraEffect, LightSpeedEffect } from './OnePieceEffects'
import { AdultGonEffect, GodspeedEffect, ZeroHandEffect, BungeeGumEffect, SkillHunterEffect, EmperorTimeEffect, RisingSunEffect, TerpsichoraEffect, RoyalPhotonEffect, NeedleControlEffect, BigBangImpactEffect, NenCopyEffect } from './HxHEffects'
import { UltraInstinctEffect, UltraEgoEffect, HakaiEffect, LegendarySaiyanEffect, BeastModeEffect, SpiritSwordEffect, PowerImpactEffect, SolarKamehamehaEffect, BlackFriezaEffect, CandyBeamEffect } from './DBZEffects'

interface EffectProps {
  color: string
  secondaryColor?: string
  side: 'left' | 'right'
}

// ── Ki Beam ───────────────────────────────────────────────────────────────────
function KiBeamEffect({ color, secondaryColor, side }: EffectProps) {
  const originX = side === 'left' ? '0%' : '100%'
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main beam */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 h-8 sm:h-12"
        style={{
          left: side === 'left' ? 0 : 'auto',
          right: side === 'right' ? 0 : 'auto',
          background: `linear-gradient(${side === 'left' ? 'to right' : 'to left'}, ${color}, ${secondaryColor ?? color}88, transparent)`,
          transformOrigin: originX,
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1, 0.8], opacity: [0, 1, 0.9, 0] }}
        transition={{ duration: 1.4, times: [0, 0.3, 0.7, 1] }}
      >
        <div className="absolute inset-0 blur-md" style={{ background: `${color}88` }} />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-full"
          style={{ height: 2, background: secondaryColor ?? '#ffffff', opacity: 0.9 }}
        />
      </motion.div>

      {/* Impact flash */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `${color}22` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />

      {/* Charge particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + i * 2,
            height: 4 + i * 2,
            background: color,
            top: `${30 + Math.random() * 40}%`,
            left: side === 'left' ? `${5 + i * 6}%` : 'auto',
            right: side === 'right' ? `${5 + i * 6}%` : 'auto',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.4, delay: i * 0.04 }}
        />
      ))}
    </div>
  )
}

// ── Ki / Power Aura ───────────────────────────────────────────────────────────
function KiAuraEffect({ color, secondaryColor, side }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Background wash */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at ${side === 'left' ? '25%' : '75%'} 60%, ${color}55 0%, transparent 65%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.8, 1, 0] }}
        transition={{ duration: 2, times: [0, 0.25, 0.5, 0.75, 1] }}
      />
      {/* Lightning streaks */}
      {Array.from({ length: 6 }).map((_, i) => {
        const x = side === 'left' ? `${10 + i * 5}%` : `${60 + i * 5}%`
        return (
          <motion.div
            key={i}
            className="absolute top-0 bottom-0 w-px"
            style={{ left: x, background: `linear-gradient(to bottom, transparent, ${secondaryColor ?? color}, transparent)` }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: [0, 1, 0], opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.08, repeat: 2, repeatDelay: 0.1 }}
          />
        )
      })}
    </div>
  )
}

// ── Sharingan (spinning tomoe eye) ───────────────────────────────────────────
function SharinganEffect({ color, side }: EffectProps) {
  const cx = side === 'left' ? '25%' : '75%'
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center"
         style={{ justifyContent: side === 'left' ? 'flex-start' : 'flex-end' }}>

      {/* Background tint */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${cx} 50%, ${color}33 0%, transparent 60%)` }}
        initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.6] }} transition={{ duration: 1 }}
      />

      {/* Spinning eye */}
      <motion.div
        className="relative shrink-0"
        style={{ marginLeft: side === 'left' ? '10%' : 0, marginRight: side === 'right' ? '10%' : 0 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative w-20 h-20 sm:w-28 sm:h-28">
          {/* Iris */}
          <div className="absolute inset-0 rounded-full border-4"
               style={{ borderColor: color, background: `radial-gradient(circle, #0f0f0f 30%, ${color} 70%)` }} />
          {/* Spinning tomoe */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          >
            {[0, 120, 240].map(deg => (
              <div key={deg}
                   className="absolute top-1/2 left-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                   style={{
                     background: color,
                     transform: `rotate(${deg}deg) translateY(-10px) translate(-50%, -50%)`,
                   }}
              />
            ))}
          </motion.div>
          {/* Outer glow */}
          <motion.div
            className="absolute -inset-4 rounded-full blur-xl"
            style={{ background: `${color}55` }}
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Distortion lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px w-full"
          style={{ top: `${20 + i * 15}%`, background: `linear-gradient(to right, transparent, ${color}55, transparent)` }}
          initial={{ scaleX: 0 }} animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
        />
      ))}
    </div>
  )
}

// ── Genjutsu — Itachi crows + blood-moon Tsukuyomi ───────────────────────────
function GenjutsuEffect({ color, side }: EffectProps) {
  const cx = side === 'left' ? '25%' : '75%'

  // Pre-computed crow config (stable between renders — no Math.random in JSX)
  const crows = [
    { y: 8,  delay: 0.0,  scale: 0.7, fromRight: false, speed: 1.8 },
    { y: 18, delay: 0.25, scale: 1.0, fromRight: true,  speed: 2.0 },
    { y: 28, delay: 0.5,  scale: 0.6, fromRight: false, speed: 1.5 },
    { y: 38, delay: 0.1,  scale: 0.9, fromRight: false, speed: 2.2 },
    { y: 45, delay: 0.7,  scale: 1.1, fromRight: true,  speed: 1.6 },
    { y: 55, delay: 0.4,  scale: 0.75,fromRight: false, speed: 1.9 },
    { y: 63, delay: 0.9,  scale: 0.85,fromRight: true,  speed: 2.1 },
    { y: 72, delay: 0.2,  scale: 1.0, fromRight: false, speed: 1.7 },
    { y: 80, delay: 0.6,  scale: 0.6, fromRight: true,  speed: 2.3 },
    { y: 88, delay: 0.15, scale: 0.9, fromRight: false, speed: 1.4 },
    { y: 14, delay: 1.0,  scale: 1.2, fromRight: true,  speed: 1.8 },
    { y: 50, delay: 1.2,  scale: 0.7, fromRight: false, speed: 2.0 },
    { y: 33, delay: 1.4,  scale: 0.8, fromRight: true,  speed: 1.6 },
    { y: 68, delay: 1.1,  scale: 1.0, fromRight: false, speed: 2.2 },
    { y: 22, delay: 1.6,  scale: 0.65,fromRight: true,  speed: 1.5 },
    { y: 76, delay: 1.3,  scale: 0.9, fromRight: false, speed: 1.9 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Blood-moon genjutsu backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${cx} 38%, ${color}55 0%, #120006 65%)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.8] }}
        transition={{ duration: 1.5 }}
      />

      {/* Full-screen dark tint that creeps in */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.45, 0.35] }}
        transition={{ duration: 2.5, times: [0, 0.3, 0.8, 1] }}
      />

      {/* Sharingan eye */}
      <motion.div
        className="absolute"
        style={{
          top: '22%',
          [side === 'left' ? 'left' : 'right']: '12%',
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0.9] }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative w-16 h-16 sm:w-24 sm:h-24">
          <div
            className="absolute inset-0 rounded-full border-4"
            style={{
              borderColor: color,
              background: `radial-gradient(circle, #0f0005 30%, ${color} 70%)`,
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          >
            {[0, 120, 240].map(deg => (
              <div
                key={deg}
                className="absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full"
                style={{
                  background: color,
                  transform: `rotate(${deg}deg) translateY(-9px) translate(-50%, -50%)`,
                }}
              />
            ))}
          </motion.div>
          <motion.div
            className="absolute -inset-5 rounded-full blur-2xl"
            style={{ background: `${color}55` }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Crow silhouettes — SVG bird shapes flying across */}
      {crows.map((crow, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ top: `${crow.y}%` }}
          initial={{ x: crow.fromRight ? '110vw' : '-110vw', opacity: 0 }}
          animate={{
            x: crow.fromRight ? '-110vw' : '110vw',
            opacity: [0, 0.9, 0.9, 0.8, 0],
          }}
          transition={{
            x:       { duration: crow.speed, delay: crow.delay, ease: 'linear' },
            opacity: { duration: crow.speed, delay: crow.delay,
                       times: [0, 0.06, 0.75, 0.92, 1] },
          }}
        >
          <svg
            width={Math.round(34 * crow.scale)}
            height={Math.round(20 * crow.scale)}
            viewBox="0 0 40 22"
            style={{
              fill: '#08000f',
              filter: `drop-shadow(0 0 3px ${color}bb)`,
              transform: crow.fromRight ? 'scaleX(-1)' : 'none',
            }}
          >
            {/*
              Bird silhouette: two arched wings meeting at a small body in the centre.
              Outer points sweep out and down; tips curl slightly upward.
            */}
            <path d="
              M20 11
              C 16 8 10 7 6  9  C 3 10  0 12  0 14
              C 5 11 12 10 20 12
              C 28 10 35 11 40 14
              C 40 12 37 10 34 9  C 30 7 24 8 20 11
              Z
            " />
          </svg>
        </motion.div>
      ))}

      {/* World-distortion lines */}
      {[20, 38, 56, 72].map((yPct, i) => (
        <motion.div
          key={i}
          className="absolute h-px w-full"
          style={{
            top: `${yPct}%`,
            background: `linear-gradient(to right, transparent, ${color}44, transparent)`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
        />
      ))}
    </div>
  )
}

// ── Byakugan ──────────────────────────────────────────────────────────────────
function ByakuganEffect({ color, side }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${side === 'left' ? '25%' : '75%'} 50%, ${color}44 0%, transparent 65%)` }}
        initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.7, 0] }} transition={{ duration: 2 }}
      />
      {/* Vein network lines */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * 360
        return (
          <motion.div key={i}
            className="absolute top-1/2 rounded-full"
            style={{
              left: side === 'left' ? '20%' : '80%',
              width: 60 + Math.random() * 40,
              height: 1.5,
              background: color,
              transformOrigin: 'left center',
              transform: `rotate(${angle}deg)`,
              opacity: 0.6,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 1, 0.8] }}
            transition={{ duration: 0.6, delay: i * 0.03 }}
          />
        )
      })}
      {/* Pupil */}
      <motion.div
        className="absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full"
        style={{
          top: '50%', left: side === 'left' ? '20%' : '80%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, #ffffff 20%, ${color} 70%)`,
          boxShadow: `0 0 20px 10px ${color}88`,
        }}
        initial={{ scale: 0 }} animate={{ scale: [0, 1.5, 1] }} transition={{ duration: 0.5 }}
      />
    </div>
  )
}

// ── Shadow Possession ─────────────────────────────────────────────────────────
function ShadowEffect({ color, side }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '60%',
          background: `linear-gradient(to top, ${color}dd 0%, ${color}88 40%, transparent 80%)`,
          transformOrigin: 'bottom',
        }}
        initial={{ scaleY: 0 }} animate={{ scaleY: [0, 1, 0.9] }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      {/* Tendrils */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div key={i}
          className="absolute bottom-0 rounded-t-full"
          style={{
            width: 8 + i * 6,
            height: 80 + Math.random() * 80,
            background: color,
            left: `${10 + i * 18}%`,
            transformOrigin: 'bottom',
            opacity: 0.7,
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: [0, 1.1, 0.9] }}
          transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

// ── Nen Aura ──────────────────────────────────────────────────────────────────
function NenAuraEffect({ color, secondaryColor, side }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at ${side === 'left' ? '30%' : '70%'} 60%, ${color}66 0%, transparent 60%)` }}
        animate={{ opacity: [0, 1, 0.7, 1, 0] }}
        transition={{ duration: 2, times: [0, 0.3, 0.5, 0.7, 1] }}
      />
      {Array.from({ length: 10 }).map((_, i) => {
        const size = 8 + Math.random() * 14
        return (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{
              width: size, height: size,
              background: secondaryColor ?? color,
              top: `${10 + Math.random() * 70}%`,
              left: side === 'left' ? `${5 + Math.random() * 45}%` : `${50 + Math.random() * 45}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 0], opacity: [0, 0.9, 0], y: [0, -30] }}
            transition={{ duration: 1 + Math.random() * 0.5, delay: Math.random() * 0.6, repeat: 1 }}
          />
        )
      })}
    </div>
  )
}

// ── Chain Jail (Kurapika) ─────────────────────────────────────────────────────
function ChainJailEffect({ color }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div className="absolute inset-0"
        style={{ background: `${color}22` }}
        animate={{ opacity: [0, 0.8, 0.4, 0] }}
        transition={{ duration: 2 }}
      />
      {Array.from({ length: 8 }).map((_, i) => {
        const y = 10 + i * 10
        return (
          <motion.div key={i}
            className="absolute h-0.5 w-full"
            style={{ top: `${y}%`, background: `repeating-linear-gradient(to right, ${color} 0px, ${color} 6px, transparent 6px, transparent 12px)` }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0.8] }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          />
        )
      })}
    </div>
  )
}

// ── Haki Burst ────────────────────────────────────────────────────────────────
function HakiBurstEffect({ color, side }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at ${side === 'left' ? '20%' : '80%'} 50%, ${color}88 0%, transparent 60%)` }}
        animate={{ opacity: [0, 1, 0.6, 0] }} transition={{ duration: 1.8 }}
      />
      {/* Lightning bolts */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div key={i}
          className="absolute top-0 bottom-0 w-0.5"
          style={{
            left: side === 'left' ? `${5 + i * 10}%` : `${55 + i * 8}%`,
            background: `linear-gradient(to bottom, transparent, ${color}cc, transparent)`,
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.07, repeat: 2, repeatDelay: 0.2 }}
        />
      ))}
      {/* Flash */}
      <motion.div className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }} animate={{ opacity: [0, 0.15, 0] }}
        transition={{ duration: 0.3, delay: 0.4 }}
      />
    </div>
  )
}

// ── Logia Transform ───────────────────────────────────────────────────────────
function LogiaEffect({ color, side }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at ${side === 'left' ? '25%' : '75%'} 50%, ${color}77 0%, transparent 55%)` }}
        animate={{ opacity: [0, 1, 0.8, 0] }} transition={{ duration: 2 }}
      />
      {Array.from({ length: 12 }).map((_, i) => {
        const size = 10 + Math.random() * 20
        return (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{
              width: size, height: size,
              background: color,
              top: `${10 + Math.random() * 80}%`,
              left: side === 'left' ? `${Math.random() * 45}%` : `${55 + Math.random() * 45}%`,
              filter: 'blur(4px)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 1.5, 0], opacity: [0, 0.9, 0.6, 0] }}
            transition={{ duration: 0.8 + Math.random() * 0.6, delay: Math.random() * 0.5 }}
          />
        )
      })}
    </div>
  )
}

// ── Gear 5 ────────────────────────────────────────────────────────────────────
function Gear5Effect({ color }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }} animate={{ opacity: [0, 0.3, 0, 0.2, 0] }}
        transition={{ duration: 1.5, times: [0, 0.2, 0.5, 0.7, 1] }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 50% 50%, ${color}88 0%, #fef9c3aa 40%, transparent 70%)` }}
        animate={{ opacity: [0, 1, 0.7, 0], scale: [0.5, 1.1, 1] }}
        transition={{ duration: 2 }}
      />
      {/* Fluffy cloud puffs */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: 30 + Math.random() * 50,
            height: 30 + Math.random() * 50,
            background: `radial-gradient(circle, rgba(255,255,255,0.8), rgba(255,255,255,0.2))`,
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
            filter: 'blur(8px)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 1], opacity: [0, 0.8, 0.4] }}
          transition={{ duration: 1, delay: Math.random() * 0.8 }}
        />
      ))}
    </div>
  )
}

// ── Elemental ─────────────────────────────────────────────────────────────────
function ElementalEffect({ color, secondaryColor, side }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at ${side === 'left' ? '25%' : '75%'} 60%, ${color}66 0%, transparent 60%)` }}
        animate={{ opacity: [0, 1, 0.7, 0] }} transition={{ duration: 2 }}
      />
      {Array.from({ length: 14 }).map((_, i) => {
        const size = 6 + Math.random() * 16
        return (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{
              width: size, height: size,
              background: i % 2 ? color : (secondaryColor ?? color),
              top: `${20 + Math.random() * 60}%`,
              left: side === 'left' ? `${Math.random() * 50}%` : `${50 + Math.random() * 50}%`,
            }}
            initial={{ scale: 0, opacity: 0, y: 0 }}
            animate={{ scale: [0, 1, 0], opacity: [0, 0.9, 0], y: -30 - Math.random() * 40 }}
            transition={{ duration: 0.7 + Math.random() * 0.5, delay: Math.random() * 0.8, repeat: 1 }}
          />
        )
      })}
    </div>
  )
}

// ── Darkness / Void ───────────────────────────────────────────────────────────
function DarknessEffect({ side }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0.5, 0.9, 0] }}
        transition={{ duration: 2.5, times: [0, 0.3, 0.5, 0.8, 1] }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at ${side === 'left' ? '25%' : '75%'} 50%, transparent 0%, #000000 40%)` }}
        initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2 }}
      />
    </div>
  )
}

// ── Sword ─────────────────────────────────────────────────────────────────────
function SwordEffect({ color, side }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 15, -15].map((angle, i) => (
        <motion.div key={i}
          className="absolute top-0 bottom-0 w-0.5"
          style={{
            left: side === 'left' ? `${20 + i * 8}%` : `${60 + i * 8}%`,
            background: `linear-gradient(to bottom, transparent, ${color}dd, ${color}ff, transparent)`,
            transform: `rotate(${angle}deg)`,
            transformOrigin: 'center',
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1.2, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.5, delay: i * 0.06 }}
        />
      ))}
      <motion.div className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }} animate={{ opacity: [0, 0.2, 0] }}
        transition={{ duration: 0.2, delay: 0.2 }}
      />
    </div>
  )
}

// ── Physical Strike ───────────────────────────────────────────────────────────
function PhysicalEffect({ color, side }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Shockwave rings */}
      {[0, 1, 2].map(i => (
        <motion.div key={i}
          className="absolute top-1/2 rounded-full border-2"
          style={{
            left: side === 'left' ? '30%' : '70%',
            transform: 'translate(-50%, -50%)',
            borderColor: color,
          }}
          initial={{ width: 0, height: 0, opacity: 0.9 }}
          animate={{ width: 200 + i * 80, height: 200 + i * 80, opacity: 0 }}
          transition={{ duration: 0.8, delay: i * 0.12 }}
        />
      ))}
      <motion.div className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }} animate={{ opacity: [0, 0.25, 0] }}
        transition={{ duration: 0.25 }}
      />
    </div>
  )
}

// ── Poison Cloud ──────────────────────────────────────────────────────────────
function PoisonEffect({ color, side }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: 40 + Math.random() * 60,
            height: 40 + Math.random() * 60,
            background: `radial-gradient(circle, ${color}88, transparent)`,
            filter: 'blur(12px)',
            top: `${20 + Math.random() * 60}%`,
            left: side === 'left' ? `${Math.random() * 50}%` : `${50 + Math.random() * 50}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 1], opacity: [0, 0.7, 0.4] }}
          transition={{ duration: 1.2 + Math.random() * 0.6, delay: Math.random() * 0.6 }}
        />
      ))}
    </div>
  )
}

// ── Time Stop ─────────────────────────────────────────────────────────────────
function TimeStopEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div className="absolute inset-0 bg-slate-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.15, 0.08, 0.15, 0] }}
        transition={{ duration: 2.5 }}
      />
      {/* Frozen particle streaks */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: 2, height: 20 + Math.random() * 40,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0.4,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.5, 0] }}
          transition={{ duration: 2, delay: Math.random() * 0.8 }}
        />
      ))}
    </div>
  )
}

// ── Divine ────────────────────────────────────────────────────────────────────
function DivineEffect({ color }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }} animate={{ opacity: [0, 0.4, 0.1, 0.4, 0] }}
        transition={{ duration: 3, times: [0, 0.2, 0.5, 0.7, 1] }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 50% 40%, ${color}88 0%, transparent 55%)` }}
        animate={{ opacity: [0, 1, 0.6, 0] }} transition={{ duration: 3 }}
      />
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div key={i}
          className="absolute top-1/2 left-1/2 rounded-full border"
          style={{ borderColor: `${color}88` }}
          initial={{ width: 0, height: 0, x: '-50%', y: '-50%', opacity: 0.8 }}
          animate={{ width: 100 + i * 60, height: 100 + i * 60, x: '-50%', y: '-50%', opacity: 0 }}
          transition={{ duration: 1.5, delay: i * 0.2 }}
        />
      ))}
    </div>
  )
}

// ── Puppet Deploy ─────────────────────────────────────────────────────────────
function PuppetEffect({ color, side }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div key={i}
          className="absolute w-0.5 rounded-full"
          style={{
            background: color,
            top: `${20 + i * 15}%`,
            height: `${20 + Math.random() * 30}%`,
            left: side === 'left' ? `${10 + i * 12}%` : `${55 + i * 10}%`,
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: [0, 0.8, 0.6] }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        />
      ))}
    </div>
  )
}

// ── Barrier ───────────────────────────────────────────────────────────────────
function BarrierEffect({ color }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 1, 2].map(i => (
        <motion.div key={i}
          className="absolute inset-4 sm:inset-8 rounded-2xl border-2"
          style={{ borderColor: color, filter: 'blur(1px)' }}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: [1.5, 1], opacity: [0, 0.7, 0.4] }}
          transition={{ duration: 0.8, delay: i * 0.1 }}
        />
      ))}
    </div>
  )
}

// ── Paper Explosion ───────────────────────────────────────────────────────────
function PaperEffect({ color }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-sm"
          style={{
            width: 4 + Math.random() * 8, height: 6 + Math.random() * 12,
            background: color,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{ scale: [0, 1, 0], opacity: [0, 0.9, 0], rotate: Math.random() * 360 }}
          transition={{ duration: 0.8 + Math.random() * 0.6, delay: Math.random() * 1 }}
        />
      ))}
      <motion.div className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }} animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 0.3, delay: 0.8 }}
      />
    </div>
  )
}

// ── Explosion ────────────────────────────────────────────────────────────────
function ExplosionEffect({ color, side }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 0.4, delay: 0.5 }}
      />
      {[0, 1, 2, 3].map(i => (
        <motion.div key={i}
          className="absolute top-1/2 rounded-full"
          style={{
            left: side === 'left' ? '30%' : '70%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, #ffffff 0%, ${color} 30%, transparent 70%)`,
          }}
          initial={{ width: 0, height: 0, opacity: 0.9 }}
          animate={{ width: 80 + i * 60, height: 80 + i * 60, opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.5 + i * 0.08 }}
        />
      ))}
    </div>
  )
}

// ── String Web ───────────────────────────────────────────────────────────────
function StringEffect({ color }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 10 }).map((_, i) => {
        const x1 = Math.random() * 100
        const y1 = Math.random() * 100
        return (
          <motion.div key={i}
            className="absolute"
            style={{
              top: `${y1}%`, left: `${x1}%`,
              width: 60 + Math.random() * 120, height: 1,
              background: color,
              transform: `rotate(${Math.random() * 360}deg)`,
              transformOrigin: 'left center',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 0.7, 0.5] }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          />
        )
      })}
    </div>
  )
}

// ── Rasengan / Bijuu ─────────────────────────────────────────────────────────
function RasenganEffect({ color, secondaryColor, side }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-1/2 rounded-full"
        style={{
          left: side === 'left' ? '35%' : '65%',
          width: 80, height: 80,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, #ffffff 10%, ${color} 50%, transparent 75%)`,
          boxShadow: `0 0 40px 20px ${color}88`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 1.2], opacity: [0, 1, 0.9], rotate: 360 }}
        transition={{ duration: 0.8, rotate: { duration: 1.5, repeat: 2, ease: 'linear' } }}
      />
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: 4, height: 4,
            background: secondaryColor ?? color,
            top: `${30 + Math.random() * 40}%`,
            left: side === 'left' ? `${15 + Math.random() * 40}%` : `${45 + Math.random() * 40}%`,
          }}
          animate={{ x: [0, (Math.random() - 0.5) * 80], y: [0, (Math.random() - 0.5) * 80], opacity: [1, 0] }}
          transition={{ duration: 0.8, delay: Math.random() * 0.4 }}
        />
      ))}
    </div>
  )
}

// ── Sand ─────────────────────────────────────────────────────────────────────
function SandEffect({ color }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '50%', background: `linear-gradient(to top, ${color}dd, transparent)` }}
        initial={{ scaleY: 0 }} animate={{ scaleY: [0, 1, 0.8] }}
        transition={{ duration: 1 }}
      />
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{ width: 3, height: 3, background: color, top: `${20 + Math.random() * 70}%`, left: `${Math.random() * 100}%` }}
          animate={{ y: [0, -20, -40], opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.6, delay: Math.random() * 0.8 }}
        />
      ))}
    </div>
  )
}

// ── Master dispatcher ─────────────────────────────────────────────────────────

export function EffectOverlay({ type, color, secondaryColor, side }: { type: AnimationType } & EffectProps) {
  const props: EffectProps = { color, secondaryColor, side }
  switch (type) {
    case 'ki_beam':           return <KiBeamEffect {...props} />
    case 'ki_aura':           return <KiAuraEffect {...props} />
    case 'sharingan':          return <SharinganEffect {...props} />
    case 'genjutsu':           return <GenjutsuEffect {...props} />
    case 'byakugan':          return <ByakuganEffect {...props} />
    case 'shadow':            return <ShadowEffect {...props} />
    case 'nen_aura':          return <NenAuraEffect {...props} />
    case 'chain_jail':        return <ChainJailEffect {...props} />
    case 'haki_burst':        return <HakiBurstEffect {...props} />
    case 'logia':             return <LogiaEffect {...props} />
    case 'gear5':             return <Gear5Effect {...props} />
    case 'elemental_fire':
    case 'elemental_lightning':
    case 'elemental_wind':
    case 'elemental_water':
    case 'elemental_ice':
    case 'elemental_sand':    return <ElementalEffect {...props} />
    case 'darkness':          return <DarknessEffect {...props} />
    case 'sword':             return <SwordEffect {...props} />
    case 'physical':          return <PhysicalEffect {...props} />
    case 'poison':            return <PoisonEffect {...props} />
    case 'time_stop':         return <TimeStopEffect />
    case 'divine':            return <DivineEffect {...props} />
    case 'puppet':            return <PuppetEffect {...props} />
    case 'barrier':           return <BarrierEffect {...props} />
    case 'paper':             return <PaperEffect {...props} />
    case 'explosion':         return <ExplosionEffect {...props} />
    case 'string':            return <StringEffect {...props} />
    case 'rasengan':
    case 'bijuu':             return <RasenganEffect {...props} />
    case 'sand':              return <SandEffect {...props} />
    case 'chidori':           return <ChidoriEffect {...props} />
    case 'kamui':             return <KamuiEffect {...props} />
    case 'eight_gates':       return <EightGatesEffect {...props} />
    case 'gentle_fist':       return <GentleFistEffect {...props} />
    // ── One Piece ──────────────────────────────────────────────────────────
    case 'conquerors_haki':   return <ConquerorsHakiEffect {...props} />
    case 'asura':             return <AsuraEffect {...props} />
    case 'diable_jambe':      return <DiableJambeEffect {...props} />
    case 'gura_gura':         return <GuraGuraEffect {...props} />
    case 'light_speed':       return <LightSpeedEffect {...props} />
    // ── Hunter × Hunter ────────────────────────────────────────────────────
    case 'adult_gon':         return <AdultGonEffect {...props} />
    case 'godspeed':          return <GodspeedEffect {...props} />
    case 'zero_hand':         return <ZeroHandEffect {...props} />
    case 'bungee_gum':        return <BungeeGumEffect {...props} />
    case 'skill_hunter':      return <SkillHunterEffect {...props} />
    case 'emperor_time':      return <EmperorTimeEffect {...props} />
    case 'rising_sun':        return <RisingSunEffect {...props} />
    case 'terpsichora':       return <TerpsichoraEffect {...props} />
    case 'royal_photon':      return <RoyalPhotonEffect {...props} />
    // ── Dragon Ball ────────────────────────────────────────────────────────
    case 'ultra_instinct':    return <UltraInstinctEffect {...props} />
    case 'ultra_ego':         return <UltraEgoEffect {...props} />
    case 'hakai':             return <HakaiEffect {...props} />
    case 'legendary_saiyan':  return <LegendarySaiyanEffect {...props} />
    case 'beast_mode':        return <BeastModeEffect {...props} />
    case 'spirit_sword':      return <SpiritSwordEffect {...props} />
    case 'power_impact':      return <PowerImpactEffect {...props} />
    case 'solar_kamehameha':  return <SolarKamehamehaEffect {...props} />
    case 'black_frieza':      return <BlackFriezaEffect {...props} />
    case 'candy_beam':        return <CandyBeamEffect {...props} />
    // ── Hunter × Hunter (additional) ───────────────────────────────────────
    case 'needle_control':    return <NeedleControlEffect {...props} />
    case 'big_bang_impact':   return <BigBangImpactEffect {...props} />
    case 'nen_copy':          return <NenCopyEffect {...props} />
    default:                  return <PhysicalEffect {...props} />
  }
}
