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

// Card layout: [header: name + subtitle] [image] [footer: power]
// Heights must sum to h exactly.
const SIZES = {
  sm: { w: 110, h: 154, headerH: 38, imgH: 92,  footerH: 24,
        nameSize:  'text-[11px] font-black leading-tight',
        subSize:   'text-[8px]',
        powerSize: 'text-[12px] font-black tracking-tight' },
  md: { w: 150, h: 210, headerH: 52, imgH: 122, footerH: 36,
        nameSize:  'text-[14px] font-black leading-tight',
        subSize:   'text-[10px]',
        powerSize: 'text-[16px] font-black tracking-tight' },
  lg: { w: 190, h: 266, headerH: 64, imgH: 158, footerH: 44,
        nameSize:  'text-[18px] font-black leading-tight',
        subSize:   'text-[11px]',
        powerSize: 'text-[20px] font-black tracking-tight' },
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
        'relative flex flex-col overflow-hidden rounded-xl border bg-void-900',
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
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-void-700 to-void-900">
          <div className="w-3/4 h-3/4 rounded-lg border border-white/10 bg-void-800/50 flex items-center justify-center">
            <span className="text-white/10 font-bold" style={{ fontSize: dims.footerH * 0.8 }}>?</span>
          </div>
        </div>
      ) : (
        <>
          {/* ── Header: name + verse·arc ── */}
          <div
            className="flex flex-col justify-center px-2 shrink-0 bg-void-900 border-b border-white/5"
            style={{ height: dims.headerH }}
          >
            <p className={cn('text-white truncate', dims.nameSize)}>
              {locked ? '???' : character.name}
            </p>
            {!locked && (
              <p className={cn('text-white/40 truncate', dims.subSize)}>
                {verse.label} · {character.arc_version}
              </p>
            )}
          </div>

          {/* ── Image ── */}
          <div className="relative overflow-hidden shrink-0" style={{ height: dims.imgH }}>
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
            {locked && (
              <div className="absolute inset-0 flex items-center justify-center bg-void-900/60">
                <span className="text-2xl font-black text-white/20">???</span>
              </div>
            )}
          </div>

          {/* ── Footer: power level ── */}
          <div
            className="flex items-center justify-center px-2 shrink-0 bg-void-900 border-t border-white/5"
            style={{ height: dims.footerH }}
          >
            {!locked && (
              <p className={cn(dims.powerSize, verse.accent)}>
                {formatPowerLevel(character.power_level)}
              </p>
            )}
          </div>

          {/* Selected ring overlay */}
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
          <span className="text-white/10 font-bold" style={{ fontSize: dims.imgH / 5 }}>?</span>
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
