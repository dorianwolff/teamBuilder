'use client'

import { useEffect, useState, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Swords, Trophy, ChevronRight, Info, RotateCcw, Users, Flag, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useGameRoom } from '@/hooks/useGameRoom'
import { useAuth } from '@/hooks/useAuth'
import { PlayingCard, FaceDownCard } from '@/components/game/PlayingCard'
import { CardHand } from '@/components/game/CardHand'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { buildInitialDraftState } from '@/lib/game/draft'
import { resolveBattle } from '@/lib/game/battle'
import { computeElo } from '@/lib/game/elo'
import { formatPowerLevel, formatEloDelta } from '@/lib/utils/format'
import type { BattleState, BattleRound } from '@/types/game'
import type { Character, Verse } from '@/types/character'
import { cn } from '@/lib/utils/cn'

// ── Shared constants ──────────────────────────────────────────────────────────
const STRIP_W       = 110
const STRIP_H       = 154
const STRIP_OVERLAP = 45

function OppRemainingStrip({ count }: { count: number }) {
  return (
    <div className="flex justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ marginLeft: i > 0 ? -STRIP_OVERLAP : 0, zIndex: i }}>
          <FaceDownCard size="sm" animate={false} />
        </div>
      ))}
      {count === 0 && (
        <div
          className="rounded-xl border border-dashed border-white/8 bg-void-800/20 shrink-0"
          style={{ width: STRIP_W, height: STRIP_H }}
        />
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BattlePage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params)
  const router     = useRouter()
  const { user, profile } = useAuth()
  const { room }   = useGameRoom(roomId)

  const [selectedCharId, setSelectedCharId] = useState<string | null>(null)
  const [submitting, setSubmitting]         = useState(false)
  const [resultModal, setResultModal]       = useState<BattleRound | null>(null)
  const [playingAgain, setPlayingAgain]     = useState(false)
  const [rematchCountdown, setRematchCountdown] = useState<number | null>(null)

  // Capture the full roster at battle start; characters get removed after each round
  // so we store them here to look up which cards were played in result modals
  const [allBattleChars, setAllBattleChars] = useState<Character[]>([])
  const resettingRef = useRef(false)

  const battle   = room?.battle_state as BattleState | null
  const isA      = room?.player_a_id === user?.id
  const myState  = battle ? (isA ? battle.player_a : battle.player_b) : null
  const oppState = battle ? (isA ? battle.player_b : battle.player_a) : null

  // Capture all characters when battle first loads (before any are removed)
  useEffect(() => {
    if (!battle || allBattleChars.length > 0) return
    setAllBattleChars([
      ...battle.player_a.remaining_characters,
      ...battle.player_b.remaining_characters,
    ])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!battle])

  // Show round result modal whenever a round resolves
  useEffect(() => {
    if (!battle) return
    const last = battle.rounds[battle.rounds.length - 1]
    if (last?.phase === 'result' && !resultModal) setResultModal(last)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battle?.rounds.length])

  // Handle room status changes
  useEffect(() => {
    if (!room) return
    if (room.status === 'finished' && room.mode === 'ranked') {
      const t = setTimeout(() => router.push('/lobby'), 4000)
      return () => clearTimeout(t)
    }
    if (room.status === 'drafting') router.push(`/draft/${roomId}`)
    if (room.status === 'abandoned') {
      toast.error('Match ended early')
      router.push('/lobby')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.status])

  // Player A detects when both players voted rematch and resets the game
  useEffect(() => {
    if (!battle?.rematch_votes || !room || room.mode !== 'casual' ||
        room.status !== 'finished' || !isA || resettingRef.current) return
    const votes = battle.rematch_votes
    if (votes.includes(room.player_a_id) && votes.includes(room.player_b_id ?? '')) {
      resettingRef.current = true
      handlePlayAgainReset()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battle?.rematch_votes?.length])

  // Countdown timer after voting Play Again — if opponent doesn't respond, redirect
  useEffect(() => {
    if (rematchCountdown === null) return
    if (rematchCountdown <= 0) { router.push('/lobby'); return }
    const t = setTimeout(() => setRematchCountdown(c => (c ?? 1) - 1), 1000)
    return () => clearTimeout(t)
  }, [rematchCountdown, router])

  // Register beforeunload forfeit — fires when player closes tab/browser mid-game
  useEffect(() => {
    const gameOver = room?.status === 'finished' || room?.status === 'abandoned'
    if (gameOver || !battle || !room) return
    const oppId = isA ? room.player_b_id : room.player_a_id
    if (!oppId) return
    const payload = JSON.stringify({ roomId, winnerId: oppId })
    const onUnload = () => navigator.sendBeacon?.('/api/abandon-match', payload)
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.status, !!battle, isA, roomId])

  // ── Confirm fighter selection ─────────────────────────────────────────────

  async function confirmSelection() {
    if (!selectedCharId || !user || !battle || submitting) return
    setSubmitting(true)
    try {
      const supabase = createClient()
      const updatedBattle: BattleState = {
        ...battle,
        player_a: isA  ? { ...battle.player_a, selected_character: selectedCharId, confirmed: true } : battle.player_a,
        player_b: !isA ? { ...battle.player_b, selected_character: selectedCharId, confirmed: true } : battle.player_b,
      }
      const otherConfirmed = isA ? battle.player_b.confirmed : battle.player_a.confirmed
      let finalBattle = updatedBattle
      if (otherConfirmed) {
        finalBattle = resolveCurrentRound(updatedBattle)
      }

      const updates: Record<string, unknown> = { battle_state: finalBattle }

      if (finalBattle.winner_id && profile && room) {
        updates.status      = 'finished'
        updates.winner_id   = finalBattle.winner_id
        updates.finished_at = new Date().toISOString()

        const isWinner   = finalBattle.winner_id === user.id
        // All characters that appeared in this battle — used for discovery
        const allSlugs   = allBattleChars.map(c => c.slug)
        const oppId      = isA ? room.player_b_id! : room.player_a_id

        // Fetch opponent's full profile so we can update their stats + ELO
        const { data: oppData } = await supabase
          .from('profiles')
          .select('elo, games_played, games_won, games_lost, discovered_characters')
          .eq('id', oppId)
          .single()

        // ── Ranked: compute ELO deltas ───────────────────────────────────────
        let myNewElo  = profile.elo
        let oppNewElo = (oppData?.elo ?? profile.elo)

        if (room.mode === 'ranked' && oppData) {
          const scoreA  = (finalBattle.winner_id === room.player_a_id ? 1 : 0) as 0 | 1
          const eloResult = computeElo(
            isA ? profile.elo    : oppData.elo,   // player A elo
            isA ? oppData.elo    : profile.elo,   // player B elo
            scoreA,
            isA ? profile.games_played  : oppData.games_played,
            isA ? oppData.games_played  : profile.games_played,
          )
          updates.elo_delta_a = eloResult.delta_a
          updates.elo_delta_b = eloResult.delta_b
          myNewElo  = isA ? eloResult.new_elo_a : eloResult.new_elo_b
          oppNewElo = isA ? eloResult.new_elo_b : eloResult.new_elo_a
        }

        // ── Update my profile ───────────────────────────────────────────────
        await supabase.from('profiles').update({
          discovered_characters: Array.from(new Set([
            ...(profile.discovered_characters ?? []),
            ...allSlugs,
          ])),
          elo:          myNewElo,
          games_played: profile.games_played + 1,
          games_won:    isWinner  ? profile.games_won  + 1 : profile.games_won,
          games_lost:   !isWinner ? profile.games_lost + 1 : profile.games_lost,
        }).eq('id', user.id)

        // ── Update opponent's profile ───────────────────────────────────────
        if (oppData) {
          const oppIsWinner = finalBattle.winner_id === oppId
          await supabase.from('profiles').update({
            discovered_characters: Array.from(new Set([
              ...((oppData.discovered_characters as string[]) ?? []),
              ...allSlugs,
            ])),
            elo:          oppNewElo,
            games_played: oppData.games_played + 1,
            games_won:    oppIsWinner  ? oppData.games_won  + 1 : oppData.games_won,
            games_lost:   !oppIsWinner ? oppData.games_lost + 1 : oppData.games_lost,
          }).eq('id', oppId)
        }
      }

      const { error } = await supabase.from('game_rooms').update(updates).eq('id', roomId)
      if (error) throw error
      setSelectedCharId(null)
    } catch {
      toast.error('Failed to submit selection')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Surrender ──────────────────────────────────────────────────────────────

  async function handleSurrender() {
    if (!user || !room) return
    const oppId = isA ? room.player_b_id : room.player_a_id
    if (!oppId) return
    try {
      const supabase = createClient()
      await supabase.from('game_rooms').update({
        status:      'finished',
        winner_id:   oppId,
        finished_at: new Date().toISOString(),
      }).eq('id', roomId)
    } catch {
      toast.error('Surrender failed — try again')
    }
  }

  // ── Play Again (coordinated) ───────────────────────────────────────────────

  async function handlePlayAgainReset() {
    if (!room?.player_b_id) return
    try {
      const supabase = createClient()
      const { data: chars } = room.verse === 'all'
        ? await supabase.from('characters').select('*')
        : await supabase.from('characters').select('*').eq('verse', room.verse)
      const draft = buildInitialDraftState(
        roomId, room.player_a_id, room.player_b_id,
        room.verse as Verse | 'all', (chars ?? []) as Character[],
      )
      await supabase.from('game_rooms').update({
        status:       'drafting',
        draft_state:  draft,
        battle_state: null,
        winner_id:    null,
        elo_delta_a:  null,
        elo_delta_b:  null,
        started_at:   new Date().toISOString(),
        finished_at:  null,
      }).eq('id', roomId)
      // Navigation triggered automatically by room.status === 'drafting' effect
    } catch {
      toast.error('Failed to restart — try again')
      resettingRef.current = false
      setPlayingAgain(false)
    }
  }

  async function handleVotePlayAgain() {
    if (!user || !battle || !room || playingAgain) return
    setPlayingAgain(true)
    try {
      const supabase = createClient()
      // Read fresh battle state to reduce race-condition window
      const { data: fresh } = await supabase
        .from('game_rooms')
        .select('battle_state')
        .eq('id', roomId)
        .single()
      const currentVotes = ((fresh?.battle_state as BattleState | null)?.rematch_votes) ?? []
      const newVotes     = Array.from(new Set([...currentVotes, user.id]))
      const bothVoted    = newVotes.includes(room.player_a_id) && newVotes.includes(room.player_b_id ?? '')

      if (bothVoted && isA) {
        resettingRef.current = true
        await handlePlayAgainReset()
      } else {
        await supabase.from('game_rooms').update({
          battle_state: { ...battle, rematch_votes: newVotes },
        }).eq('id', roomId)
        setRematchCountdown(30)
        setPlayingAgain(false)
      }
    } catch {
      toast.error('Failed — try again')
      setPlayingAgain(false)
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────────

  if (!room || !battle || !myState || !oppState) {
    return (
      <div className="h-screen flex items-center justify-center bg-void-950">
        <div className="text-white/40">Loading battle…</div>
      </div>
    )
  }

  const gameOver     = room.status === 'finished'
  const myScore      = battle.scores[isA ? 'a' : 'b']
  const oppScore     = battle.scores[isA ? 'b' : 'a']
  const selectedChar = myState.remaining_characters.find(c => c.id === selectedCharId) ?? null

  const rematchVotes = battle.rematch_votes ?? []
  const iVoted       = rematchVotes.includes(user?.id ?? '')
  const oppVoted     = rematchVotes.includes(isA ? (room.player_b_id ?? '') : room.player_a_id)

  return (
    <div className="h-screen flex flex-col overflow-hidden select-none bg-void-950">

      {/* ── TOP: Opponent's remaining (face-down) + surrender ── */}
      <div className="flex items-start px-4 pt-3 pb-2 border-b border-white/5 shrink-0 gap-2">
        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center gap-1.5 mb-2">
            <Users size={10} className="text-white/30" />
            <p className="text-[10px] text-white/30 uppercase tracking-widest">
              Opponent · {oppState.remaining_characters.length} remaining
            </p>
          </div>
          <OppRemainingStrip count={oppState.remaining_characters.length} />
        </div>

        {!gameOver && (
          <button
            onClick={handleSurrender}
            className="shrink-0 flex items-center gap-1 text-[10px] text-white/20 hover:text-crimson-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-crimson-500/10"
          >
            <Flag size={10} />
            <span className="hidden sm:inline">Surrender</span>
          </button>
        )}
      </div>

      {/* ── MIDDLE: Score + round dots + card preview ── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4 min-h-0">

        {/* Score */}
        <div className="flex items-center gap-8 sm:gap-16">
          <div className="text-center">
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">You</p>
            <p className="text-4xl sm:text-5xl font-black text-white">{myScore}</p>
          </div>
          <div className="text-center">
            <Swords size={16} className="text-gold-400 mx-auto mb-1" />
            <p className="text-[10px] text-white/30">Round {battle.current_round}</p>
          </div>
          <div className="text-center">
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Opponent</p>
            <p className="text-4xl sm:text-5xl font-black text-white">{oppScore}</p>
          </div>
        </div>

        {/* Round result dots */}
        {battle.rounds.length > 0 && (
          <div className="flex gap-2">
            {battle.rounds.map(r => (
              <div key={r.round_number}
                className={cn('w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center',
                  r.winner_id === user?.id ? 'bg-gold-500 text-void-950' : 'bg-crimson-600 text-white')}
              >
                {r.winner_id === user?.id ? '✓' : '✗'}
              </div>
            ))}
          </div>
        )}

        {/* Card preview — desktop only */}
        <div className="hidden sm:block">
          <AnimatePresence mode="wait">
            {selectedChar ? (
              <motion.div key={selectedChar.id}
                initial={{ opacity: 0, scale: 0.85, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 12 }}
                transition={{ type: 'spring', damping: 18, stiffness: 280 }}
                className="flex flex-col items-center gap-2"
              >
                <p className="text-[10px] text-gold-400 uppercase tracking-widest">
                  {myState.confirmed ? 'Locked in — waiting…' : 'Ready for battle'}
                </p>
                <PlayingCard character={selectedChar} size="md" animate={false} selected />
              </motion.div>
            ) : myState.confirmed ? (
              <motion.p key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-white/30 text-xs animate-pulse"
              >
                Waiting for opponent…
              </motion.p>
            ) : (
              <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-white/20 text-xs"
              >
                Select a fighter below
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile hint */}
        {!myState.confirmed && !selectedChar && (
          <p className="text-white/20 text-xs sm:hidden">Select a fighter below</p>
        )}
        {myState.confirmed && (
          <p className="text-white/30 text-xs sm:hidden animate-pulse">Waiting for opponent…</p>
        )}
      </div>

      {/* ── BOTTOM: My hand + confirm button ── */}
      <div className="flex flex-col items-center px-4 pt-2 pb-3 border-t border-white/5 shrink-0 gap-2">
        <p className="text-[10px] text-white/30 uppercase tracking-widest">
          Your fighters · {myState.remaining_characters.length} remaining
        </p>

        <div className="flex justify-center sm:hidden">
          <CardHand
            characters={myState.remaining_characters}
            selectedId={myState.confirmed ? null : selectedCharId}
            onSelect={myState.confirmed ? undefined : c => setSelectedCharId(c.id)}
            size="sm"
            disabled={myState.confirmed}
          />
        </div>
        <div className="hidden sm:flex justify-center">
          <CardHand
            characters={myState.remaining_characters}
            selectedId={myState.confirmed ? null : selectedCharId}
            onSelect={myState.confirmed ? undefined : c => setSelectedCharId(c.id)}
            size="md"
            disabled={myState.confirmed}
          />
        </div>

        <div className="h-11 flex items-center justify-center">
          <AnimatePresence>
            {selectedCharId && !myState.confirmed && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
                <Button
                  variant="gold"
                  size="lg"
                  onClick={confirmSelection}
                  loading={submitting}
                  className="shadow-gold-glow px-8 sm:px-12"
                >
                  Battle <ChevronRight size={16} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Round result modal ── */}
      <Modal
        open={!!resultModal}
        onClose={() => setResultModal(null)}
        title={`Round ${resultModal?.round_number} Result`}
      >
        {resultModal && (
          <RoundResultModal
            round={resultModal}
            myUserId={user?.id ?? ''}
            allChars={allBattleChars}
            isA={isA}
            onClose={() => setResultModal(null)}
          />
        )}
      </Modal>

      {/* ── Game over overlay ── */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              {room.winner_id === user?.id ? (
                <>
                  <Trophy size={64} className="text-gold-400 mx-auto mb-4" />
                  <h2 className="text-4xl font-black text-gold-400 mb-2">Victory!</h2>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">💀</div>
                  <h2 className="text-4xl font-black text-crimson-400 mb-2">Defeat</h2>
                </>
              )}

              {room.elo_delta_a !== null && (
                <p className={cn(
                  'text-2xl font-mono font-bold mt-2 mb-4',
                  (isA ? room.elo_delta_a : room.elo_delta_b ?? 0) > 0 ? 'text-gold-400' : 'text-crimson-400',
                )}>
                  {formatEloDelta(isA ? room.elo_delta_a : room.elo_delta_b ?? 0)} ELO
                </p>
              )}

              {room.mode === 'ranked' ? (
                <p className="text-white/40 text-sm mt-2">Returning to lobby…</p>
              ) : (
                <div className="flex flex-col gap-3 mt-6 min-w-[220px]">
                  {iVoted ? (
                    /* Voted — show waiting state with countdown */
                    <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400/80 text-sm">
                      <Loader2 size={14} className="animate-spin shrink-0" />
                      <span>
                        Waiting for opponent
                        {rematchCountdown !== null && (
                          <span className="text-gold-400/50 ml-1">({rematchCountdown}s)</span>
                        )}
                      </span>
                    </div>
                  ) : (
                    /* Not voted yet */
                    <button
                      disabled={playingAgain}
                      onClick={handleVotePlayAgain}
                      className={cn(
                        'flex items-center justify-center gap-2 w-full py-3 rounded-xl border font-semibold transition-all disabled:opacity-50',
                        oppVoted
                          ? 'bg-gold-500/25 text-gold-400 border-gold-500/50'
                          : 'bg-gold-500/15 text-gold-400 border-gold-500/30 hover:bg-gold-500/25',
                      )}
                    >
                      {playingAgain ? (
                        <><Loader2 size={14} className="animate-spin" /> Starting…</>
                      ) : oppVoted ? (
                        <><RotateCcw size={16} /> Opponent wants a rematch!</>
                      ) : (
                        <><RotateCcw size={16} /> Play Again</>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => router.push('/lobby')}
                    className="w-full py-2.5 rounded-xl text-white/40 hover:text-white/70 transition-colors text-sm"
                  >
                    Back to Lobby
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Round result modal ────────────────────────────────────────────────────────

function RoundResultModal({
  round, myUserId, allChars, isA, onClose,
}: { round: BattleRound; myUserId: string; allChars: Character[]; isA: boolean; onClose: () => void }) {
  const iWon    = round.winner_id === myUserId
  const charA   = allChars.find(c => c.id === round.player_a_pick)
  const charB   = allChars.find(c => c.id === round.player_b_pick)
  const myChar  = isA ? charA : charB
  const oppChar = isA ? charB : charA

  return (
    <div className="text-center">
      <p className={cn('text-4xl font-black mb-5', iWon ? 'text-gold-400' : 'text-crimson-400')}>
        {iWon ? 'Round won!' : 'Round lost'}
      </p>

      {myChar && oppChar && (
        <div className="flex justify-center items-end gap-6 mb-5">
          <div className="text-center">
            <p className="text-xs text-white/40 mb-2">You sent</p>
            <PlayingCard character={myChar} size="sm" animate={false} />
          </div>
          <Swords size={20} className="text-white/20 mb-12" />
          <div className="text-center">
            <p className="text-xs text-white/40 mb-2">They sent</p>
            <PlayingCard character={oppChar} size="sm" animate={false} />
          </div>
        </div>
      )}

      <div className="flex justify-center gap-8 text-sm font-mono mb-4">
        <div>
          <p className="text-white/30 text-xs mb-0.5">Your score</p>
          <p className="text-white font-bold">
            {formatPowerLevel(isA ? round.effective_score_a : round.effective_score_b)}
          </p>
        </div>
        <div className="text-white/20">vs</div>
        <div>
          <p className="text-white/30 text-xs mb-0.5">Their score</p>
          <p className="text-white font-bold">
            {formatPowerLevel(isA ? round.effective_score_b : round.effective_score_a)}
          </p>
        </div>
      </div>

      {round.modifiers_applied.length > 0 && (
        <div className="mt-2 text-left space-y-1 p-3 rounded-xl bg-void-900">
          <p className="text-xs text-white/30 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Info size={10} /> Modifiers applied
          </p>
          {round.modifiers_applied.map((m, i) => (
            <p key={i} className="text-xs text-white/40">{m.description}</p>
          ))}
        </div>
      )}

      <Button variant="gold" fullWidth onClick={onClose} className="mt-5">Continue</Button>
    </div>
  )
}

// ── Round resolution ──────────────────────────────────────────────────────────
//
// resolveBattle() always puts the WINNER's score in effective_score_a.
// We normalize here so that effective_score_a always = player_a's actual score.

function resolveCurrentRound(battle: BattleState): BattleState {
  const charAId = battle.player_a.selected_character!
  const charBId = battle.player_b.selected_character!
  const charA   = battle.player_a.remaining_characters.find(c => c.id === charAId)!
  const charB   = battle.player_b.remaining_characters.find(c => c.id === charBId)!

  const result    = resolveBattle(charA, charB)
  const charAWins = !result.is_draw && result.winner?.id === charA.id

  // Normalize: score_a = player A's actual score, score_b = player B's actual score
  const scoreA = charAWins || result.is_draw ? result.effective_score_a : result.effective_score_b
  const scoreB = charAWins || result.is_draw ? result.effective_score_b : result.effective_score_a

  const winnerId  = charAWins             ? battle.player_a.user_id
    : !result.is_draw                     ? battle.player_b.user_id
    : null

  const newScores = {
    a: battle.scores.a + (winnerId === battle.player_a.user_id ? 1 : 0),
    b: battle.scores.b + (winnerId === battle.player_b.user_id ? 1 : 0),
  }
  const gameWinner =
    newScores.a >= 3 ? battle.player_a.user_id :
    newScores.b >= 3 ? battle.player_b.user_id : null

  const newRound: BattleRound = {
    round_number:      battle.current_round,
    player_a_pick:     charAId,
    player_b_pick:     charBId,
    winner_id:         winnerId,
    effective_score_a: scoreA,
    effective_score_b: scoreB,
    modifiers_applied: result.modifiers,
    resolved_at:       new Date().toISOString(),
    phase:             'result',
    timer_ends_at:     new Date().toISOString(),
  }

  return {
    ...battle,
    rounds:        [...battle.rounds, newRound],
    current_round: battle.current_round + 1,
    scores:        newScores,
    player_a: {
      ...battle.player_a,
      remaining_characters: battle.player_a.remaining_characters.filter(c => c.id !== charAId),
      selected_character:   null,
      confirmed:            false,
    },
    player_b: {
      ...battle.player_b,
      remaining_characters: battle.player_b.remaining_characters.filter(c => c.id !== charBId),
      selected_character:   null,
      confirmed:            false,
    },
    winner_id: gameWinner,
    phase:     gameWinner ? 'complete' : 'selecting',
  }
}
