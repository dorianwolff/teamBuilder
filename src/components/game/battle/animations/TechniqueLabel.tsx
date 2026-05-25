'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { AnimationType } from '@/types/animation'
import { cn } from '@/lib/utils/cn'

interface TechniqueLabelProps {
  name: string
  type: AnimationType
  color: string
  flavour?: string
  visible: boolean
  side: 'left' | 'right'
}

const TYPE_STYLES: Partial<Record<AnimationType, string>> = {
  ki_aura:            'font-black tracking-tight uppercase',
  ki_beam:            'font-black tracking-tight uppercase',
  sharingan:          'font-bold tracking-widest italic',
  genjutsu:           'font-bold tracking-widest italic',
  nen_aura:           'font-black tracking-wide',
  chain_jail:         'font-black tracking-wide',
  haki_burst:         'font-black tracking-widest uppercase',
  time_stop:          'font-light tracking-[0.3em] uppercase',
  sword:              'font-bold italic tracking-tight',
  divine:             'font-light tracking-[0.25em] uppercase',
  shadow:             'font-bold tracking-widest italic',
  darkness:           'font-black tracking-widest uppercase',
  gear5:              'font-black tracking-tight uppercase',
}

export function TechniqueLabel({ name, type, color, flavour, visible, side }: TechniqueLabelProps) {
  const xDir = side === 'left' ? -40 : 40

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={cn(
            'absolute z-30 flex flex-col gap-1 max-w-[85vw] sm:max-w-xs',
            side === 'left' ? 'left-4 sm:left-6 text-left' : 'right-4 sm:right-6 text-right',
            'top-1/2 -translate-y-1/2',
          )}
          initial={{ opacity: 0, x: xDir, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: xDir * 0.5, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 340, damping: 24 }}
        >
          {/* Glow backing */}
          <motion.div
            className="absolute inset-0 rounded-2xl blur-xl"
            style={{ background: `${color}44` }}
            animate={{ opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />

          {/* Name */}
          <motion.p
            className={cn(
              'relative text-2xl sm:text-3xl md:text-4xl leading-tight drop-shadow-lg',
              TYPE_STYLES[type] ?? 'font-bold',
            )}
            style={{ color }}
            animate={{ textShadow: [`0 0 8px ${color}88`, `0 0 24px ${color}cc`, `0 0 8px ${color}88`] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            {name}
          </motion.p>

          {/* Flavour */}
          {flavour && (
            <motion.p
              className="relative text-xs sm:text-sm text-white/60 font-normal tracking-wide"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              {flavour}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
