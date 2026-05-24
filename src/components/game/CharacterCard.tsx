'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { formatPowerLevel } from '@/lib/utils/format'
import { PowerTagBadge } from './PowerTag'
import type { Character } from '@/types/character'

const VERSE_COLORS: Record<string, string> = {
  one_piece: 'from-orange-500/20 to-transparent border-orange-500/30',
  naruto:    'from-amber-500/20 to-transparent border-amber-500/30',
  dbz:       'from-purple-500/20 to-transparent border-purple-500/30',
  hxh:       'from-emerald-500/20 to-transparent border-emerald-500/30',
}

const VERSE_ACCENT: Record<string, string> = {
  one_piece: 'text-orange-400',
  naruto:    'text-amber-400',
  dbz:       'text-purple-400',
  hxh:       'text-emerald-400',
}

interface CharacterCardProps {
  character: Character
  selectable?: boolean
  selected?: boolean
  onSelect?: (character: Character) => void
  size?: 'sm' | 'md' | 'lg'
  showTags?: boolean
  showPowerLevel?: boolean
  animate?: boolean
  dimmed?: boolean
  className?: string
}

export function CharacterCard({
  character,
  selectable = false,
  selected = false,
  onSelect,
  size = 'md',
  showTags = true,
  showPowerLevel = true,
  animate = true,
  dimmed = false,
  className,
}: CharacterCardProps) {
  const verseGradient = VERSE_COLORS[character.verse] ?? VERSE_COLORS.one_piece
  const verseAccent   = VERSE_ACCENT[character.verse]  ?? 'text-gold-400'

  const sizeClasses = {
    sm:  'w-32',
    md:  'w-48',
    lg:  'w-64',
  }

  const imgHeight = { sm: 128, md: 192, lg: 256 }

  const card = (
    <div
      onClick={() => selectable && onSelect?.(character)}
      className={cn(
        'relative flex flex-col overflow-hidden rounded-2xl border',
        'bg-gradient-to-b bg-void-800 transition-all duration-200',
        verseGradient,
        selectable && 'cursor-pointer',
        selected && 'ring-2 ring-gold-400 shadow-gold-glow scale-[1.03]',
        !selected && selectable && 'hover:scale-[1.02] hover:shadow-card-hover',
        dimmed && 'opacity-40',
        sizeClasses[size],
        className,
      )}
    >
      {/* Character image */}
      <div className="relative overflow-hidden" style={{ height: imgHeight[size] }}>
        <Image
          src={`/${character.image_path}`}
          alt={character.name}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 128px, 192px"
          onError={(e) => {
            // Fallback to placeholder on missing image
            const target = e.currentTarget as HTMLImageElement
            target.src = '/assets/placeholder_character.png'
          }}
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-void-900/90 to-transparent" />

        {/* Verse label */}
        <div className={cn('absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider', verseAccent)}>
          {character.verse.replace('_', ' ')}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-2">
        <p className="font-semibold text-white leading-tight text-sm line-clamp-1">
          {character.name}
        </p>
        <p className="text-[10px] text-white/50 line-clamp-1">{character.arc_version}</p>

        {showPowerLevel && (
          <p className={cn('text-xs font-mono font-bold', verseAccent)}>
            ⚡ {formatPowerLevel(character.power_level)}
          </p>
        )}

        {showTags && character.power_tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {character.power_tags.slice(0, 3).map(tag => (
              <PowerTagBadge key={tag} label={tag.replace(/_/g, ' ')} size="xs" />
            ))}
          </div>
        )}
      </div>

      {/* Selected overlay */}
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
