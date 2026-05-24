'use client'

import { cn } from '@/lib/utils/cn'
import type { TagColor } from '@/types/character'

const colorMap: Record<TagColor, { bg: string; text: string; border: string }> = {
  fire:      { bg: 'bg-red-500/15',    text: 'text-red-400',    border: 'border-red-500/30' },
  water:     { bg: 'bg-blue-500/15',   text: 'text-blue-400',   border: 'border-blue-500/30' },
  lightning: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  wind:      { bg: 'bg-green-500/15',  text: 'text-green-400',  border: 'border-green-500/30' },
  earth:     { bg: 'bg-amber-700/15',  text: 'text-amber-600',  border: 'border-amber-700/30' },
  ice:       { bg: 'bg-cyan-400/15',   text: 'text-cyan-300',   border: 'border-cyan-400/30' },
  dark:      { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
  light:     { bg: 'bg-yellow-200/15', text: 'text-yellow-200', border: 'border-yellow-200/30' },
  love:      { bg: 'bg-pink-500/20',   text: 'text-pink-400',   border: 'border-pink-500/40' },
  default:   { bg: 'bg-white/10',      text: 'text-white/60',   border: 'border-white/20' },
}

interface PowerTagProps {
  label: string
  color?: TagColor
  size?: 'xs' | 'sm'
  description?: string
}

export function PowerTagBadge({ label, color = 'default', size = 'sm', description }: PowerTagProps) {
  const c = colorMap[color]
  return (
    <span
      title={description}
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        c.bg, c.text, c.border,
        size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs',
      )}
    >
      {label}
    </span>
  )
}
