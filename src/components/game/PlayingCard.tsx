'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { formatPowerLevel } from '@/lib/utils/format'
import type { Character } from '@/types/character'

// Tries .webp → .jpg → .png in order, falls back to placeholder.
// Works regardless of what extension is stored in image_path.
const IMG_EXTS = ['.webp', '.jpg', '.jpeg', '.png'] as const

function useCardImage(imagePath: string) {
  const base = '/' + imagePath.replace(/\.(webp|jpe?g|png)$/i, '')
  const [idx, setIdx] = useState(0)
  const prevBase = useRef(base)

  useEffect(() => {
    if (prevBase.current !== base) {
      prevBase.current = base
      setIdx(0)
    }
  }, [base])

  const src      = idx < IMG_EXTS.length ? `${base}${IMG_EXTS[idx]}` : '/assets/placeholder_character.png'
  const onError  = useCallback(() => setIdx(i => i + 1), [])
  return { src, onError }
}

const VERSE_COLORS: Record<string, { border: string; accent: string; glow: string; label: string }> = {
  one_piece: { border: 'border-orange-500/40', accent: 'text-orange-400', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]', label: 'One Piece' },
  naruto:    { border: 'border-amber-500/40',  accent: 'text-amber-400',  glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]', label: 'Naruto' },
  dbz:       { border: 'border-purple-500/40', accent: 'text-purple-400', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',  label: 'Dragon Ball' },
  hxh:       { border: 'border-emerald-500/40',accent: 'text-emerald-400',glow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]', label: 'HxH' },
}

const SIZES = {
  sm:  { w: 100, h: 140, img: 96,  name: 'text-[10px]', sub: 'text-[8px]',  power: 'text-[9px]'  },
  md:  { w: 140, h: 196, img: 140, name: 'text-xs',     sub: 'text-[10px]', power: 'text-[11px]' },
  lg:  { w: 180, h: 252, img: 184, name: 'text-sm',     sub: 'text-xs',     power: 'text-sm'     },
}

interface PlayingCardProps {
  character: Character
  selectable?: boolean
  selected?: boolean
  onSelect?: (character: Character) => void
  size?: 'sm' | 'md' | 'lg'
  faceDown?: boolean
  used?: boolean
  locked?: boolean
  animate?: boolean
  className?: string
  style?: React.CSSProperties
}

export function PlayingCard({
  character,
  selectable = false,
  selected = false,
  onSelect,
  size = 'md',
  faceDown = false,
  used = false,
  locked = false,
  animate = true,
  className,
  style,
}: PlayingCardProps) {
  const verse              = VERSE_COLORS[character.verse] ?? VERSE_COLORS.one_piece
  const dims               = SIZES[size]
  const { src: imgSrc, onError: imgOnError } = useCardImage(character.image_path)

  const cardContent = (
    <div
      onClick={() => selectable && !used && onSelect?.(character)}
      style={{ width: dims.w, height: dims.h, ...style }}
      className={cn(
        'relative flex flex-col overflow-hidden rounded-xl border bg-void-800',
        'transition-all duration-200 select-none',
        verse.border,
        selectable && !used && 'cursor-pointer',
        selected && `ring-2 ring-gold-400 ${verse.glow} scale-[1.05] -translate-y-2`,
        !selected && selectable && !used && 'hover:scale-[1.03] hover:-translate-y-1 hover:shadow-card-hover',
        used && 'opacity-40 grayscale',
        locked && 'grayscale brightness-50',
        className,
      )}
    >
      {faceDown ? (
        // Face-down / masked card back
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-void-700 to-void-900">
          <div className="w-3/4 h-3/4 rounded-lg border border-white/10 bg-void-800/50 flex items-center justify-center">
            <span className="text-white/10 text-2xl font-bold">?</span>
          </div>
        </div>
      ) : (
        <>
          {/* Art */}
          <div className="relative overflow-hidden" style={{ height: dims.img }}>
            <Image
              src={imgSrc}
              alt={character.name}
              fill
              className={cn('object-cover object-top', locked && 'blur-sm')}
              sizes={`${dims.w}px`}
              quality={80}
              loading="lazy"
              onError={imgOnError}
            />
            {/* Bottom gradient */}
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-void-900/95 to-transparent pointer-events-none" />

            {/* Verse pip — top-left */}
            <div className={cn('absolute top-1.5 left-1.5 text-[8px] font-black uppercase tracking-wider', verse.accent)}>
              {verse.label}
            </div>

            {/* Locked overlay */}
            {locked && (
              <div className="absolute inset-0 flex items-center justify-center bg-void-900/60">
                <span className="text-2xl font-black text-white/20">???</span>
              </div>
            )}
          </div>

          {/* Info strip */}
          <div className="flex flex-col gap-0.5 px-2 py-1.5 bg-gradient-to-b from-void-800 to-void-900">
            <p className={cn('font-bold text-white leading-tight truncate', dims.name)}>
              {locked ? '???' : character.name}
            </p>
            {!locked && (
              <>
                <p className={cn('text-white/40 truncate', dims.sub)}>{character.arc_version}</p>
                <p className={cn('font-mono font-bold', dims.power, verse.accent)}>
                  ⚡ {formatPowerLevel(character.power_level)}
                </p>
              </>
            )}
          </div>

          {/* Selected gold glow overlay */}
          {selected && (
            <div className="absolute inset-0 rounded-xl ring-inset ring-2 ring-gold-400/60 pointer-events-none" />
          )}
        </>
      )}
    </div>
  )

  if (!animate) return cardContent

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ type: 'spring', damping: 16, stiffness: 260 }}
    >
      {cardContent}
    </motion.div>
  )
}

// ── Face-down card ─────────────────────────────────────────────────────────────

interface FaceDownCardProps {
  size?: 'sm' | 'md' | 'lg'
  selectable?: boolean
  selected?: boolean
  onSelect?: () => void
  animate?: boolean
  className?: string
  style?: React.CSSProperties
}

export function FaceDownCard({
  size = 'md',
  selectable = false,
  selected = false,
  onSelect,
  animate = true,
  className,
  style,
}: FaceDownCardProps) {
  const dims = SIZES[size]

  const card = (
    <div
      onClick={() => selectable && onSelect?.()}
      style={{ width: dims.w, height: dims.h, ...style }}
      className={cn(
        'relative rounded-xl border border-white/10 bg-gradient-to-br from-void-700 to-void-900 overflow-hidden',
        'transition-all duration-200 select-none',
        selectable && 'cursor-pointer hover:scale-[1.03] hover:-translate-y-1 hover:border-white/20',
        selected && 'ring-2 ring-gold-400 scale-[1.05] -translate-y-2',
        className,
      )}
    >
      <div className="flex-1 w-full h-full flex items-center justify-center">
        <div className="w-3/4 h-3/4 rounded-lg border border-white/8 bg-void-800/40 flex items-center justify-center">
          <span className="text-white/10 font-bold" style={{ fontSize: dims.img / 5 }}>?</span>
        </div>
      </div>
      {/* Shimmer sweep */}
      <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] animate-shimmer opacity-30 pointer-events-none" />
      {selected && (
        <div className="absolute inset-0 rounded-xl ring-inset ring-2 ring-gold-400/60 pointer-events-none" />
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
