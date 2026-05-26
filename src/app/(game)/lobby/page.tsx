'use client'

import { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Swords, Users, Trophy, Loader2, Lock, Bot, Globe, Shield,
  Plus, Search, ChevronRight, Check, X, ArrowLeft, RefreshCw,
  Clock, Shuffle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { formatEloDelta, formatElo } from '@/lib/utils/format'
import { getEloTier, ELO_TIER_COLORS } from '@/types/user'
import { previewEloDelta } from '@/lib/game/elo'
import { buildInitialDraftState } from '@/lib/game/draft'
import type { Verse } from '@/types/character'
import type { Character } from '@/types/character'
import { cn } from '@/lib/utils/cn'

// ─── Constants ───────────────────────────────────────────────────────────────

type LobbyTab   = 'ranked' | 'rooms' | 'solo'
type RoomsView  = 'browse' | 'create' | 'wait_creator' | 'wait_requester'
type TypeFilter = 'all' | 'public' | 'private'

const VERSES: { value: Verse | 'all'; label: string; color: string; minElo: number }[] = [
  { value: 'one_piece', label: 'One Piece',       color: 'text-orange-400',  minElo: 0    },
  { value: 'naruto',    label: 'Naruto',           color: 'text-amber-400',   minElo: 0    },
  { value: 'dbz',       label: 'Dragon Ball Z',    color: 'text-purple-400',  minElo: 1200 },
  { value: 'hxh',       label: 'Hunter × Hunter',  color: 'text-emerald-400', minElo: 1400 },
  { value: 'all',       label: 'All Verses',       color: 'text-blue-400',    minElo: 1600 },
]

const VERSE_LABEL: Record<string, string> = {
  one_piece: 'One Piece', naruto: 'Naruto', dbz: 'Dragon Ball Z',
  hxh: 'Hunter × Hunter', all: 'All Verses',
}
const VERSE_COLOR: Record<string, string> = {
  one_piece: 'text-orange-400', naruto: 'text-amber-400',
  dbz: 'text-purple-400', hxh: 'text-emerald-400', all: 'text-blue-400',
}

interface RoomItem {
  id:          string
  name:        string | null
  verse:       string
  is_public:   boolean
  created_at:  string
  player_a_id: string
  player_a:    { username: string } | null
}

interface JoinRequest {
  id:         string
  user_id:    string
  username:   string
  status:     'pending' | 'approved' | 'rejected'
  created_at: string
}

// ─── Supabase helpers ─────────────────────────────────────────────────────────

type Supa = ReturnType<typeof createClient>

async function loadCharsForVerse(supabase: Supa, verse: string): Promise<Character[]> {
  let q = supabase.from('characters').select('*')
  if (verse !== 'all') q = q.eq('verse', verse)
  const { data } = await q
  return (data ?? []) as Character[]
}

// ─── Main page ────────────────────────────────────────────────────────────────

function LobbyContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const { user, profile } = useAuth()

  const supabase = useMemo(() => createClient(), [])

  // Keep a ref to the active realtime channel so we can unsubscribe cleanly
  const channelRef = useRef<ReturnType<Supa['channel']> | null>(null)

  useEffect(() => () => { channelRef.current?.unsubscribe() }, [])

  const defaultTab = (searchParams.get('mode') as LobbyTab) ?? 'ranked'
  const [tab, setTab] = useState<LobbyTab>(defaultTab)

  const elo  = profile?.elo ?? 1000
  const tier = getEloTier(elo)

  function requireAuth(): boolean {
    if (!user)    { router.push('/register?next=/lobby'); return false }
    if (!profile) { toast.error('Profile still loading — try again'); return false }
    return true
  }

  function clearChannel() {
    channelRef.current?.unsubscribe()
    channelRef.current = null
  }

  // ── Shared: initialize draft state + navigate ────────────────────────────────

  async function joinRoom(roomId: string, playerAId: string, playerBId: string, verse: string) {
    const chars = await loadCharsForVerse(supabase, verse)
    const draftState = buildInitialDraftState(
      roomId, playerAId, playerBId, verse as Verse | 'all', chars,
    )
    const { error } = await supabase
      .from('game_rooms')
      .update({
        player_b_id: playerBId,
        status:      'drafting',
        started_at:  new Date().toISOString(),
        draft_state: draftState,
      })
      .eq('id', roomId)
    if (error) throw error
  }

  // ── ELO bar ───────────────────────────────────────────────────────────────────

  const eloColor = ELO_TIER_COLORS[tier]
  const delta    = profile ? previewEloDelta(elo, elo, profile.games_played) : null

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* ELO bar */}
      {profile && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-void-800 border border-white/8 mb-6">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: `${eloColor}20`, border: `1px solid ${eloColor}40` }}
          >
            <Trophy size={18} style={{ color: eloColor }} />
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold truncate">{profile.username}</p>
            <p className="text-xs text-white/40">{profile.games_played} games · {profile.games_won}W {profile.games_lost}L</p>
          </div>
          <div className="ml-auto text-right shrink-0">
            <p className="font-mono font-bold text-lg" style={{ color: eloColor }}>{formatElo(elo)}</p>
            <p className="text-xs text-white/40 capitalize">{tier}</p>
          </div>
        </div>
      )}

      {!user && (
        <div className="p-4 rounded-xl bg-void-800 border border-white/8 mb-6 flex items-center justify-between gap-4">
          <p className="text-white/60 text-sm">Sign in to play ranked or casual matches.</p>
          <Button variant="gold" onClick={() => router.push('/register')}>Sign In</Button>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex gap-2 mb-6">
        {(['ranked', 'rooms', 'solo'] as LobbyTab[]).map(t => {
            const icons  = { ranked: <Swords size={14} />, rooms: <Users size={14} />, solo: <Bot size={14} /> }
          const labels = { ranked: 'Ranked', rooms: 'Rooms', solo: 'Solo' }
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-colors',
                tab === t
                  ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
                  : 'bg-void-800 text-white/50 border border-white/8 hover:text-white',
              )}
            >
              {icons[t]} {labels[t]}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === 'ranked' && (
          <motion.div key="ranked" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <RankedTab
              supabase={supabase}
              user={user}
              profile={profile}
              elo={elo}
              delta={delta}
              channelRef={channelRef}
              requireAuth={requireAuth}
              clearChannel={clearChannel}
              joinRoom={joinRoom}
              router={router}
            />
          </motion.div>
        )}
        {tab === 'rooms' && (
          <motion.div key="rooms" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <RoomsTab
              supabase={supabase}
              user={user}
              profile={profile}
              elo={elo}
              channelRef={channelRef}
              requireAuth={requireAuth}
              clearChannel={clearChannel}
              joinRoom={joinRoom}
              router={router}
            />
          </motion.div>
        )}
        {tab === 'solo' && (
          <motion.div key="solo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <SoloTab router={router} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Ranked Tab ───────────────────────────────────────────────────────────────

interface RankedTabProps {
  supabase:     ReturnType<typeof createClient>
  user:         ReturnType<typeof useAuth>['user']
  profile:      ReturnType<typeof useAuth>['profile']
  elo:          number
  delta:        { if_win: number; if_loss: number } | null
  channelRef:   React.MutableRefObject<ReturnType<ReturnType<typeof createClient>['channel']> | null>
  requireAuth:  () => boolean
  clearChannel: () => void
  joinRoom:     (roomId: string, aId: string, bId: string, verse: string) => Promise<void>
  router:       ReturnType<typeof useRouter>
}

function RankedTab({ supabase, user, profile, elo, delta, channelRef, requireAuth, clearChannel, joinRoom, router }: RankedTabProps) {
  const [isSearching, setIsSearching]   = useState(false)
  const [assignedVerse, setAssigned]    = useState<Verse | 'all' | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Clean up on unmount
  useEffect(() => () => {
    if (pollRef.current) clearInterval(pollRef.current)
    channelRef.current?.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function pickRandomVerse(): Verse | 'all' {
    const unlocked = VERSES.filter(v => elo >= v.minElo).map(v => v.value)
    return unlocked[Math.floor(Math.random() * unlocked.length)]!
  }

  async function startSearch() {
    if (!requireAuth()) return
    const verse = pickRandomVerse()
    setAssigned(verse)
    setIsSearching(true)

    // Remove ALL prior queue entries (including stale 'matched' rows) to avoid UNIQUE constraint 409
    await supabase.from('matchmaking_queue')
      .delete()
      .eq('user_id', user!.id)

    const { error } = await supabase.from('matchmaking_queue')
      .insert({ user_id: user!.id, elo, verse, status: 'waiting' })

    if (error) {
      toast.error('Could not join matchmaking: ' + error.message)
      setIsSearching(false)
      return
    }

    // ── Helper: wait for the room to be fully ready before navigating ────────
    // Player A writes draft_state + status='drafting' atomically.
    // Player B must NOT navigate until that update is visible — otherwise B
    // arrives at the draft page before the draft_state exists.
    async function waitForDraftReady(roomId: string) {
      // Immediate check — Player A may have already finished setting up
      const { data: existingRoom } = await supabase
        .from('game_rooms')
        .select('status')
        .eq('id', roomId)
        .single()

      if (existingRoom?.status === 'drafting') {
        clearChannel()
        router.push(`/draft/${roomId}`)
        return
      }

      // Subscribe to the room — navigate as soon as status becomes 'drafting'
      const waitCh = supabase
        .channel(`wait-draft:${roomId}:${user!.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'game_rooms', filter: `id=eq.${roomId}` },
          (pl: { new: { status: string } }) => {
            if (pl.new.status === 'drafting') {
              waitCh.unsubscribe()
              clearChannel()
              router.push(`/draft/${roomId}`)
            }
          },
        )
        .subscribe()

      // Safety timeout: navigate after 20 s to prevent infinite waiting
      // (Player A might have navigated already without the realtime firing)
      setTimeout(() => {
        waitCh.unsubscribe()
        if (isSearchingRef.current) {
          console.warn('[Ranked] Draft not confirmed ready after 20 s — navigating anyway')
          clearChannel()
          router.push(`/draft/${roomId}`)
        }
      }, 20_000)
    }

    // ── Realtime: detect when we're matched as Player B ──────────────────────
    // Don't navigate immediately — wait until Player A has written the draft.
    clearChannel()
    channelRef.current = supabase
      .channel(`mm:${user!.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'matchmaking_queue', filter: `user_id=eq.${user!.id}` },
        async (payload: { new: { status: string; room_id: string | null } }) => {
          if (payload.new.status === 'matched' && payload.new.room_id) {
            if (pollRef.current) clearInterval(pollRef.current)
            // Wait for the room's draft_state to be written before navigating
            await waitForDraftReady(payload.new.room_id)
          }
        },
      )
      .subscribe()

    // ── Polling: we try to FIND an opponent ourselves (Player A role) ─────────
    async function poll() {
      if (!isSearchingRef.current) return
      const { data: roomId, error: rpcErr } = await supabase.rpc('ranked_find_match', {
        p_user_id: user!.id,
        p_elo:     elo,
        p_verse:   verse,
      })
      if (rpcErr) {
        console.error('[Ranked] ranked_find_match error:', rpcErr.message)
        return
      }
      if (roomId) {
        if (pollRef.current) clearInterval(pollRef.current)
        isSearchingRef.current = false
        try {
          const { data: room, error: roomErr } = await supabase
            .from('game_rooms')
            .select('player_a_id, player_b_id, verse')
            .eq('id', roomId)
            .single()
          if (roomErr || !room || !room.player_b_id) {
            throw roomErr ?? new Error('Room or Player B not found')
          }
          const chars = await loadCharsForVerse(supabase, room.verse)
          const draft = buildInitialDraftState(
            roomId, room.player_a_id, room.player_b_id,
            room.verse as Verse | 'all', chars,
          )
          // Atomic update: write draft_state AND set status='drafting' in one call.
          // This is what Player B's waitForDraftReady subscription listens for.
          const { error: updateErr } = await supabase
            .from('game_rooms')
            .update({
              draft_state: draft,
              status:      'drafting',
              started_at:  new Date().toISOString(),
            })
            .eq('id', roomId)
          if (updateErr) throw updateErr

          clearChannel()
          router.push(`/draft/${roomId}`)
        } catch (err: unknown) {
          console.error('[Ranked] Match initialisation failed:', err)
          toast.error('Match setup failed — please try searching again')
          isSearchingRef.current = true  // allow retrying
          setIsSearching(false)
        }
      }
    }

    // Use a plain object ref so the interval closure reads the latest flag
    const isSearchingRef = { current: true }
    poll() // immediate first attempt
    pollRef.current = setInterval(poll, 5000)

    // Store for cleanup in cancelSearch
    ;(pollRef as unknown as { _stopRef?: { current: boolean } })._stopRef = isSearchingRef
  }

  async function cancelSearch() {
    setIsSearching(false)
    setAssigned(null)
    if (pollRef.current) clearInterval(pollRef.current)
    clearChannel()
    if (user) {
      await supabase.from('matchmaking_queue')
        .update({ status: 'cancelled' })
        .eq('user_id', user.id)
        .eq('status', 'waiting')
    }
  }

  const verseInfo = assignedVerse ? VERSES.find(v => v.value === assignedVerse) : null

  return (
    <div className="flex flex-col gap-4">
      {isSearching ? (
        <div className="text-center py-10">
          {/* Spinning icon */}
          <div className="relative inline-flex mb-5">
            <div className="w-16 h-16 rounded-full border-2 border-gold-500/30 flex items-center justify-center">
              <Swords size={28} className="text-gold-400" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-t-gold-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          </div>
          <p className="text-white font-semibold text-lg mb-1">Searching for opponent…</p>
          {verseInfo && (
            <p className={cn('text-sm font-medium mb-1', verseInfo.color)}>
              Verse: {verseInfo.label}
            </p>
          )}
          <p className="text-xs text-white/30 mb-6">ELO range expands every 30 seconds</p>
          <Button variant="ghost" onClick={cancelSearch}>Cancel</Button>
        </div>
      ) : (
        <>
          {/* Verse preview */}
          <div className="p-4 rounded-xl bg-void-800 border border-white/8">
            <div className="flex items-center gap-2 mb-3">
              <Shuffle size={14} className="text-white/40" />
              <p className="text-xs text-white/40 uppercase tracking-wider">Verse assignment</p>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              In ranked mode your verse is <span className="text-white font-medium">randomly assigned</span> from
              your unlocked pool. The more you play, the more verses you unlock.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {VERSES.map(v => {
                const locked = elo < v.minElo
                return (
                  <span
                    key={v.value}
                    className={cn(
                      'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border',
                      locked
                        ? 'opacity-35 border-white/8 text-white/30'
                        : `border-current/30 bg-current/10 ${v.color}`,
                    )}
                  >
                    {locked && <Lock size={10} />}
                    {v.label}
                    {locked && <span className="text-white/30">({v.minElo})</span>}
                  </span>
                )
              })}
            </div>
          </div>

          {/* ELO preview */}
          {delta && (
            <div className="flex gap-3 text-sm text-center">
              <div className="flex-1 py-3 rounded-xl bg-void-800 border border-white/8">
                <div className="text-green-400 font-mono font-bold">{formatEloDelta(delta.if_win)}</div>
                <div className="text-white/30 text-xs mt-0.5">If you win</div>
              </div>
              <div className="flex-1 py-3 rounded-xl bg-void-800 border border-white/8">
                <div className="text-red-400 font-mono font-bold">{formatEloDelta(delta.if_loss)}</div>
                <div className="text-white/30 text-xs mt-0.5">If you lose</div>
              </div>
            </div>
          )}

          <Button variant="gold" size="lg" fullWidth onClick={startSearch}>
            <Swords size={18} /> Find Ranked Match
          </Button>
        </>
      )}
    </div>
  )
}

// ─── Rooms Tab ────────────────────────────────────────────────────────────────

interface RoomsTabProps {
  supabase:     ReturnType<typeof createClient>
  user:         ReturnType<typeof useAuth>['user']
  profile:      ReturnType<typeof useAuth>['profile']
  elo:          number
  channelRef:   React.MutableRefObject<ReturnType<ReturnType<typeof createClient>['channel']> | null>
  requireAuth:  () => boolean
  clearChannel: () => void
  joinRoom:     (roomId: string, aId: string, bId: string, verse: string) => Promise<void>
  router:       ReturnType<typeof useRouter>
}

function RoomsTab({ supabase, user, profile, elo, channelRef, requireAuth, clearChannel, joinRoom, router }: RoomsTabProps) {
  const [view,           setView]           = useState<RoomsView>('browse')
  // ── Browse state
  const [rooms,          setRooms]          = useState<RoomItem[]>([])
  const [loadingRooms,   setLoadingRooms]   = useState(false)
  const [searchQuery,    setSearchQuery]    = useState('')
  const [typeFilter,     setTypeFilter]     = useState<TypeFilter>('all')
  // ── Create state
  const [roomName,       setRoomName]       = useState('')
  const [createVerse,    setCreateVerse]    = useState<Verse | 'all'>('one_piece')
  const [isPublic,       setIsPublic]       = useState(true)
  const [creating,       setCreating]       = useState(false)
  // ── Wait (creator) state
  const [waitRoom,       setWaitRoom]       = useState<{ id: string; name: string | null; verse: string; is_public: boolean; player_a_id: string } | null>(null)
  const [joinRequests,   setJoinRequests]   = useState<JoinRequest[]>([])
  const [approvingId,    setApprovingId]    = useState<string | null>(null)
  // ── Wait (requester) state
  const [pendingRoomId,  setPendingRoomId]  = useState<string | null>(null)

  const fetchRooms = useCallback(async () => {
    setLoadingRooms(true)
    const { data, error } = await supabase
      .from('game_rooms')
      .select('id, name, verse, is_public, created_at, player_a_id, player_a:profiles!player_a_id(username)')
      .eq('status', 'waiting')
      .eq('mode', 'casual')
      .order('created_at', { ascending: false })
      .limit(50)
    if (!error && data) setRooms(data as unknown as RoomItem[])
    setLoadingRooms(false)
  }, [supabase])

  useEffect(() => { fetchRooms() }, [fetchRooms])

  // ── Create room ──────────────────────────────────────────────────────────────

  async function handleCreate() {
    if (!requireAuth()) return
    if (!roomName.trim()) { toast.error('Enter a room name'); return }
    setCreating(true)

    try {
      const code = Math.random().toString(36).slice(2, 8).toUpperCase()
      const { data, error } = await supabase
        .from('game_rooms')
        .insert({
          code,
          mode:     'casual',
          verse:    createVerse,
          status:   'waiting',
          name:     roomName.trim(),
          is_public: isPublic,
          player_a_id: user!.id,
        })
        .select('id, name, verse, is_public, player_a_id')
        .single()

      if (error || !data) throw error ?? new Error('No data')

      setWaitRoom(data)
      setJoinRequests([])
      setView('wait_creator')

      // Subscribe to realtime events for this room
      clearChannel()
      if (isPublic) {
        // Public: watch for player_b joining
        channelRef.current = supabase
          .channel(`room-pub:${data.id}`)
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'game_rooms', filter: `id=eq.${data.id}` },
            (payload: { new: { status: string; player_b_id: string | null } }) => {
              if (payload.new.status === 'drafting' && payload.new.player_b_id) {
                router.push(`/draft/${data.id}`)
              }
            },
          )
          .subscribe()
      } else {
        // Private: watch for pending join requests
        channelRef.current = supabase
          .channel(`room-priv:${data.id}`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'room_join_requests', filter: `room_id=eq.${data.id}` },
            async () => {
              // Re-fetch all pending requests
              const { data: reqs } = await supabase
                .from('room_join_requests')
                .select('*')
                .eq('room_id', data.id)
                .eq('status', 'pending')
                .order('created_at')
              setJoinRequests((reqs ?? []) as JoinRequest[])
            },
          )
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'game_rooms', filter: `id=eq.${data.id}` },
            (payload: { new: { status: string } }) => {
              if (payload.new.status === 'drafting') {
                router.push(`/draft/${data.id}`)
              }
            },
          )
          .subscribe()
      }
    } catch (err: unknown) {
      toast.error('Failed to create room: ' + (err instanceof Error ? err.message : 'unknown'))
    } finally {
      setCreating(false)
    }
  }

  // ── Cancel waiting room ──────────────────────────────────────────────────────

  async function cancelRoom() {
    if (!waitRoom) return
    clearChannel()
    await supabase.from('game_rooms').update({ status: 'abandoned' }).eq('id', waitRoom.id)
    setWaitRoom(null)
    setView('browse')
    fetchRooms()
  }

  // ── Join a public room ───────────────────────────────────────────────────────

  async function handleJoinPublic(room: RoomItem) {
    if (!requireAuth()) return
    if (room.player_a_id === user!.id) {
      toast.error("You can't join your own room")
      return
    }
    try {
      await joinRoom(room.id, room.player_a_id, user!.id, room.verse)
      router.push(`/draft/${room.id}`)
    } catch (err: unknown) {
      toast.error('Failed to join room: ' + (err instanceof Error ? err.message : String(err)))
    }
  }

  // ── Request to join a private room ───────────────────────────────────────────

  async function handleRequestJoin(room: RoomItem) {
    if (!requireAuth()) return
    if (room.player_a_id === user!.id) {
      toast.error("You can't join your own room")
      return
    }
    const { error } = await supabase.from('room_join_requests').insert({
      room_id:  room.id,
      user_id:  user!.id,
      username: profile!.username,
      status:   'pending',
    })
    if (error) {
      if (error.code === '23505') toast.error('You already sent a request to this room')
      else toast.error('Failed to send request: ' + error.message)
      return
    }

    setPendingRoomId(room.id)
    setView('wait_requester')

    // Watch for approval / rejection
    clearChannel()
    channelRef.current = supabase
      .channel(`req:${room.id}:${user!.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE', schema: 'public', table: 'room_join_requests',
          filter: `room_id=eq.${room.id}`,
        },
        (payload: { new: { user_id: string; status: string } }) => {
          if (payload.new.user_id !== user!.id) return
          if (payload.new.status === 'approved') {
            toast.success('Your request was approved!')
            router.push(`/draft/${room.id}`)
          } else if (payload.new.status === 'rejected') {
            toast.error('Your request was rejected.')
            clearChannel()
            setPendingRoomId(null)
            setView('browse')
          }
        },
      )
      .subscribe()
  }

  // ── Approve a join request (private room creator) ─────────────────────────

  async function approveRequest(req: JoinRequest) {
    if (!waitRoom) return
    setApprovingId(req.id)
    try {
      // Reject all other pending requests first
      const others = joinRequests.filter(r => r.id !== req.id)
      for (const other of others) {
        await supabase
          .from('room_join_requests')
          .update({ status: 'rejected' })
          .eq('id', other.id)
      }

      // Build initial draft state
      const chars = await loadCharsForVerse(supabase, waitRoom.verse)
      const draft = buildInitialDraftState(
        waitRoom.id, user!.id, req.user_id, waitRoom.verse as Verse | 'all', chars,
      )

      // Update the room
      const { error } = await supabase.from('game_rooms').update({
        player_b_id: req.user_id,
        status:      'drafting',
        started_at:  new Date().toISOString(),
        draft_state: draft,
      }).eq('id', waitRoom.id)
      if (error) throw error

      // Mark request as approved (realtime notifies requester)
      await supabase.from('room_join_requests').update({ status: 'approved' }).eq('id', req.id)

      router.push(`/draft/${waitRoom.id}`)
    } catch (err: unknown) {
      toast.error('Failed to approve: ' + (err instanceof Error ? err.message : String(err)))
      setApprovingId(null)
    }
  }

  async function rejectRequest(req: JoinRequest) {
    await supabase.from('room_join_requests').update({ status: 'rejected' }).eq('id', req.id)
    setJoinRequests(prev => prev.filter(r => r.id !== req.id))
  }

  // ── Filtered rooms ────────────────────────────────────────────────────────────

  const filteredRooms = rooms.filter(r => {
    const matchesSearch = !searchQuery || (r.name ?? '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType =
      typeFilter === 'all' ||
      (typeFilter === 'public'  &&  r.is_public) ||
      (typeFilter === 'private' && !r.is_public)
    return matchesSearch && matchesType
  })

  // ─── Views ──────────────────────────────────────────────────────────────────

  // WAIT — Requester
  if (view === 'wait_requester') {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <div className="w-16 h-16 rounded-full bg-void-800 border border-white/10 flex items-center justify-center">
          <Clock size={28} className="text-gold-400" />
        </div>
        <div>
          <p className="text-white font-semibold text-lg mb-1">Request sent</p>
          <p className="text-white/40 text-sm">Waiting for the room creator to approve your request…</p>
        </div>
        <div className="flex items-center gap-2 text-white/30 text-sm">
          <Loader2 size={14} className="animate-spin" />
          Waiting for approval
        </div>
        <Button variant="ghost" onClick={() => {
          clearChannel()
          if (pendingRoomId) {
            supabase.from('room_join_requests')
              .delete()
              .eq('room_id', pendingRoomId)
              .eq('user_id', user!.id)
              .then(() => {})
          }
          setPendingRoomId(null)
          setView('browse')
        }}>
          <X size={14} /> Cancel request
        </Button>
      </div>
    )
  }

  // WAIT — Creator
  if (view === 'wait_creator' && waitRoom) {
    const verseInfo = VERSES.find(v => v.value === waitRoom.verse)
    return (
      <div className="flex flex-col gap-4">
        {/* Room info */}
        <div className="p-4 rounded-xl bg-void-800 border border-white/8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-white font-semibold text-lg">{waitRoom.name ?? 'My Room'}</p>
              <p className={cn('text-xs font-medium mt-0.5', verseInfo?.color ?? 'text-white/40')}>
                {VERSE_LABEL[waitRoom.verse] ?? waitRoom.verse}
              </p>
            </div>
            <span className={cn(
              'px-2.5 py-1 rounded-full text-[11px] font-semibold border',
              waitRoom.is_public
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-400 border-amber-500/30',
            )}>
              {waitRoom.is_public ? '🌐 Public' : '🔒 Private'}
            </span>
          </div>
        </div>

        {waitRoom.is_public ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Loader2 size={16} className="animate-spin text-gold-400" />
              <span>Waiting for a player to join…</span>
            </div>
            <p className="text-xs text-white/25">Your room is visible in the public list</p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-3">
              Join requests {joinRequests.length > 0 && `(${joinRequests.length})`}
            </p>
            {joinRequests.length === 0 ? (
              <div className="flex items-center gap-2 text-white/30 text-sm py-4">
                <Loader2 size={14} className="animate-spin" />
                No requests yet — waiting…
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {joinRequests.map(req => (
                  <div key={req.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-void-900 border border-white/8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-void-700 border border-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                        {req.username[0]?.toUpperCase()}
                      </div>
                      <p className="text-white text-sm font-medium">{req.username}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => rejectRequest(req)}
                        className="p-1.5 rounded-lg bg-crimson-600/15 text-crimson-400 border border-crimson-600/25 hover:bg-crimson-600/25 transition-colors"
                      >
                        <X size={14} />
                      </button>
                      <button
                        onClick={() => approveRequest(req)}
                        disabled={approvingId === req.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500/15 text-gold-400 border border-gold-500/30 hover:bg-gold-500/25 transition-colors text-xs font-medium disabled:opacity-50"
                      >
                        {approvingId === req.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <Button variant="ghost" onClick={cancelRoom} className="mt-1">
          <X size={14} /> Close room
        </Button>
      </div>
    )
  }

  // CREATE
  if (view === 'create') {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => setView('browse')} className="p-1.5 rounded-lg text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-white font-semibold">Create a Room</h2>
        </div>

        {/* Room name */}
        <div>
          <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Room name</label>
          <input
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
            placeholder="e.g. Garp vs Naruto"
            maxLength={40}
            className="w-full px-4 py-2.5 rounded-xl bg-void-800 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-gold-500/40"
          />
        </div>

        {/* Verse */}
        <div>
          <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Verse</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {VERSES.map(v => {
              const locked  = elo < v.minElo
              const active  = createVerse === v.value
              return (
                <button
                  key={v.value}
                  onClick={() => !locked && setCreateVerse(v.value)}
                  disabled={locked}
                  className={cn(
                    'flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors border',
                    active
                      ? `border-current bg-current/10 ${v.color}`
                      : 'border-white/8 text-white/50 hover:border-white/20 hover:text-white',
                    locked && 'opacity-40 cursor-not-allowed',
                  )}
                >
                  <span>{v.label}</span>
                  {locked && <Lock size={10} className="text-white/30" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Public / Private toggle */}
        <div>
          <label className="text-xs text-white/40 uppercase tracking-wider block mb-2">Visibility</label>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPublic(true)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm border transition-colors',
                isPublic
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-void-800 text-white/40 border-white/8 hover:text-white',
              )}
            >
              <Globe size={14} /> Public
            </button>
            <button
              onClick={() => setIsPublic(false)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm border transition-colors',
                !isPublic
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  : 'bg-void-800 text-white/40 border-white/8 hover:text-white',
              )}
            >
              <Shield size={14} /> Private
            </button>
          </div>
          <p className="text-xs text-white/30 mt-1.5">
            {isPublic
              ? 'Anyone can join instantly — no approval needed.'
              : 'You approve who enters — great for friend games.'}
          </p>
        </div>

        <Button variant="gold" size="lg" fullWidth onClick={handleCreate} loading={creating} className="mt-1">
          <Plus size={18} /> Create Room
        </Button>
      </div>
    )
  }

  // BROWSE (default)
  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search rooms…"
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-void-800 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold-500/40"
          />
        </div>
        {/* Refresh */}
        <button
          onClick={fetchRooms}
          className="p-2 rounded-xl bg-void-800 border border-white/10 text-white/40 hover:text-white transition-colors"
        >
          <RefreshCw size={14} className={loadingRooms ? 'animate-spin' : ''} />
        </button>
        {/* Create */}
        <Button variant="gold" onClick={() => { if (requireAuth()) setView('create') }}>
          <Plus size={14} /> New
        </Button>
      </div>

      {/* Type filter */}
      <div className="flex gap-1.5">
        {(['all', 'public', 'private'] as TypeFilter[]).map(f => (
          <button
            key={f}
            onClick={() => setTypeFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize',
              typeFilter === f
                ? 'bg-gold-500/15 text-gold-400 border-gold-500/30'
                : 'bg-void-800 text-white/40 border-white/8 hover:text-white',
            )}
          >
            {f === 'all' ? 'All rooms' : f === 'public' ? '🌐 Public' : '🔒 Private'}
          </button>
        ))}
      </div>

      {/* Room list */}
      {loadingRooms ? (
        <div className="flex items-center justify-center py-12 text-white/30">
          <Loader2 size={20} className="animate-spin mr-2" /> Loading rooms…
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="text-center py-12">
          <Users size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No open rooms found.</p>
          <p className="text-white/20 text-xs mt-1">Create one and invite a friend!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredRooms.map((room, i) => {
            const isOwn      = room.player_a_id === user?.id
            const verseColor = VERSE_COLOR[room.verse] ?? 'text-white/40'
            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-void-800 border border-white/8 hover:border-white/15 transition-colors"
              >
                {/* Left: info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white font-medium text-sm truncate">
                      {room.name ?? 'Unnamed Room'}
                    </p>
                    <span className={cn(
                      'shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold',
                      room.is_public
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-amber-500/15 text-amber-400',
                    )}>
                      {room.is_public ? '🌐' : '🔒'}
                    </span>
                  </div>
                  <p className={cn('text-xs font-medium', verseColor)}>
                    {VERSE_LABEL[room.verse] ?? room.verse}
                  </p>
                  <p className="text-xs text-white/25 mt-0.5">
                    by {room.player_a?.username ?? '?'}
                  </p>
                </div>

                {/* Right: action */}
                {isOwn ? (
                  <span className="text-xs text-white/30 italic">Your room</span>
                ) : (
                  <button
                    onClick={() => room.is_public ? handleJoinPublic(room) : handleRequestJoin(room)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gold-500/15 text-gold-400 border border-gold-500/30 hover:bg-gold-500/25 transition-colors text-xs font-semibold shrink-0"
                  >
                    {room.is_public ? (
                      <><ChevronRight size={13} /> Join</>
                    ) : (
                      <><ChevronRight size={13} /> Request</>
                    )}
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Solo Tab ─────────────────────────────────────────────────────────────────

function SoloTab({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="p-4 rounded-xl bg-void-800 border border-white/8 text-sm text-white/50 leading-relaxed">
        Draft characters and battle the AI — no opponent needed.
        Perfect for learning the mechanics or testing team strategies.
      </div>
      <Button variant="gold" size="lg" fullWidth onClick={() => router.push('/solo')}>
        <Bot size={18} /> Start Solo Game
      </Button>
    </div>
  )
}

// ─── Page wrapper ─────────────────────────────────────────────────────────────

export default function LobbyPage() {
  return (
    <Suspense>
      <LobbyContent />
    </Suspense>
  )
}
