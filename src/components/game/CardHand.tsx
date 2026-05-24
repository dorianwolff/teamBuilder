'use client'

import { useState } from 'react'
import { PlayingCard } from './PlayingCard'
import type { Character } from '@/types/character'

interface CardHandProps {
  characters: Character[]
  selectedId?: string | null
  usedIds?: string[]
  onSelect?: (character: Character) => void
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const CARD_OVERLAP: Record<string, number> = { sm: 45, md: 60, lg: 75 }
const CARD_WIDTH:   Record<string, number> = { sm: 110, md: 150, lg: 190 }
const CARD_HEIGHT:  Record<string, number> = { sm: 154, md: 210, lg: 266 }
const MAX_ROTATION = 12   // degrees max tilt at edges
const MAX_LIFT     = 16   // px vertical drop at edges

export function CardHand({
  characters,
  selectedId,
  usedIds = [],
  onSelect,
  size = 'md',
  disabled = false,
}: CardHandProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const n        = characters.length
  const overlap  = CARD_OVERLAP[size] ?? 32
  const cardW    = CARD_WIDTH[size] ?? 140
  const cardH    = CARD_HEIGHT[size] ?? 210
  const visibleW = cardW + (n - 1) * (cardW - overlap)

  if (n === 0) return null

  return (
    <div
      className="relative flex items-end justify-center"
      style={{ width: visibleW, height: cardH }}
    >
      {characters.map((char, i) => {
        const center    = (n - 1) / 2
        const offset    = i - center
        const rotation  = (offset / Math.max(center, 1)) * MAX_ROTATION
        const liftDown  = (Math.abs(offset) / Math.max(center, 1)) * MAX_LIFT
        const isSelected = selectedId === char.id
        const isHovered  = hoveredId === char.id
        const isUsed     = usedIds.includes(char.id)
        const zIndex     = isHovered || isSelected ? n + 10 : i

        return (
          <div
            key={char.id}
            className="absolute bottom-0 transition-all duration-200"
            style={{
              left:      i * (cardW - overlap),
              zIndex,
              transform: `rotate(${rotation}deg) translateY(${isHovered || isSelected ? -8 : liftDown}px)`,
            }}
            onMouseEnter={() => setHoveredId(char.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <PlayingCard
              character={char}
              selectable={!disabled && !isUsed}
              selected={isSelected}
              used={isUsed}
              onSelect={disabled ? undefined : onSelect}
              size={size}
              animate={false}
            />
          </div>
        )
      })}
    </div>
  )
}
