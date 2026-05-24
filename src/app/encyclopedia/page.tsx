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
      const supabase = createClient()
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('power_level', { ascending: false })
      if (!error && data) setCharacters(data as unknown as Character[])
      setLoading(false)
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

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-white/30">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Lock size={40} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm">No results found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {filtered.map((char, i) => {
            const isDiscovered = discoveredSlugs.includes(char.slug)
            return (
              <motion.div
                key={char.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i, 24) * 0.02 }}
                className={cn('cursor-pointer', !isDiscovered && 'cursor-default')}
                onClick={() => isDiscovered && setSelected(char)}
              >
                <PlayingCard
                  character={char}
                  size="sm"
                  locked={!isDiscovered}
                  animate={false}
                />
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        className="max-w-lg"
      >
        {selected && <CharacterDetail character={selected} />}
      </Modal>
    </div>
  )
}

function CharacterDetail({ character }: { character: Character }) {
  const accent = VERSE_ACCENT[character.verse] ?? 'text-gold-400'

  return (
    <div className="space-y-4">
      <p className={cn('text-sm font-semibold uppercase tracking-wide', accent)}>
        {character.verse.replace('_', ' ')} · {character.arc_version}
      </p>
      {character.short_description && (
        <p className="text-white/60 text-sm leading-relaxed">{character.short_description}</p>
      )}

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="p-3 rounded-xl bg-void-900">
          <p className="text-white/30 text-xs mb-1">Power Level</p>
          <p className={cn('font-mono font-bold', accent)}>{formatPowerLevel(character.power_level)}</p>
        </div>
        <div className="p-3 rounded-xl bg-void-900">
          <p className="text-white/30 text-xs mb-1">Martial Ratio</p>
          <p className="font-mono font-bold text-white">{Math.round(character.martial_ratio * 100)}%</p>
        </div>
      </div>

      {character.power_tags.length > 0 && (
        <div>
          <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Ability Types</p>
          <div className="flex flex-wrap gap-1">
            {character.power_tags.map(tag => (
              <PowerTagBadge key={tag} label={tag.replace(/_/g, ' ')} />
            ))}
          </div>
        </div>
      )}

      {character.strengths.length > 0 && (
        <div>
          <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Strengths</p>
          <div className="space-y-1">
            {character.strengths.map(s => (
              <div key={s.tag} className="flex items-center justify-between text-xs">
                <span className="text-green-400 capitalize">{s.tag.replace(/_/g, ' ')}</span>
                <span className="text-white/40 font-mono">{Math.round(s.coefficient * 100)}% nullify</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {character.weaknesses.length > 0 && (
        <div>
          <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Weaknesses</p>
          <div className="space-y-1">
            {character.weaknesses.map(w => (
              <div key={w.tag} className="text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-red-400 capitalize">{w.tag.replace(/_/g, ' ')}</span>
                  <span className="text-white/40 font-mono">+{Math.round(w.coefficient * 100)}% dmg taken</span>
                </div>
                {w.description && (
                  <p className="text-white/30 mt-0.5 pl-2 border-l border-white/10">{w.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {character.draw_conditions.length > 0 && (
        <div>
          <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Special Conditions</p>
          {character.draw_conditions.map(d => (
            <div key={d.character_slug} className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 font-medium">
                ♥ Draw vs {d.character_slug.replace(/_/g, ' ')}
              </span>
              <span className="text-white/30">{d.reason}</span>
            </div>
          ))}
        </div>
      )}

      {character.cannot_win_against.length > 0 && (
        <div>
          <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Cannot Win Against</p>
          <div className="flex flex-wrap gap-1">
            {character.cannot_win_against.map(slug => (
              <span key={slug} className="px-2 py-0.5 rounded-full text-xs bg-crimson-600/20 text-crimson-400 border border-crimson-600/30">
                {slug.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
