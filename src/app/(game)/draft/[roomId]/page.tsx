'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Shield, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useGameRoom } from '@/hooks/useGameRoom'
import { useAuth } from '@/hooks/useAuth'
import { CharacterCard } from '@/components/game/CharacterCard'
import { MaskedCharacterCard } from '@/components/game/MaskedCharacterCard'
import { Timer } from '@/components/ui/Timer'
import { Button } from '@/components/ui/Button'
import { formatPowerLevel } from '@/lib/utils/format'
import { applyPick, getVisiblePool, DRAFT_TIMER_SECONDS } from '@/lib/game/draft'
import type { DraftState, DraftPoolSlot } from '@/types/game'
import { cn } from '@/lib/utils/cn'

export default function DraftPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const { room } = useGameRoom(roomId)

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const draft = room?.draft_state as DraftState | null
  const isMyTurn = draft?.current_picker_id === user?.id

  // Redirect to battle when draft completes
  useEffect(() => {
    if (room?.status === 'battling') {
      router.push(`/battle/${roomId}`)
    }
  }, [room?.status, roomId, router])

  async function handlePick() {
    if (selectedSlot === null || !user || !draft || !isMyTurn || submitting) return
    setSubmitting(true)

    try {
      const supabase = createClient()
      const newDraft = applyPick(draft, user.id, selectedSlot)

      let updates: Record<string, unknown> = { draft_state: newDraft }
      if (newDraft.phase === 'complete') {
        updates = { ...updates, status: 'battling', battle_state: initBattleState(newDraft, room!.player_a_id, room!.player_b_id!) }
      }

      const { error } = await supabase.from('game_rooms').update(updates).eq('id', roomId)
      if (error) throw error
      setSelectedSlot(null)
    } catch {
      toast.error('Pick failed — try again')
    } finally {
      setSubmitting(false)
    }
  }

  if (!room || !draft) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white/40">Loading draft…</div>
      </div>
    )
  }

  const myId   = user?.id
  const pool   = myId ? getVisiblePool(draft.draft_pool, myId) : draft.draft_pool
  const myState   = draft.player_a.user_id === myId ? draft.player_a : draft.player_b
  const oppState  = draft.player_a.user_id === myId ? draft.player_b : draft.player_a

  // Pair slots for display: 0&1, 2&3, 4&5, 6&7, 8&9
  const pairs: [DraftPoolSlot, DraftPoolSlot][] = []
  for (let i = 0; i < pool.length; i += 2) {
    pairs.push([pool[i], pool[i + 1]])
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Draft Phase</h1>
          <p className="text-sm text-white/40 mt-1">
            Round {draft.current_round}/5
            {isMyTurn
              ? ' — Your pick!'
              : ` — Waiting for opponent…`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {isMyTurn && (
            <Timer
              endsAt={draft.timer_ends_at}
              totalSeconds={DRAFT_TIMER_SECONDS}
              urgentThreshold={10}
              className="w-24"
            />
          )}
        </div>
      </div>

      {/* Draft pool — shown as pairs */}
      <div className="mb-10">
        <p className="text-xs text-white/30 uppercase tracking-wider mb-4">
          Choose one from each pair — the other goes to your opponent
        </p>
        <div className="flex flex-col gap-6">
          {pairs.map(([slotA, slotB], pairIdx) => {
            const roundPair = pairIdx + 1
            const isPairPicked = slotA.is_picked && slotB.is_picked

            return (
              <motion.div
                key={pairIdx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pairIdx * 0.05 }}
                className={cn('flex items-center gap-6', isPairPicked && 'opacity-50')}
              >
                {/* Pair label */}
                <div className="text-xs text-white/20 font-mono w-4 text-center shrink-0">
                  {roundPair}
                </div>

                {/* Slot A */}
                <SlotCard
                  slot={slotA}
                  isMyTurn={isMyTurn && !slotA.is_picked && !slotB.is_picked}
                  selected={selectedSlot === slotA.position}
                  onSelect={() => setSelectedSlot(slotA.position)}
                  myId={myId}
                />

                {/* VS divider */}
                <div className="text-white/20 text-xs font-bold shrink-0">OR</div>

                {/* Slot B */}
                <SlotCard
                  slot={slotB}
                  isMyTurn={isMyTurn && !slotA.is_picked && !slotB.is_picked}
                  selected={selectedSlot === slotB.position}
                  onSelect={() => setSelectedSlot(slotB.position)}
                  myId={myId}
                />

                {/* Picked indicator */}
                {isPairPicked && (
                  <div className="flex flex-col gap-1 text-xs text-white/30">
                    <span>{slotA.picked_by === myId ? '🟢 You' : '🔴 Opp'}</span>
                    <span>{slotB.picked_by === myId ? '🟢 You' : '🔴 Opp'}</span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Confirm pick button */}
      <AnimatePresence>
        {isMyTurn && selectedSlot !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 inset-x-4 flex justify-center z-30"
          >
            <Button
              variant="gold"
              size="lg"
              onClick={handlePick}
              loading={submitting}
              className="shadow-gold-glow"
            >
              Confirm Pick
              <ChevronRight size={18} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teams */}
      <div className="grid grid-cols-2 gap-6 mt-4">
        {[
          { state: myState, label: 'Your Team' },
          { state: oppState, label: "Opponent's Team" },
        ].map(({ state, label }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-white/40 uppercase tracking-wider">{label}</p>
              <span className="text-xs font-mono text-gold-400">
                Σ {formatPowerLevel(state.power_sum)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {state.characters.map(char => (
                <CharacterCard
                  key={char.slug}
                  character={char}
                  size="sm"
                  showTags={false}
                  animate={false}
                />
              ))}
              {Array.from({ length: 5 - state.characters.length }).map((_, i) => (
                <div
                  key={i}
                  className="w-32 h-40 rounded-2xl border border-dashed border-white/10 bg-void-800/50 flex items-center justify-center"
                >
                  <Shield size={20} className="text-white/10" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Sub-component ─────────────────────────────────────────────────────────────

function SlotCard({
  slot,
  isMyTurn,
  selected,
  onSelect,
  myId,
}: {
  slot: DraftPoolSlot
  isMyTurn: boolean
  selected: boolean
  onSelect: () => void
  myId?: string
}) {
  if (slot.is_picked) {
    // Show who picked it
    if (slot.character && slot.picked_by === myId) {
      return <CharacterCard character={slot.character} size="sm" showTags={false} dimmed animate={false} />
    }
    return (
      <div className="w-32 h-[200px] rounded-2xl border border-white/5 bg-void-800/30 flex items-center justify-center">
        <span className="text-xs text-white/20">Picked</span>
      </div>
    )
  }

  if (slot.is_masked) {
    return (
      <MaskedCharacterCard
        size="sm"
        selectable={isMyTurn}
        selected={selected}
        onSelect={onSelect}
        animate={false}
      />
    )
  }

  return slot.character ? (
    <CharacterCard
      character={slot.character}
      size="sm"
      selectable={isMyTurn}
      selected={selected}
      onSelect={onSelect}
      showTags={false}
      animate={false}
    />
  ) : null
}

// ── Battle state initializer (minimal — real logic lives server-side) ─────────
function initBattleState(draft: DraftState, playerAId: string, playerBId: string) {
  return {
    room_id: draft.room_id,
    player_a: {
      user_id: playerAId,
      remaining_characters: draft.player_a.characters,
      selected_character: null,
      confirmed: false,
    },
    player_b: {
      user_id: playerBId,
      remaining_characters: draft.player_b.characters,
      selected_character: null,
      confirmed: false,
    },
    rounds: [],
    current_round: 1,
    scores: { a: 0, b: 0 },
    phase: 'selecting' as const,
    winner_id: null,
  }
}
