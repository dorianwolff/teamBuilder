'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Lock, ArrowUpDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { PlayingCard } from '@/components/game/PlayingCard'
import { PowerTagBadge } from '@/components/game/PowerTag'
import { Modal } from '@/components/ui/Modal'
import { formatPowerLevel } from '@/lib/utils/format'
import type { Character, Verse } from '@/types/character'
import { cn } from '@/lib/utils/cn'

type SortKey = 'power_level' | 'name' | 'verse'
type SortDir = 'asc' | 'desc'

const VERSE_OPTIONS: { value: Verse | 'all'; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'one_piece', label: 'One Piece' },
  { value: 'naruto',    label: 'Naruto' },
  { value: 'dbz',       label: 'Dragon Ball' },
  { value: 'hxh',       label: 'HxH' },
]

const VERSE_ACCENT: Record<string, string> = {
  one_piece: 'text-orange-400',
  naruto:    'text-amber-400',
  dbz:       'text-purple-400',
  hxh:       'text-emerald-400',
}

export default function EncyclopediaPage() {
  const { profile } = useAuth()
  const [characters, setCharacters]   = useState<Character[]>([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [verseFilter, setVerseFilter] = useState<Verse | 'all'>('all')
  const [sortKey, setSortKey]         = useState<SortKey>('power_level')
  const [sortDir, setSortDir]         = useState<SortDir>('desc')
  const [selected, setSelected]       = useState<Character | null>(null)
  const [showLocked, setShowLocked]   = useState(true)

  const discoveredSlugs = profile?.discovered_characters ?? []

  useEffect(() => {
    async function load() {
      console.log('[Encyclopedia] loading characters...')
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('characters')
          .select('*')
          .order('power_level', { ascending: false })

        console.log('[Encyclopedia] result → count:', data?.length ?? 0, '| error:', error?.message ?? 'none')

        if (error) {
          console.error('[Encyclopedia] Supabase error:', error)
        } else if (data) {
          setCharacters(data as unknown as Character[])
        }
      } catch (err) {
        console.error('[Encyclopedia] unexpected error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = characters
    .filter(c => verseFilter === 'all' || c.verse === verseFilter)
    .filter(c => {
      if (!showLocked) return discoveredSlugs.includes(c.slug)
      return true
    })
    .filter(c => {
      const q = search.toLowerCase()
      if (!q) return true
      const discovered = discoveredSlugs.includes(c.slug)
      if (!discovered) return false  // can't search locked characters
      return c.name.toLowerCase().includes(q) || c.arc_version.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      let val = 0
      if (sortKey === 'power_level') val = a.power_level - b.power_level
      if (sortKey === 'name') val = a.name.localeCompare(b.name)
      if (sortKey === 'verse') val = a.verse.localeCompare(b.verse)
      return sortDir === 'asc' ? val : -val
    })

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const totalDiscovered = discoveredSlugs.length
  const totalInGame     = characters.length

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">Encyclopedia</h1>
        <p className="text-white/40 text-sm">Unlock characters by playing games</p>
        <div className="flex items-center gap-4 mt-3">
          <div className="text-sm">
            <span className="text-gold-400 font-mono font-bold">{totalDiscovered}</span>
            <span className="text-white/30"> / {totalInGame} discovered</span>
          </div>
          <div className="flex-1 h-1.5 bg-void-800 rounded-full overflow-hidden max-w-xs">
            <div
              className="h-full bg-gold-500 rounded-full transition-all duration-500"
              style={{ width: `${totalInGame > 0 ? (totalDiscovered / totalInGame) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search discovered…"
            className="pl-8 pr-4 py-1.5 rounded-xl bg-void-800 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold-500/40 w-44"
          />
        </div>

        {/* Verse filter */}
        <div className="flex gap-1 flex-wrap">
          {VERSE_OPTIONS.map(v => (
            <button
              key={v.value}
              onClick={() => setVerseFilter(v.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                verseFilter === v.value
                  ? 'bg-gold-500/15 text-gold-400 border-gold-500/30'
                  : 'bg-void-800 text-white/50 border-white/8 hover:text-white',
              )}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Show locked toggle */}
        <button
          onClick={() => setShowLocked(s => !s)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors',
            showLocked
              ? 'bg-void-700 text-white/60 border-white/20'
              : 'bg-void-800 text-white/30 border-white/8 hover:text-white/60',
          )}
        >
          <Lock size={11} />
          {showLocked ? 'Locked shown' : 'Locked hidden'}
        </button>

        {/* Sort */}
        <button
          onClick={() => toggleSort('power_level')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-void-800 border border-white/8 text-white/50 hover:text-white transition-colors ml-auto"
        >
          <ArrowUpDown size={11} />
          Power {sortKey === 'power_level' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
        </button>
      </div>

      {/* Grid — sm cards on mobile, md cards on md+ */}
      {loading ? (
        <div className="text-center py-20 text-white/30">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Lock size={40} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm">No results found.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {filtered.map((char, i) => {
            const isDiscovered = discoveredSlugs.includes(char.slug)
            return (
              <motion.div
                key={char.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i, 24) * 0.02 }}
                className={cn(isDiscovered ? 'cursor-pointer' : 'cursor-default')}
                onClick={() => isDiscovered && setSelected(char)}
              >
                {/* sm card below md breakpoint */}
                <div className="md:hidden">
                  <PlayingCard character={char} size="sm" locked={!isDiscovered} animate={false} />
                </div>
                {/* md card at md and above */}
                <div className="hidden md:block">
                  <PlayingCard character={char} size="md" locked={!isDiscovered} animate={false} />
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Detail modal — wide two-column layout */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        className="max-w-2xl"
      >
        {selected && <CharacterDetail character={selected} />}
      </Modal>
    </div>
  )
}

const VERSE_LABEL: Record<string, string> = {
  one_piece: 'One Piece',
  naruto:    'Naruto',
  dbz:       'Dragon Ball',
  hxh:       'Hunter × Hunter',
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1.5">
      {children}
    </p>
  )
}

function CharacterDetail({ character }: { character: Character }) {
  const accent      = VERSE_ACCENT[character.verse] ?? 'text-gold-400'
  const verseLabel  = VERSE_LABEL[character.verse] ?? character.verse

  return (
    /* Mobile: stacked; md+: card on left, scrollable details on right */
    <div className="flex flex-col md:flex-row gap-5 md:gap-6">

      {/* ── Left column: large card ── */}
      <div className="flex justify-center md:justify-start shrink-0">
        <PlayingCard character={character} size="lg" animate={false} />
      </div>

      {/* ── Right column: details (scrolls if needed on both breakpoints) ── */}
      <div className="flex-1 min-w-0 overflow-y-auto max-h-[60vh] md:max-h-[55vh] space-y-4 pb-1 pr-1"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
      >

        {/* Name + verse */}
        <div>
          <h2 className="text-xl font-black text-white leading-tight">{character.name}</h2>
          <p className={cn('text-xs font-semibold uppercase tracking-widest mt-0.5', accent)}>
            {verseLabel} · {character.arc_version}
          </p>
        </div>

        {/* Description */}
        {character.short_description && (
          <p className="text-white/50 text-sm leading-relaxed border-l-2 border-white/10 pl-3">
            {character.short_description}
          </p>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl bg-void-900/80 border border-white/5">
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Power Level</p>
            <p className={cn('font-mono font-black text-lg leading-none', accent)}>
              {formatPowerLevel(character.power_level)}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-void-900/80 border border-white/5">
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Martial Ratio</p>
            <p className="font-mono font-black text-lg leading-none text-white">
              {Math.round(character.martial_ratio * 100)}%
            </p>
          </div>
        </div>

        {/* Ability types */}
        {character.power_tags.length > 0 && (
          <div>
            <SectionTitle>Ability Types</SectionTitle>
            <div className="flex flex-wrap gap-1">
              {character.power_tags.map(tag => (
                <PowerTagBadge key={tag} label={tag.replace(/_/g, ' ')} />
              ))}
            </div>
          </div>
        )}

        {/* Strengths */}
        {character.strengths.length > 0 && (
          <div>
            <SectionTitle>Strengths</SectionTitle>
            <div className="space-y-1">
              {character.strengths.map(s => (
                <div key={s.tag} className="flex items-center justify-between text-xs py-0.5">
                  <span className="text-green-400 capitalize font-medium">{s.tag.replace(/_/g, ' ')}</span>
                  <span className="text-white/35 font-mono tabular-nums">
                    {Math.round(s.coefficient * 100)}% nullify
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weaknesses */}
        {character.weaknesses.length > 0 && (
          <div>
            <SectionTitle>Weaknesses</SectionTitle>
            <div className="space-y-1">
              {character.weaknesses.map(w => (
                <div key={w.tag} className="text-xs py-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-red-400 capitalize font-medium">{w.tag.replace(/_/g, ' ')}</span>
                    <span className="text-white/35 font-mono tabular-nums">
                      +{Math.round(w.coefficient * 100)}% dmg taken
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cannot win against */}
        {character.cannot_win_against.length > 0 && (
          <div>
            <SectionTitle>Cannot Win Against</SectionTitle>
            <div className="flex flex-wrap gap-1">
              {character.cannot_win_against.map(slug => (
                <span key={slug}
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-crimson-600/15 text-crimson-400 border border-crimson-600/25 capitalize">
                  {slug.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Draw conditions */}
        {character.draw_conditions.length > 0 && (
          <div>
            <SectionTitle>Always Draws Against</SectionTitle>
            <div className="flex flex-wrap gap-1">
              {character.draw_conditions.map(d => (
                <span key={d.character_slug}
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-pink-500/15 text-pink-400 border border-pink-500/25 capitalize">
                  ♥ {d.character_slug.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
