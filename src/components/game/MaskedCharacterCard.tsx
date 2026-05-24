'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { Eye } from 'lucide-react'

interface MaskedCharacterCardProps {
  size?: 'sm' | 'md' | 'lg'
  selectable?: boolean
  selected?: boolean
  onSelect?: () => void
  pickedByOpponent?: boolean  // already claimed — show as locked
  className?: string
  animate?: boolean
}

const sizeClasses = {
  sm:  'w-32',
  md:  'w-48',
  lg:  'w-64',
}

const imgHeight = { sm: 128, md: 192, lg: 256 }

export function MaskedCharacterCard({
  size = 'md',
  selectable = false,
  selected = false,
  onSelect,
  pickedByOpponent = false,
  className,
  animate = true,
}: MaskedCharacterCardProps) {
  const card = (
    <div
      onClick={() => selectable && !pickedByOpponent && onSelect?.()}
      className={cn(
        'relative flex flex-col overflow-hidden rounded-2xl border border-white/10',
        'bg-void-800 transition-all duration-200',
        selectable && !pickedByOpponent && 'cursor-pointer hover:scale-[1.02] hover:border-gold-500/40',
        selected && 'ring-2 ring-gold-400 shadow-gold-glow scale-[1.03]',
        pickedByOpponent && 'opacity-40 cursor-not-allowed',
        sizeClasses[size],
        className,
      )}
    >
      {/* Masked face */}
      <div
        className="relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-void-700 to-void-900"
        style={{ height: imgHeight[size] }}
      >
        {/* Animated shimmer */}
        <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-30" />

        {/* Icon */}
        <div className="relative flex flex-col items-center gap-2">
          <Eye size={size === 'sm' ? 24 : 36} className="text-white/20" />
          <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
            {pickedByOpponent ? 'HIDDEN' : 'UNKNOWN'}
          </span>
        </div>

        {/* Question marks pattern */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 select-none pointer-events-none">
          <span className="text-8xl font-black text-white">?</span>
        </div>
      </div>

      {/* Info placeholder */}
      <div className="flex flex-col gap-1.5 p-2">
        <div className="h-3 bg-white/10 rounded-full w-3/4 animate-pulse" />
        <div className="h-2 bg-white/5 rounded-full w-1/2 animate-pulse" />
        <div className="h-2 bg-white/5 rounded-full w-2/3 animate-pulse" />
      </div>

      {selected && (
        <div className="absolute inset-0 rounded-2xl ring-inset ring-2 ring-gold-400/60 pointer-events-none" />
      )}
    </div>
  )

  if (!animate) return card

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 18, stiffness: 280 }}
    >
      {card}
    </motion.div>
  )
}
