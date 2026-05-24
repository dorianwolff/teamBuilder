'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Swords, Trophy, Shield, ChevronRight, Info } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useGameRoom } from '@/hooks/useGameRoom'
import { useAuth } from '@/hooks/useAuth'
import { CharacterCard } from '@/components/game/CharacterCard'
import { PowerTagBadge } from '@/components/game/PowerTag'
import { Timer } from '@/components/ui/Timer'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { resolveBattle } from '@/lib/game/battle'
import { computeElo } from '@/lib/game/elo'
import { formatPowerLevel, formatEloDelta } from '@/lib/utils/format'
import type { Character } from '@/types/character'
import type { BattleState, BattleRound } from '@/types/game'
import { cn } from '@/lib/utils/cn'

const BATTLE_TIMER_SECONDS = 20

export default function BattlePage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params)
  const router = useRouter()
  const { user, profile } = useAuth()
  const { room } = useGameRoom(roomId)

  const [selectedCharId, setSelectedCharId] = useState<string | null>(null)
  const [submitting, setSubmitting]          = useState(false)
  const [resultModal, setResultModal]        = useState<BattleRound | null>(null)

  const battle = room?.battle_state as BattleState | null
  const isA    = room?.player_a_id === user?.id

  const myState  = battle ? (isA ? battle.player_a : battle.player_b) : null
  const oppState = battle ? (isA ? battle.player_b : battle.player_a) : null

  // Show result after both pick
  useEffect(() => {
    if (!battle) return
    const lastRound = battle.rounds[battle.rounds.length - 1]
    if (lastRound?.phase === 'result' && !resultModal) {
      setResultModal(lastRound)
    }
  }, [battle?.rounds.length])

  // Handle finished game
  useEffect(() => {
    if (room?.status === 'finished') {
      setTimeout(() => router.push('/lobby'), 4000)
    }
  }, [room?.status])

  async function confirmSelection() {
    if (!selectedCharId || !user || !battle || submitting) return
    setSubmitting(true)

    try {
      const supabase = createClient()
      const field = isA ? 'battle_state->player_a->selected_character' : 'battle_state->player_b->selected_character'

      // Update this player's selection
      const updatedBattle: BattleState = {
        ...battle,
        player_a: isA ? { ...battle.player_a, selected_character: selectedCharId, confirmed: true } : battle.player_a,
        player_b: !isA ? { ...battle.player_b, selected_character: selectedCharId, confirmed: true } : battle.player_b,
      }

      // If both confirmed, resolve the round
      const otherConfirmed = isA ? battle.player_b.confirmed : battle.player_a.confirmed
      let finalBattle = updatedBattle

      if (otherConfirmed) {
        finalBattle = resolveCurrentRound(updatedBattle, isA)
      }

      const updates: Record<string, unknown> = { battle_state: finalBattle }

      if (finalBattle.winner_id) {
        // Game over — compute ELO
        const winnerId  = finalBattle.winner_id
        const loserProfile = null // would fetch opponent profile for real ELO
        updates.status     = 'finished'
        updates.winner_id  = winnerId
        updates.finished_at = new Date().toISOString()

        // Discover characters
        if (profile && myState) {
          await supabase
            .from('profiles')
            .update({
              discovered_characters: [
                ...(profile.discovered_characters ?? []),
                ...myState.remaining_characters.map(c => c.slug),
              ],
              games_played: profile.games_played + 1,
              games_won:    winnerId === user.id ? profile.games_won + 1 : profile.games_won,
              games_lost:   winnerId !== user.id ? profile.games_lost + 1 : profile.games_lost,
            })
            .eq('id', user.id)
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

  if (!room || !battle || !myState || !oppState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white/40">Loading battle…</div>
      </div>
    )
  }

  const timerEndsAt = new Date(Date.now() + BATTLE_TIMER_SECONDS * 1000).toISOString()
  const gameOver    = room.status === 'finished'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Score header */}
      <div className="flex items-center justify-center gap-8 mb-8">
        <div className="text-center">
          <p className="text-white/40 text-xs mb-1">You</p>
          <p className="text-4xl font-black text-white">{battle.scores[isA ? 'a' : 'b']}</p>
        </div>
        <div className="flex flex-col items-center">
          <Swords size={20} className="text-gold-400 mb-1" />
          <p className="text-xs text-white/30">Round {battle.current_round}</p>
        </div>
        <div className="text-center">
          <p className="text-white/40 text-xs mb-1">Opponent</p>
          <p className="text-4xl font-black text-white">{battle.scores[isA ? 'b' : 'a']}</p>
        </div>
      </div>

      {/* Past rounds mini tracker */}
      {battle.rounds.length > 0 && (
        <div className="flex justify-center gap-2 mb-6">
          {battle.rounds.map(r => (
            <div
              key={r.round_number}
              className={cn(
                'w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center',
                r.winner_id === user?.id ? 'bg-gold-500 text-void-950' : 'bg-crimson-600 text-white',
              )}
            >
              {r.winner_id === user?.id ? '✓' : '✗'}
            </div>
          ))}
        </div>
      )}

      {/* My roster */}
      <div className="mb-8">
        <p className="text-xs text-white/30 uppercase tracking-wider mb-3">
          {myState.confirmed ? '✓ Locked in' : 'Select your fighter — '}{' '}
          {!myState.confirmed && (
            <Timer endsAt={timerEndsAt} totalSeconds={BATTLE_TIMER_SECONDS} showBar={false} className="inline-flex" />
          )}
        </p>
        <div className="flex flex-wrap gap-3">
          {myState.remaining_characters.map(char => (
            <CharacterCard
              key={char.slug}
              character={char}
              size="md"
              selectable={!myState.confirmed}
              selected={selectedCharId === char.id}
              onSelect={() => setSelectedCharId(char.id)}
              dimmed={myState.confirmed && selectedCharId !== char.id}
            />
          ))}
        </div>
      </div>

      {/* Confirm button */}
      <AnimatePresence>
        {selectedCharId && !myState.confirmed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 inset-x-4 flex justify-center z-30"
          >
            <Button variant="gold" size="lg" onClick={confirmSelection} loading={submitting} className="shadow-gold-glow">
              Lock In Fighter
              <ChevronRight size={18} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opponent status */}
      <div className="mt-4 p-4 rounded-xl bg-void-800 border border-white/8 flex items-center gap-3">
        <Shield size={18} className="text-white/30" />
        <div>
          <p className="text-sm text-white/60">Opponent&apos;s remaining fighters</p>
          <p className="text-xs text-white/30 mt-0.5">{oppState.remaining_characters.length} characters left</p>
        </div>
        <div className="ml-auto flex gap-2">
          {oppState.remaining_characters.map(char => (
            <div
              key={char.slug}
              className="w-10 h-10 rounded-lg bg-void-900 border border-white/10 flex items-center justify-center text-xs text-white/30"
              title={oppState.confirmed ? char.name : '?'}
            >
              {oppState.confirmed ? '⚔' : '?'}
            </div>
          ))}
        </div>
      </div>

      {/* Round result modal */}
      <Modal open={!!resultModal} onClose={() => setResultModal(null)} title={`Round ${resultModal?.round_number} Result`}>
        {resultModal && <RoundResultModal round={resultModal} myUserId={user?.id ?? ''} onClose={() => setResultModal(null)} />}
      </Modal>

      {/* Game over overlay */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
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
                  <p className="text-white/60">Returning to lobby…</p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">💀</div>
                  <h2 className="text-4xl font-black text-crimson-400 mb-2">Defeat</h2>
                  <p className="text-white/60">Returning to lobby…</p>
                </>
              )}
              {room.elo_delta_a !== null && (
                <p className={cn(
                  'text-2xl font-mono font-bold mt-4',
                  (isA ? room.elo_delta_a : room.elo_delta_b ?? 0) > 0 ? 'text-gold-400' : 'text-crimson-400',
                )}>
                  {formatEloDelta(isA ? room.elo_delta_a : room.elo_delta_b ?? 0)} ELO
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Round result modal content ────────────────────────────────────────────────

function RoundResultModal({
  round, myUserId, onClose,
}: { round: BattleRound; myUserId: string; onClose: () => void }) {
  const iWon = round.winner_id === myUserId
  return (
    <div className="text-center">
      <div className={cn(
        'text-5xl font-black mb-3',
        iWon ? 'text-gold-400' : 'text-crimson-400',
      )}>
        {iWon ? 'You Win!' : 'You Lose'}
      </div>

      <div className="flex justify-center gap-8 my-4 text-sm font-mono">
        <div>
          <p className="text-white/40 text-xs mb-1">Your score</p>
          <p className="text-white font-bold">{formatPowerLevel(round.effective_score_a)}</p>
        </div>
        <div className="text-white/20">vs</div>
        <div>
          <p className="text-white/40 text-xs mb-1">Opponent score</p>
          <p className="text-white font-bold">{formatPowerLevel(round.effective_score_b)}</p>
        </div>
      </div>

      {round.modifiers_applied.length > 0 && (
        <div className="mt-4 text-left space-y-1">
          <p className="text-xs text-white/30 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Info size={10} /> Modifiers applied
          </p>
          {round.modifiers_applied.map((m, i) => (
            <p key={i} className="text-xs text-white/50">{m.description}</p>
          ))}
        </div>
      )}

      <Button variant="gold" fullWidth onClick={onClose} className="mt-6">
        Continue
      </Button>
    </div>
  )
}

// ── Battle resolution helper ──────────────────────────────────────────────────

function resolveCurrentRound(battle: BattleState, isA: boolean): BattleState {
  const charAId = battle.player_a.selected_character!
  const charBId = battle.player_b.selected_character!
  const charA   = battle.player_a.remaining_characters.find(c => c.id === charAId)!
  const charB   = battle.player_b.remaining_characters.find(c => c.id === charBId)!

  const result  = resolveBattle(charA, charB)
  const winnerId = result.winner?.id === charA.id
    ? battle.player_a.user_id
    : result.winner?.id === charB.id
    ? battle.player_b.user_id
    : null

  const newScores = {
    a: battle.scores.a + (winnerId === battle.player_a.user_id ? 1 : 0),
    b: battle.scores.b + (winnerId === battle.player_b.user_id ? 1 : 0),
  }

  const gameWinner =
    newScores.a >= 3 ? battle.player_a.user_id :
    newScores.b >= 3 ? battle.player_b.user_id : null

  const newRound: BattleRound = {
    round_number: battle.current_round,
    player_a_pick: charAId,
    player_b_pick: charBId,
    winner_id: winnerId,
    effective_score_a: result.effective_score_a,
    effective_score_b: result.effective_score_b,
    modifiers_applied: result.modifiers,
    resolved_at: new Date().toISOString(),
    phase: 'result',
    timer_ends_at: new Date().toISOString(),
  }

  return {
    ...battle,
    rounds: [...battle.rounds, newRound],
    current_round: battle.current_round + 1,
    scores: newScores,
    player_a: {
      ...battle.player_a,
      remaining_characters: battle.player_a.remaining_characters.filter(c => c.id !== charAId),
      selected_character: null,
      confirmed: false,
    },
    player_b: {
      ...battle.player_b,
      remaining_characters: battle.player_b.remaining_characters.filter(c => c.id !== charBId),
      selected_character: null,
      confirmed: false,
    },
    winner_id: gameWinner,
    phase: gameWinner ? 'complete' : 'selecting',
  }
}
