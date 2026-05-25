'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Crown, TrendingUp, Swords } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { formatElo } from '@/lib/utils/format'
import { getEloTier, ELO_TIER_COLORS, ELO_TIER_LABELS } from '@/types/user'
import { cn } from '@/lib/utils/cn'

interface LeaderboardRow {
  rank:         number
  id:           string
  username:     string
  elo:          number
  games_played: number
  games_won:    number
  games_lost:   number
}

const MEDAL_COLORS = ['text-gold-400', 'text-slate-300', 'text-amber-600']
const MEDAL_BG     = ['bg-gold-500/10 border-gold-500/20', 'bg-slate-400/10 border-slate-400/20', 'bg-amber-600/10 border-amber-700/20']

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [rows, setRows]     = useState<LeaderboardRow[]>([])
  const [loading, setLoading] = useState(true)
  const [myRank, setMyRank] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, elo, games_played, games_won, games_lost')
        .order('elo', { ascending: false })
        .limit(100)

      if (error || !data) { setLoading(false); return }

      const ranked = data.map((p, i) => ({
        rank:         i + 1,
        id:           p.id as string,
        username:     p.username as string,
        elo:          p.elo as number,
        games_played: p.games_played as number,
        games_won:    p.games_won as number,
        games_lost:   p.games_lost as number,
      }))

      setRows(ranked)

      if (user) {
        const myRow = ranked.find(r => r.id === user.id)
        if (myRow) setMyRank(myRow.rank)
        else {
          // User is outside top 100 — fetch their rank
          const { count } = await supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .gt('elo', ranked[ranked.length - 1]?.elo ?? 0)
          setMyRank((count ?? 0) + 1)
        }
      }

      setLoading(false)
    }
    load()
  }, [user?.id])

  const winRate = (row: LeaderboardRow) =>
    row.games_played > 0 ? Math.round((row.games_won / row.games_played) * 100) : 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold-glow">
            <Trophy size={22} className="text-void-950" />
          </div>
        </div>
        <h1 className="text-3xl font-black text-white mb-1">Leaderboard</h1>
        <p className="text-white/40 text-sm">Top 100 ranked players</p>

        {user && myRank !== null && !rows.find(r => r.id === user.id) && (
          <p className="text-white/30 text-xs mt-2">
            Your rank: <span className="text-gold-400 font-bold">#{myRank}</span>
          </p>
        )}
      </div>

      {/* Top-3 podium */}
      {!loading && rows.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 0, 2].map(idx => {
            const row  = rows[idx]
            const tier = getEloTier(row.elo)
            const color = ELO_TIER_COLORS[tier]
            const medalIdx = idx === 0 ? 1 : idx === 1 ? 0 : 2
            return (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: idx === 0 ? 12 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: medalIdx * 0.08 }}
                className={cn(
                  'flex flex-col items-center p-3 rounded-2xl border text-center',
                  MEDAL_BG[medalIdx],
                  user?.id === row.id && 'ring-1 ring-gold-500/40',
                  idx === 0 && 'order-2',
                  idx === 1 && 'order-1 mt-4',
                  idx === 2 && 'order-3 mt-4',
                )}
              >
                <span className={cn('text-2xl font-black mb-1', MEDAL_COLORS[medalIdx])}>
                  {medalIdx === 0 ? '🥇' : medalIdx === 1 ? '🥈' : '🥉'}
                </span>
                <p className="font-bold text-white text-sm truncate w-full">{row.username}</p>
                <p className="font-mono font-black text-lg mt-0.5" style={{ color }}>
                  {formatElo(row.elo)}
                </p>
                <p className="text-white/30 text-[10px] mt-0.5 uppercase tracking-wider">
                  {ELO_TIER_LABELS[tier]}
                </p>
                <p className="text-white/25 text-[10px] mt-1">
                  {winRate(row)}% WR · {row.games_played}G
                </p>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-white/8 bg-void-900/60 overflow-hidden">

        {/* Column headers */}
        <div className="grid grid-cols-[2.5rem_1fr_6rem_5rem_5rem] gap-2 px-4 py-2.5 border-b border-white/5 text-[10px] text-white/25 uppercase tracking-widest">
          <span>#</span>
          <span>Player</span>
          <span className="text-right">ELO</span>
          <span className="text-right hidden sm:block">W/L</span>
          <span className="text-right">Win %</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-white/30 text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center text-white/30 text-sm">
            No ranked games played yet. Be the first!
          </div>
        ) : (
          <div className="divide-y divide-white/4">
            {rows.map((row, i) => {
              const tier     = getEloTier(row.elo)
              const color    = ELO_TIER_COLORS[tier]
              const isMe     = user?.id === row.id
              const isTop3   = row.rank <= 3
              const wr       = winRate(row)

              return (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i, 30) * 0.012 }}
                  className={cn(
                    'grid grid-cols-[2.5rem_1fr_6rem_5rem_5rem] gap-2 items-center px-4 py-3 transition-colors',
                    isMe
                      ? 'bg-gold-500/8 border-l-2 border-l-gold-500'
                      : 'hover:bg-white/3',
                  )}
                >
                  {/* Rank */}
                  <div className={cn(
                    'text-sm font-bold tabular-nums',
                    isTop3
                      ? MEDAL_COLORS[row.rank - 1]
                      : isMe ? 'text-gold-400' : 'text-white/25',
                  )}>
                    {isTop3 ? (
                      row.rank === 1 ? <Crown size={15} className="text-gold-400" />
                      : row.rank === 2 ? <Crown size={15} className="text-slate-300" />
                      : <Crown size={15} className="text-amber-600" />
                    ) : (
                      <span className="font-mono">{row.rank}</span>
                    )}
                  </div>

                  {/* Username + tier */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: color, boxShadow: `0 0 5px ${color}60` }}
                    />
                    <span className={cn(
                      'text-sm font-semibold truncate',
                      isMe ? 'text-gold-300' : 'text-white',
                    )}>
                      {row.username}
                      {isMe && <span className="text-gold-500/60 font-normal text-xs ml-1">(you)</span>}
                    </span>
                    <span className="text-[10px] text-white/25 hidden lg:block shrink-0">
                      {ELO_TIER_LABELS[tier]}
                    </span>
                  </div>

                  {/* ELO */}
                  <div className="text-right">
                    <span className="font-mono font-black text-sm" style={{ color }}>
                      {formatElo(row.elo)}
                    </span>
                  </div>

                  {/* W/L */}
                  <div className="text-right hidden sm:block">
                    <span className="text-xs text-white/40 tabular-nums">
                      <span className="text-green-400">{row.games_won}</span>
                      <span className="text-white/20">W </span>
                      <span className="text-crimson-400">{row.games_lost}</span>
                      <span className="text-white/20">L</span>
                    </span>
                  </div>

                  {/* Win rate */}
                  <div className="text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className={cn(
                        'text-xs font-mono font-semibold',
                        wr >= 60 ? 'text-green-400'
                        : wr >= 45 ? 'text-white/60'
                        : 'text-crimson-400',
                      )}>
                        {wr}%
                      </span>
                      {row.games_played > 0 && (
                        <div className="w-12 h-1 bg-void-800 rounded-full overflow-hidden">
                          <div
                            className={cn('h-full rounded-full', wr >= 60 ? 'bg-green-500' : wr >= 45 ? 'bg-white/30' : 'bg-crimson-500')}
                            style={{ width: `${wr}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* My rank if outside top 100 */}
        {!loading && user && myRank !== null && myRank > 100 && (
          <div className="border-t border-dashed border-white/10 px-4 py-3 text-center">
            <span className="text-white/30 text-xs">
              Your rank: <span className="text-gold-400 font-bold">#{myRank}</span> — play more ranked games to climb!
            </span>
          </div>
        )}
      </div>

      {/* Footer hint */}
      {!loading && rows.length > 0 && (
        <div className="mt-4 flex items-center justify-center gap-1.5 text-white/20 text-xs">
          <Swords size={11} />
          <span>Play ranked matches to change your rating</span>
        </div>
      )}
    </div>
  )
}
