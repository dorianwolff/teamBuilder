'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Users, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useGameRoom } from '@/hooks/useGameRoom'
import { useAuth } from '@/hooks/useAuth'
import { PlayingCard, FaceDownCard } from '@/components/game/PlayingCard'
import { Timer } from '@/components/ui/Timer'
import { Button } from '@/components/ui/Button'
import { applyPick, getVisiblePool, DRAFT_TIMER_SECONDS, DRAFT_ROUNDS } from '@/lib/game/draft'
import type { DraftState, DraftPoolSlot, BattlePlayerState } from '@/types/game'
import type { Character } from '@/types/character'
import { cn } from '@/lib/utils/cn'

// ── Shared card-strip constants (mirrors solo page) ───────────────────────────
const STRIP_W = 110
const STRIP_H = 154
const STRIP_OVERLAP = 45

// Overlapping row of sm playing cards — null slots show face-down or empty placeholder
function TeamStrip({
  cards,
  total = DRAFT_ROUNDS,
  reversed = false,
}: {
  cards: (Character | null)[]
  total?: number
  reversed?: boolean
}) {
  const slots   = Array.from({ length: total }, (_, i) => cards[i] ?? null)
  const ordered = reversed ? [...slots].reverse() : slots
  return (
    <div className="flex justify-center">
      {ordered.map((char, i) => (
        <div key={i} style={{ marginLeft: i > 0 ? -STRIP_OVERLAP : 0, zIndex: reversed ? total - i : i }}>
          {char ? (
            <PlayingCard character={char} size="sm" animate={false} />
          ) : (
            <div
              className="rounded-xl border border-dashed border-white/8 bg-void-800/20 shrink-0"
              style={{ width: STRIP_W, height: STRIP_H }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// Opponent strip — shows face-down cards for hidden picks, null = empty slot
function OppStrip({ cards, total = DRAFT_ROUNDS }: { cards: (Character | null | 'hidden')[] , total?: number }) {
  const slots = Array.from({ length: total }, (_, i) => cards[i] ?? null)
  return (
    <div className="flex justify-center">
      {slots.map((entry, i) => (
        <div key={i} style={{ marginLeft: i > 0 ? -STRIP_OVERLAP : 0, zIndex: i }}>
          {entry === 'hidden' ? (
            <FaceDownCard size="sm" animate={false} />
          ) : entry ? (
            <PlayingCard character={entry} size="sm" animate={false} />
          ) : (
            <div
              className="rounded-xl border border-dashed border-white/8 bg-void-800/20 shrink-0"
              style={{ width: STRIP_W, height: STRIP_H }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Pair card (sm on mobile, md on sm+) ──────────────────────────────────────

function PairCard({ slot, isMyTurn, selected, onSelect }: {
  slot: DraftPoolSlot
  isMyTurn: boolean
  selected: boolean
  onSelect: () => void
}) {
  const common = {
    selectable: isMyTurn,
    selected,
    onSelect: isMyTurn ? onSelect : undefined,
    animate: false as const,
  }
  if (slot.is_masked) {
    return (
      <>
        <div className="sm:hidden"><FaceDownCard size="sm" {...common} /></div>
        <div className="hidden sm:block"><FaceDownCard size="md" {...common} /></div>
      </>
    )
  }
  if (!slot.character) return null
  return (
    <>
      <div className="sm:hidden">
        <PlayingCard character={slot.character} size="sm" {...common} />
      </div>
      <div className="hidden sm:block">
        <PlayingCard character={slot.character} size="md" {...common} />
      </div>
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DraftPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params)
  const router     = useRouter()
  const { user }   = useAuth()
  const { room }   = useGameRoom(roomId)

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [submitting, setSubmitting]     = useState(false)

  const draft    = room?.draft_state as DraftState | null
  const myId     = user?.id
  const isMyTurn = draft?.current_picker_id === myId

  // Navigate to battle when draft completes
  useEffect(() => {
    if (room?.status === 'battling') router.push(`/battle/${roomId}`)
  }, [room?.status, roomId, router])

  async function handlePick() {
    if (selectedSlot === null || !user || !draft || !isMyTurn || submitting) return
    setSubmitting(true)
    try {
      const supabase  = createClient()
      const newDraft  = applyPick(draft, user.id, selectedSlot)
      const updates: Record<string, unknown> = { draft_state: newDraft }
      if (newDraft.phase === 'complete') {
        updates.status       = 'battling'
        updates.battle_state = initBattleState(newDraft, room!.player_a_id, room!.player_b_id!)
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

  // ── Loading state ────────────────────────────────────────────────────────────
  if (!room || !draft) {
    return (
      <div className="h-screen flex items-center justify-center bg-void-950">
        <div className="text-white/40">Loading draft…</div>
      </div>
    )
  }

  // ── Compute display data ─────────────────────────────────────────────────────
  const visiblePool = myId ? getVisiblePool(draft.draft_pool, myId) : draft.draft_pool
  const myState     = draft.player_a.user_id === myId ? draft.player_a : draft.player_b
  const oppState    = draft.player_a.user_id === myId ? draft.player_b : draft.player_a
  const oppId       = oppState.user_id

  // Build opponent's visible team: revealed = Character, masked = 'hidden'
  const oppPickedSlots = visiblePool.filter(s => s.is_picked && s.picked_by === oppId)
  const oppCards: (Character | 'hidden')[] = oppPickedSlots.map(s =>
    s.character ? s.character : 'hidden'
  )

  const round    = draft.current_round
  const pairIdx  = (round - 1) * 2
  const slotA    = visiblePool[pairIdx]
  const slotB    = visiblePool[pairIdx + 1]

  if (!slotA || !slotB) return null

  return (
    <div className="h-screen flex flex-col overflow-hidden select-none bg-void-950">

      {/* ── TOP: Opponent's accumulated picks ── */}
      <div className="flex flex-col items-center px-4 pt-3 pb-2 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-1.5 mb-2">
          <Users size={10} className="text-white/30" />
          <p className="text-[10px] text-white/30 uppercase tracking-widest">Opponent</p>
        </div>
        <OppStrip cards={oppCards} total={DRAFT_ROUNDS} />
      </div>

      {/* ── MIDDLE: Round info + pair + confirm ── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4 py-2 min-h-0">

        {/* Round progress */}
        <div className="text-center">
          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">
            Draft · Round {round} of {DRAFT_ROUNDS}
          </p>
          <div className="flex justify-center gap-2 mb-2">
            {Array.from({ length: DRAFT_ROUNDS }).map((_, i) => (
              <div key={i} className={cn(
                'w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all',
                i + 1 <  round  ? 'bg-gold-500 text-void-950'
                : i + 1 === round ? 'bg-void-700 border-2 border-gold-500 text-gold-400'
                : 'bg-void-800 border border-white/10 text-white/20',
              )}>
                {i + 1}
              </div>
            ))}
          </div>

          {/* Status + timer */}
          <div className="flex items-center justify-center gap-2 min-h-[20px]">
            {isMyTurn ? (
              <>
                <span className="text-gold-400 text-sm font-medium">Your pick — choose one</span>
                <Timer endsAt={draft.timer_ends_at} totalSeconds={DRAFT_TIMER_SECONDS} showBar={false} urgentThreshold={10} className="text-xs" />
              </>
            ) : (
              <span className="text-white/40 text-xs animate-pulse">Waiting for opponent…</span>
            )}
          </div>
        </div>

        {/* Card pair */}
        <div className="flex items-center justify-center gap-4 sm:gap-10">
          <AnimatePresence mode="wait">
            <motion.div key={`A-${round}`}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}
            >
              <PairCard
                slot={slotA}
                isMyTurn={isMyTurn}
                selected={selectedSlot === slotA.position}
                onSelect={() => setSelectedSlot(slotA.position)}
              />
            </motion.div>
          </AnimatePresence>

          <span className="text-white/20 font-bold text-xs shrink-0 select-none">OR</span>

          <AnimatePresence mode="wait">
            <motion.div key={`B-${round}`}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.18 }}
            >
              <PairCard
                slot={slotB}
                isMyTurn={isMyTurn}
                selected={selectedSlot === slotB.position}
                onSelect={() => setSelectedSlot(slotB.position)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Confirm button */}
        <div className="h-12 flex items-center justify-center">
          <AnimatePresence>
            {isMyTurn && selectedSlot !== null && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                <Button
                  variant="gold"
                  size="lg"
                  onClick={handlePick}
                  loading={submitting}
                  className="px-8 sm:px-12 shadow-gold-glow"
                >
                  Confirm Pick <ChevronRight size={16} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── BOTTOM: My accumulated picks ── */}
      <div className="flex flex-col items-center px-4 pt-2 pb-3 border-t border-white/5 shrink-0">
        <TeamStrip cards={myState.characters} total={DRAFT_ROUNDS} />
        <p className="text-[10px] text-white/30 uppercase tracking-widest mt-2">Your Team</p>
      </div>

    </div>
  )
}

// ── Battle state initialiser ──────────────────────────────────────────────────

function initBattleState(draft: DraftState, playerAId: string, playerBId: string) {
  const makePlayer = (state: typeof draft.player_a, userId: string): BattlePlayerState => ({
    user_id:              userId,
    remaining_characters: state.characters,
    selected_character:   null,
    confirmed:            false,
  })
  return {
    room_id:       draft.room_id,
    player_a:      makePlayer(draft.player_a, playerAId),
    player_b:      makePlayer(draft.player_b, playerBId),
    rounds:        [],
    current_round: 1,
    scores:        { a: 0, b: 0 },
    phase:         'selecting' as const,
    winner_id:     null,
  }
}
