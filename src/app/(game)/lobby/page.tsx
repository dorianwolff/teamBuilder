'use client'

import { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Swords, Users, Trophy, Loader2, Copy, Check, Lock, Bot } from 'lucide-react'
import { nanoid } from 'nanoid'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { formatEloDelta, formatElo } from '@/lib/utils/format'
import { getEloTier, ELO_TIER_COLORS } from '@/types/user'
import { previewEloDelta } from '@/lib/game/elo'
import type { Verse } from '@/types/character'
import type { GameMode } from '@/types/game'
import { cn } from '@/lib/utils/cn'

type LobbyMode = GameMode | 'solo'
type Channel = ReturnType<ReturnType<typeof createClient>['channel']>

const VERSES: { value: Verse | 'all'; label: string; color: string; minElo: number }[] = [
  { value: 'one_piece', label: 'One Piece',       color: 'text-orange-400',  minElo: 0    },
  { value: 'naruto',    label: 'Naruto',           color: 'text-amber-400',   minElo: 0    },
  { value: 'dbz',       label: 'Dragon Ball',      color: 'text-purple-400',  minElo: 1200 },
  { value: 'hxh',       label: 'Hunter x Hunter',  color: 'text-emerald-400', minElo: 1400 },
  { value: 'all',       label: 'All Verses',        color: 'text-blue-400',    minElo: 1600 },
]

function LobbyContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const { user, profile } = useAuth()

  // ── Single Supabase client for the whole lobby page ──────────────────────────
  // Creating a new client per action was spawning multiple auth subscriptions,
  // causing the repeated SIGNED_IN events seen in the console.
  const supabase = useMemo(() => createClient(), [])

  // Track the active Realtime channel so we can unsubscribe on cancel / unmount
  const channelRef = useRef<Channel | null>(null)

  useEffect(() => {
    return () => {
      channelRef.current?.unsubscribe()
      channelRef.current = null
    }
  }, [supabase])

  const defaultMode = (searchParams.get('mode') as LobbyMode) ?? 'ranked'
  const [mode, setMode]               = useState<LobbyMode>(defaultMode)
  const [verse, setVerse]             = useState<Verse | 'all'>('one_piece')
  const [isSearching, setIsSearching] = useState(false)
  const [casualOpen, setCasualOpen]   = useState(false)
  const [joinCode, setJoinCode]       = useState('')
  const [roomCode, setRoomCode]       = useState<string | null>(null)
  const [copied, setCopied]           = useState(false)

  const elo = profile?.elo ?? 1000

  // Helper: guard actions that require authentication
  function requireAuth(): boolean {
    if (!user) {
      router.push('/register')
      return false
    }
    if (!profile) {
      toast.error('Profile still loading — try again in a moment')
      return false
    }
    return true
  }

  function clearChannel() {
    channelRef.current?.unsubscribe()
    channelRef.current = null
  }

  // ── Ranked matchmaking ───────────────────────────────────────────────────────

  async function handleRankedSearch() {
    if (!requireAuth()) return
    setIsSearching(true)

    const { error } = await supabase.from('matchmaking_queue').upsert(
      { user_id: user!.id, elo: profile!.elo, verse, status: 'waiting' },
      { onConflict: 'user_id,status' },
    )

    if (error) {
      toast.error('Could not join matchmaking: ' + error.message)
      setIsSearching(false)
      return
    }

    clearChannel()
    channelRef.current = supabase
      .channel(`mm:${user!.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'matchmaking_queue', filter: `user_id=eq.${user!.id}` },
        (payload: { new: { status: string } }) => {
          if (payload.new.status === 'matched') {
            supabase
              .from('game_rooms')
              .select('id')
              .or(`player_a_id.eq.${user!.id},player_b_id.eq.${user!.id}`)
              .eq('status', 'drafting')
              .order('created_at', { ascending: false })
              .limit(1)
              .single()
              .then(({ data }) => { if (data) router.push(`/draft/${data.id}`) })
          }
        },
      )
      .subscribe()
  }

  async function cancelSearch() {
    if (!user) return
    setIsSearching(false)
    clearChannel()
    await supabase
      .from('matchmaking_queue')
      .update({ status: 'cancelled' })
      .eq('user_id', user.id)
      .eq('status', 'waiting')
  }

  // ── Casual room ──────────────────────────────────────────────────────────────

  async function createCasualRoom() {
    if (!requireAuth()) return

    // nanoid can produce _ and - characters; toUpperCase() keeps them
    const code = nanoid(6).toUpperCase().replace(/[^A-Z0-9]/g, 'X')
    const { data, error } = await supabase
      .from('game_rooms')
      .insert({ code, mode: 'casual', verse, status: 'waiting', player_a_id: user!.id })
      .select('id, code')
      .single()

    if (error || !data) {
      toast.error('Failed to create room: ' + (error?.message ?? 'unknown error'))
      return
    }

    setRoomCode(data.code)
    setCasualOpen(true)

    clearChannel()
    channelRef.current = supabase
      .channel(`room-wait:${data.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'game_rooms', filter: `id=eq.${data.id}` },
        (payload: { new: { status: string; player_b_id: string | null } }) => {
          if (payload.new.player_b_id && payload.new.status === 'drafting') {
            setCasualOpen(false)
            router.push(`/draft/${data.id}`)
          }
        },
      )
      .subscribe()
  }

  async function joinCasualRoom() {
    if (!requireAuth()) return

    const code = joinCode.trim().toUpperCase()
    if (code.length < 4) { toast.error('Enter a valid room code'); return }

    // Use maybeSingle() — returns null instead of 406 when no rows match
    const { data: room, error: findErr } = await supabase
      .from('game_rooms')
      .select('*')
      .eq('code', code)
      .eq('status', 'waiting')
      .maybeSingle()

    if (findErr) { toast.error('Error finding room: ' + findErr.message); return }
    if (!room)   { toast.error('Room not found or already started'); return }
    if (room.player_a_id === user!.id) { toast.error("You can't join your own room"); return }

    const { error: joinErr } = await supabase
      .from('game_rooms')
      .update({ player_b_id: user!.id, status: 'drafting', started_at: new Date().toISOString() })
      .eq('id', room.id)

    if (joinErr) { toast.error('Failed to join room: ' + joinErr.message); return }
    router.push(`/draft/${room.id}`)
  }

  function copyCode() {
    if (!roomCode) return
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tier  = getEloTier(elo)
  const color = ELO_TIER_COLORS[tier]
  const delta = profile ? previewEloDelta(profile.elo, profile.elo, profile.games_played) : null

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-1">Lobby</h1>
      <p className="text-white/40 text-sm mb-6">Choose a mode and start your match</p>

      {/* ELO bar */}
      {profile && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-void-800 border border-white/8 mb-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
            <Trophy size={18} style={{ color }} />
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold truncate">{profile.username}</p>
            <p className="text-xs text-white/40">{profile.games_played} games · {profile.games_won}W {profile.games_lost}L</p>
          </div>
          <div className="ml-auto text-right shrink-0">
            <p className="font-mono font-bold text-lg" style={{ color }}>{formatElo(profile.elo)}</p>
            <p className="text-xs text-white/40 capitalize">{tier}</p>
          </div>
        </div>
      )}

      {/* Not logged in — prompt */}
      {!user && (
        <div className="p-4 rounded-xl bg-void-800 border border-white/8 mb-6 flex items-center justify-between gap-4">
          <p className="text-white/60 text-sm">Sign in to play ranked or casual matches.</p>
          <Button variant="gold" onClick={() => router.push('/register')}>Sign In</Button>
        </div>
      )}

      {/* Mode tabs */}
      <div className="flex gap-2 mb-6">
        {(['ranked', 'casual', 'solo'] as LobbyMode[]).map(m => {
          const icons  = { ranked: '🏆', casual: '👥', solo: '🤖' }
          const labels = { ranked: 'Ranked', casual: 'Casual', solo: 'Solo' }
          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors',
                mode === m
                  ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
                  : 'bg-void-800 text-white/50 border border-white/8 hover:text-white',
              )}
            >
              {icons[m]} {labels[m]}
            </button>
          )
        })}
      </div>

      {/* Solo mode */}
      {mode === 'solo' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
          <div className="p-4 rounded-xl bg-void-800 border border-white/8 text-sm text-white/50 leading-relaxed">
            Draft characters and battle the AI — no opponent needed.
            Perfect for learning the mechanics or testing team strategies.
          </div>
          <Button variant="gold" size="lg" fullWidth onClick={() => router.push('/solo')}>
            <Bot size={18} /> Start Solo Game
          </Button>
        </motion.div>
      )}

      {/* Verse selection (ranked + casual) */}
      {mode !== 'solo' && (
        <>
          <div className="mb-5">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Verse</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {VERSES.map(v => {
                const locked = elo < v.minElo && mode === 'ranked'
                const active = verse === v.value
                return (
                  <button
                    key={v.value}
                    onClick={() => !locked && setVerse(v.value)}
                    disabled={locked}
                    className={cn(
                      'flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors border',
                      active ? `border-current bg-current/10 ${v.color}` : 'border-white/8 text-white/50 hover:border-white/20 hover:text-white',
                      locked && 'opacity-40 cursor-not-allowed',
                    )}
                  >
                    <span>{v.label}</span>
                    {locked && (
                      <span className="flex items-center gap-1 text-[10px] text-white/30">
                        <Lock size={10} /> {v.minElo}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ELO preview */}
          {mode === 'ranked' && delta && (
            <div className="flex gap-3 mb-5 text-sm text-center">
              <div className="flex-1 py-2 rounded-xl bg-void-800 border border-white/8">
                <div className="text-green-400 font-mono font-bold">{formatEloDelta(delta.if_win)}</div>
                <div className="text-white/30 text-xs mt-0.5">If you win</div>
              </div>
              <div className="flex-1 py-2 rounded-xl bg-void-800 border border-white/8">
                <div className="text-red-400 font-mono font-bold">{formatEloDelta(delta.if_loss)}</div>
                <div className="text-white/30 text-xs mt-0.5">If you lose</div>
              </div>
            </div>
          )}

          {/* Ranked note about matchmaking */}
          {mode === 'ranked' && !isSearching && (
            <div className="mb-4 p-3 rounded-xl bg-void-800/50 border border-white/5 text-xs text-white/30 leading-relaxed">
              ⚠️ Ranked matchmaking requires a second player in the queue. For testing, use <strong className="text-white/50">Casual</strong> mode with a friend.
            </div>
          )}

          {/* Actions */}
          {mode === 'ranked' ? (
            isSearching ? (
              <div className="text-center py-8">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Loader2 size={20} className="animate-spin text-gold-400" />
                  <span className="text-white font-medium">Searching for opponent…</span>
                </div>
                <p className="text-sm text-white/40 mb-4">ELO range expanding every 30 seconds</p>
                <Button variant="ghost" onClick={cancelSearch}>Cancel</Button>
              </div>
            ) : (
              <Button variant="gold" size="lg" fullWidth onClick={handleRankedSearch}>
                <Swords size={18} /> Find Match
              </Button>
            )
          ) : (
            <div className="flex flex-col gap-3">
              <Button variant="gold" size="lg" fullWidth onClick={createCasualRoom}>
                <Users size={18} /> Create Private Room
              </Button>
              <div className="flex gap-2">
                <input
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Room code (6 chars)"
                  maxLength={6}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-void-800 border border-white/10 text-white text-sm font-mono placeholder:text-white/30 focus:outline-none focus:border-gold-500/40"
                />
                <Button onClick={joinCasualRoom}>Join</Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Casual room modal */}
      <Modal open={casualOpen} onClose={() => { setCasualOpen(false); clearChannel() }} title="Room Created">
        <div className="text-center py-4">
          <p className="text-white/50 text-sm mb-4">Share this code with your friend</p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-4xl font-black font-mono tracking-widest text-gold-400">{roomCode}</span>
            <button onClick={copyCode} className="p-2 rounded-lg bg-void-900 border border-white/10 text-white/50 hover:text-white transition-colors">
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
            <Loader2 size={14} className="animate-spin" />
            Waiting for opponent…
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default function LobbyPage() {
  return (
    <Suspense>
      <LobbyContent />
    </Suspense>
  )
}
