'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Swords, Bot, Trophy, ChevronRight, RotateCcw, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { PlayingCard, FaceDownCard } from '@/components/game/PlayingCard'
import { CardHand } from '@/components/game/CardHand'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { buildDraftPool, applyPick, DRAFT_ROUNDS, getVisiblePool } from '@/lib/game/draft'
import { resolveBattle } from '@/lib/game/battle'
import { aiDraftPick, aiBattlePick, AI_ID, AI_NAME, type AiDifficulty } from '@/lib/game/ai'
import { formatPowerLevel } from '@/lib/utils/format'
import type { Character, Verse } from '@/types/character'
import type { DraftState, DraftPoolSlot, BattleRound } from '@/types/game'
import { cn } from '@/lib/utils/cn'

type Phase = 'setup' | 'draft' | 'battle' | 'result'

const VERSE_OPTIONS: { value: Verse; label: string; color: string }[] = [
  { value: 'one_piece', label: 'One Piece',        color: 'text-orange-400' },
  { value: 'naruto',    label: 'Naruto',            color: 'text-amber-400'  },
  { value: 'dbz',       label: 'Dragon Ball',       color: 'text-purple-400' },
  { value: 'hxh',       label: 'Hunter x Hunter',   color: 'text-emerald-400'},
]

const DIFFICULTY_OPTIONS: { value: AiDifficulty; label: string; desc: string; dot: string }[] = [
  { value: 'easy',   label: 'Easy',   desc: 'AI picks randomly',                     dot: 'bg-green-400' },
  { value: 'normal', label: 'Normal', desc: 'AI targets highest power level',         dot: 'bg-amber-400' },
  { value: 'hard',   label: 'Hard',   desc: 'AI evaluates every possible matchup',    dot: 'bg-red-400'   },
]

const PLAYER_ID = 'player'

function slugsOf(chars: Character[]) { return chars.map(c => c.slug) }

export default function SoloPage() {
  const router = useRouter()
  const { user, profile } = useAuth()

  const [phase, setPhase]             = useState<Phase>('setup')
  const [verse, setVerse]             = useState<Verse>('one_piece')
  const [difficulty, setDifficulty]   = useState<AiDifficulty>('normal')
  const [loadingGame, setLoadingGame] = useState(false)

  // Draft
  const [draft, setDraft]           = useState<DraftState | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [aiThinking, setAiThinking] = useState(false)

  // Battle
  const [playerTeam, setPlayerTeam]               = useState<Character[]>([])
  const [aiTeam, setAiTeam]                       = useState<Character[]>([])
  const [playerRemaining, setPlayerRemaining]     = useState<Character[]>([])
  const [aiRemaining, setAiRemaining]             = useState<Character[]>([])
  const [selectedCharId, setSelectedCharId]       = useState<string | null>(null)
  const [rounds, setRounds]                       = useState<BattleRound[]>([])
  const [scores, setScores]                       = useState({ player: 0, ai: 0 })
  const [resultRound, setResultRound]             = useState<BattleRound | null>(null)
  const [winner, setWinner]                       = useState<'player' | 'ai' | null>(null)
  const [aiHiddenSlugs, setAiHiddenSlugs]         = useState<Set<string>>(new Set())

  // ── Start game ──────────────────────────────────────────────────────────────

  async function startGame() {
    setLoadingGame(true)
    console.log('[Solo] loading characters for verse:', verse)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('verse', verse)

      console.log('[Solo] result → count:', data?.length ?? 0, '| error:', error?.message ?? 'none')

      if (error || !data || data.length < 10) {
        toast.error(
          data && data.length > 0
            ? `Only ${data.length} characters found for this verse — need at least 10.`
            : 'No characters found. Run "npm run seed" to populate the database.',
          { duration: 8000 }
        )
        return
      }

      const pool = buildDraftPool(data as unknown as Character[])
      const state: DraftState = {
        room_id:           'solo',
        verse,
        current_round:     1,
        current_picker_id: PLAYER_ID,
        draft_pool:        pool,
        player_a:          { user_id: PLAYER_ID, characters: [], power_sum: 0 },
        player_b:          { user_id: AI_ID,     characters: [], power_sum: 0 },
        picks:             [],
        timer_ends_at:     new Date(Date.now() + 99999999).toISOString(),
        phase:             'picking',
      }

      setDraft(state)
      setSelectedSlot(null)
      setPhase('draft')
    } catch (err) {
      console.error('[Solo] unexpected error:', err)
      toast.error('Something went wrong starting the game.')
    } finally {
      setLoadingGame(false)
    }
  }

  // ── Draft ───────────────────────────────────────────────────────────────────

  function scheduleAiPicks(state: DraftState) {
    if (state.phase === 'complete' || state.current_picker_id !== AI_ID) return

    setAiThinking(true)
    setTimeout(() => {
      const aiSlot   = aiDraftPick(state.draft_pool, difficulty, state.current_round)
      const newState = applyPick(state, AI_ID, aiSlot)
      setDraft(newState)
      setAiThinking(false)

      if (newState.phase === 'complete') {
        transitionToBattle(newState)
      } else if (newState.current_picker_id === AI_ID) {
        // Rare case: AI picks again in round 5 due to lower power sum
        scheduleAiPicks(newState)
      }
    }, 900)
  }

  function handlePlayerPick() {
    if (selectedSlot === null || !draft) return

    const state = applyPick(draft, PLAYER_ID, selectedSlot)
    setSelectedSlot(null)
    setDraft(state)

    if (state.phase === 'complete') {
      transitionToBattle(state)
      return
    }
    scheduleAiPicks(state)
  }

  // ── Transition to battle ─────────────────────────────────────────────────────

  function transitionToBattle(state: DraftState) {
    const pTeam = state.player_a.characters
    const aTeam = state.player_b.characters
    // Track which AI cards were hidden so BattleScreen can show them face-down
    const hiddenSlugs = new Set<string>()
    for (const slot of state.draft_pool) {
      if (slot.is_masked && slot.picked_by === AI_ID && slot.character) {
        hiddenSlugs.add(slot.character.slug)
      }
    }
    setAiHiddenSlugs(hiddenSlugs)
    setPlayerTeam(pTeam)
    setAiTeam(aTeam)
    setPlayerRemaining(pTeam)
    setAiRemaining(aTeam)
    setRounds([])
    setScores({ player: 0, ai: 0 })
    setSelectedCharId(null)
    setWinner(null)
    setPhase('battle')
  }

  // ── Battle ──────────────────────────────────────────────────────────────────

  function confirmBattlePick() {
    if (!selectedCharId) return

    const playerChar  = playerRemaining.find(c => c.id === selectedCharId)!
    const aiChar      = aiBattlePick(aiRemaining, difficulty, difficulty === 'hard' ? playerRemaining : undefined)
    const result      = resolveBattle(playerChar, aiChar)
    const playerWinsRound = !result.is_draw && result.winner?.id === playerChar.id

    const roundNum = rounds.length + 1
    const newRound: BattleRound = {
      round_number:      roundNum,
      player_a_pick:     playerChar.id,
      player_b_pick:     aiChar.id,
      winner_id:         playerWinsRound ? PLAYER_ID : (!result.is_draw ? AI_ID : null),
      effective_score_a: result.effective_score_a,
      effective_score_b: result.effective_score_b,
      modifiers_applied: result.modifiers,
      resolved_at:       new Date().toISOString(),
      phase:             'result',
      timer_ends_at:     new Date().toISOString(),
    }

    const newScores = {
      player: scores.player + (playerWinsRound ? 1 : 0),
      ai:     scores.ai    + (!result.is_draw && !playerWinsRound ? 1 : 0),
    }

    const newRounds  = [...rounds, newRound]
    const gameWinner: 'player' | 'ai' | null =
      newScores.player >= 3 ? 'player' : newScores.ai >= 3 ? 'ai' : null

    setRounds(newRounds)
    setScores(newScores)
    setPlayerRemaining(prev => prev.filter(c => c.id !== playerChar.id))
    setAiRemaining(prev => prev.filter(c => c.id !== aiChar.id))
    setSelectedCharId(null)
    setResultRound(newRound)

    if (gameWinner) {
      setWinner(gameWinner)
      if (user && profile) {
        saveResult(gameWinner, playerTeam, aiTeam, profile)
      }
      setTimeout(() => {
        setResultRound(null)
        setPhase('result')
      }, 2500)
    }
  }

  async function saveResult(
    finalWinner: 'player' | 'ai',
    pTeam: Character[],
    aTeam: Character[],
    p: typeof profile,
  ) {
    if (!user || !p) return
    const supabase = createClient()
    const existing = p.discovered_characters ?? []
    const merged   = Array.from(new Set([...existing, ...slugsOf(pTeam), ...slugsOf(aTeam)]))
    await supabase.from('profiles').update({
      discovered_characters: merged,
      games_played: p.games_played + 1,
      games_won:    finalWinner === 'player' ? p.games_won + 1 : p.games_won,
      games_lost:   finalWinner === 'ai'     ? p.games_lost + 1 : p.games_lost,
    }).eq('id', user.id)
  }

  function resetGame() {
    setPhase('setup')
    setDraft(null)
    setSelectedSlot(null)
    setWinner(null)
    setRounds([])
    setResultRound(null)
    setAiHiddenSlugs(new Set())
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  if (phase === 'setup') {
    return (
      <SetupScreen
        verse={verse} setVerse={setVerse}
        difficulty={difficulty} setDifficulty={setDifficulty}
        onStart={startGame} loading={loadingGame}
        onBack={() => router.push('/lobby')}
      />
    )
  }

  if (phase === 'draft' && draft) {
    return (
      <DraftScreen
        draft={draft}
        selectedSlot={selectedSlot}
        setSelectedSlot={setSelectedSlot}
        onConfirm={handlePlayerPick}
        aiThinking={aiThinking}
      />
    )
  }

  if (phase === 'battle') {
    return (
      <>
        <BattleScreen
          playerRemaining={playerRemaining}
          aiRemaining={aiRemaining}
          aiHiddenSlugs={aiHiddenSlugs}
          scores={scores}
          rounds={rounds}
          selectedCharId={selectedCharId}
          setSelectedCharId={setSelectedCharId}
          onConfirm={confirmBattlePick}
        />
        <Modal
          open={!!resultRound}
          onClose={() => setResultRound(null)}
          title={`Round ${resultRound?.round_number} Result`}
        >
          {resultRound && (
            <RoundResultContent
              round={resultRound}
              playerChar={playerTeam.find(c => c.id === resultRound.player_a_pick) ?? playerTeam[0]}
              aiChar={aiTeam.find(c => c.id === resultRound.player_b_pick) ?? aiTeam[0]}
              onClose={() => setResultRound(null)}
            />
          )}
        </Modal>
      </>
    )
  }

  if (phase === 'result') {
    return (
      <ResultScreen
        winner={winner}
        playerTeam={playerTeam}
        aiTeam={aiTeam}
        aiHiddenSlugs={aiHiddenSlugs}
        scores={scores}
        rounds={rounds}
        difficulty={difficulty}
        onPlayAgain={resetGame}
        onLobby={() => router.push('/lobby')}
      />
    )
  }

  return null
}

// ── Setup screen ──────────────────────────────────────────────────────────────

function SetupScreen({ verse, setVerse, difficulty, setDifficulty, onStart, loading, onBack }: {
  verse: Verse; setVerse: (v: Verse) => void
  difficulty: AiDifficulty; setDifficulty: (d: AiDifficulty) => void
  onStart: () => void; loading: boolean; onBack: () => void
}) {
  return (
    <div className="max-w-sm mx-auto px-4 py-10">
      <button onClick={onBack} className="text-white/40 hover:text-white text-sm mb-6 transition-colors">
        ← Back to lobby
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-void-800 border border-white/10 flex items-center justify-center">
          <Bot size={18} className="text-gold-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Solo Mode</h1>
          <p className="text-sm text-white/40">Draft &amp; battle against the AI</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Verse</p>
          <div className="grid grid-cols-2 gap-2">
            {VERSE_OPTIONS.map(v => (
              <button
                key={v.value}
                onClick={() => setVerse(v.value)}
                className={cn(
                  'px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors text-left',
                  verse === v.value
                    ? `bg-void-700 border-current ${v.color}`
                    : 'bg-void-800 border-white/8 text-white/50 hover:text-white hover:border-white/20',
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Difficulty</p>
          <div className="flex flex-col gap-2">
            {DIFFICULTY_OPTIONS.map(d => (
              <button
                key={d.value}
                onClick={() => setDifficulty(d.value)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors text-left',
                  difficulty === d.value
                    ? 'bg-void-700 border-white/20'
                    : 'bg-void-800 border-white/8 hover:border-white/20',
                )}
              >
                <div className={cn('w-2 h-2 rounded-full shrink-0', d.dot)} />
                <div>
                  <p className={cn('text-sm font-semibold', difficulty === d.value ? 'text-white' : 'text-white/60')}>
                    {d.label}
                  </p>
                  <p className="text-xs text-white/30">{d.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button variant="gold" size="lg" fullWidth onClick={onStart} loading={loading}>
          <Swords size={18} />
          Start Game
        </Button>
      </div>
    </div>
  )
}

// ── Shared constants for team strip cards ─────────────────────────────────────
const STRIP_W = 110   // sm card width
const STRIP_H = 154   // sm card height
const STRIP_OVERLAP = 45

// Flat overlapping row of team cards + placeholder slots
function TeamStrip({ cards, hiddenSlugs, total = DRAFT_ROUNDS, reversed = false }: {
  cards: (Character | null)[]
  hiddenSlugs?: Set<string>
  total?: number
  reversed?: boolean
}) {
  const slots = Array.from({ length: total }, (_, i) => cards[i] ?? null)
  const ordered = reversed ? [...slots].reverse() : slots
  return (
    <div className="flex justify-center">
      {ordered.map((char, i) => (
        <div key={i} style={{ marginLeft: i > 0 ? -STRIP_OVERLAP : 0, zIndex: reversed ? total - i : i }}>
          {char ? (
            hiddenSlugs?.has(char.slug)
              ? <FaceDownCard size="sm" animate={false} />
              : <PlayingCard character={char} size="sm" animate={false} />
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

// ── Draft screen ──────────────────────────────────────────────────────────────

function DraftScreen({ draft, selectedSlot, setSelectedSlot, onConfirm, aiThinking }: {
  draft: DraftState
  selectedSlot: number | null
  setSelectedSlot: (n: number | null) => void
  onConfirm: () => void
  aiThinking: boolean
}) {
  const isMyTurn  = draft.current_picker_id === PLAYER_ID && !aiThinking
  const round     = draft.current_round

  const pairStart = (round - 1) * 2
  const slotA     = draft.draft_pool[pairStart]
  const slotB     = draft.draft_pool[pairStart + 1]

  const visiblePool = getVisiblePool(draft.draft_pool, PLAYER_ID)
  const myChars     = draft.player_a.characters
  const aiPickSlots = visiblePool.filter(s => s.is_picked && s.picked_by === AI_ID)
  const aiCards     = aiPickSlots.map(s => s.character ?? null)

  if (!slotA || !slotB) return null

  // Pair card helper — renders sm on small screens, md on sm+ breakpoint
  function PairCard({ slot }: { slot: DraftPoolSlot }) {
    const common = {
      selectable: isMyTurn,
      selected: selectedSlot === slot.position,
      onSelect: isMyTurn ? () => setSelectedSlot(slot.position) : undefined,
      animate: false as const,
    }
    return (
      <>
        <div className="sm:hidden">
          {slot.is_masked ? <FaceDownCard size="sm" {...common} /> : <PlayingCard character={slot.character!} size="sm" {...common} />}
        </div>
        <div className="hidden sm:block">
          {slot.is_masked ? <FaceDownCard size="md" {...common} /> : <PlayingCard character={slot.character!} size="md" {...common} />}
        </div>
      </>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden select-none bg-void-950">

      {/* ── TOP: AI accumulated team ── */}
      <div className="flex flex-col items-center px-4 pt-3 pb-2 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-1.5 mb-2">
          <Bot size={10} className="text-white/30" />
          <p className="text-[10px] text-white/30 uppercase tracking-widest">AI Team</p>
        </div>
        <TeamStrip cards={aiCards} total={DRAFT_ROUNDS} />
      </div>

      {/* ── MIDDLE: Round info + pair + confirm ── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4 py-2">

        <div className="text-center">
          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">
            Draft · Round {round} of {DRAFT_ROUNDS}
          </p>
          <div className="flex justify-center gap-2 mb-2">
            {Array.from({ length: DRAFT_ROUNDS }).map((_, i) => (
              <div key={i} className={cn(
                'w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all',
                i + 1 < round   ? 'bg-gold-500 text-void-950'
                : i + 1 === round ? 'bg-void-700 border-2 border-gold-500 text-gold-400'
                : 'bg-void-800 border border-white/10 text-white/20',
              )}>
                {i + 1}
              </div>
            ))}
          </div>
          <p className="text-sm min-h-[20px]">
            {aiThinking
              ? <span className="text-white/40 animate-pulse text-xs">AI is choosing…</span>
              : isMyTurn
                ? <span className="text-gold-400 text-sm font-medium">Your pick — choose one</span>
                : <span className="text-white/40 text-xs">AI picks from this pair</span>
            }
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-10">
          <AnimatePresence mode="wait">
            <motion.div key={`A-${round}`}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}
            >
              <PairCard slot={slotA} />
            </motion.div>
          </AnimatePresence>

          <span className="text-white/20 font-bold text-xs shrink-0 select-none">OR</span>

          <AnimatePresence mode="wait">
            <motion.div key={`B-${round}`}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.18 }}
            >
              <PairCard slot={slotB} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="h-12 flex items-center justify-center">
          <AnimatePresence>
            {isMyTurn && selectedSlot !== null && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                <Button variant="gold" size="lg" onClick={onConfirm} className="px-8 sm:px-12 shadow-gold-glow">
                  Confirm Pick <ChevronRight size={16} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* ── BOTTOM: Player accumulated team ── */}
      <div className="flex flex-col items-center px-4 pt-2 pb-3 border-t border-white/5 shrink-0">
        <TeamStrip cards={myChars} total={DRAFT_ROUNDS} />
        <p className="text-[10px] text-white/30 uppercase tracking-widest mt-2">Your Team</p>
      </div>

    </div>
  )
}

// ── Battle screen ─────────────────────────────────────────────────────────────

function BattleScreen({ playerRemaining, aiRemaining, aiHiddenSlugs, scores, rounds, selectedCharId, setSelectedCharId, onConfirm }: {
  playerRemaining: Character[]; aiRemaining: Character[]
  aiHiddenSlugs: Set<string>
  scores: { player: number; ai: number }; rounds: BattleRound[]
  selectedCharId: string | null; setSelectedCharId: (id: string | null) => void
  onConfirm: () => void
}) {
  const selectedChar = playerRemaining.find(c => c.id === selectedCharId) ?? null

  return (
    <div className="h-screen flex flex-col overflow-hidden select-none bg-void-950">

      {/* ── TOP: AI remaining fighters ── */}
      <div className="flex flex-col items-center px-4 pt-3 pb-2 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-1.5 mb-2">
          <Bot size={10} className="text-white/30" />
          <p className="text-[10px] text-white/30 uppercase tracking-widest">
            {AI_NAME} · {aiRemaining.length} remaining
          </p>
        </div>
        <TeamStrip cards={aiRemaining} hiddenSlugs={aiHiddenSlugs} total={aiRemaining.length} />
      </div>

      {/* ── MIDDLE: Score + selected card preview ── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">

        {/* Score */}
        <div className="flex items-center gap-10 sm:gap-16">
          <div className="text-center">
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">You</p>
            <p className="text-5xl sm:text-6xl font-black text-white">{scores.player}</p>
          </div>
          <div className="text-center">
            <Swords size={20} className="text-gold-400 mx-auto mb-1" />
            <p className="text-[10px] text-white/30">Round {rounds.length + 1}</p>
          </div>
          <div className="text-center">
            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">AI</p>
            <p className="text-5xl sm:text-6xl font-black text-white">{scores.ai}</p>
          </div>
        </div>

        {/* Round result dots */}
        {rounds.length > 0 && (
          <div className="flex gap-2">
            {rounds.map(r => (
              <div key={r.round_number}
                className={cn('w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center',
                  r.winner_id === PLAYER_ID ? 'bg-gold-500 text-void-950' : 'bg-crimson-600 text-white')}
              >
                {r.winner_id === PLAYER_ID ? '✓' : '✗'}
              </div>
            ))}
          </div>
        )}

        {/* Selected card preview */}
        <AnimatePresence mode="wait">
          {selectedChar ? (
            <motion.div key={selectedChar.id}
              initial={{ opacity: 0, scale: 0.85, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 12 }}
              transition={{ type: 'spring', damping: 18, stiffness: 280 }}
              className="flex flex-col items-center gap-2"
            >
              <p className="text-[10px] text-gold-400 uppercase tracking-widest">Ready for battle</p>
              <div className="sm:hidden">
                <PlayingCard character={selectedChar} size="sm" animate={false} selected />
              </div>
              <div className="hidden sm:block">
                <PlayingCard character={selectedChar} size="md" animate={false} selected />
              </div>
            </motion.div>
          ) : (
            <motion.p key="hint"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-white/20 text-xs"
            >
              Select a fighter below
            </motion.p>
          )}
        </AnimatePresence>

      </div>

      {/* ── BOTTOM: Player hand + confirm ── */}
      <div className="flex flex-col items-center px-4 pt-2 pb-4 border-t border-white/5 shrink-0 gap-3">
        <p className="text-[10px] text-white/30 uppercase tracking-widest">
          Your fighters · {playerRemaining.length} remaining
        </p>

        {/* sm on mobile, md on sm+ */}
        <div className="flex justify-center sm:hidden">
          <CardHand characters={playerRemaining} selectedId={selectedCharId}
            onSelect={c => setSelectedCharId(c.id)} size="sm" />
        </div>
        <div className="hidden sm:flex justify-center">
          <CardHand characters={playerRemaining} selectedId={selectedCharId}
            onSelect={c => setSelectedCharId(c.id)} size="md" />
        </div>

        <AnimatePresence>
          {selectedCharId && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
              <Button variant="gold" size="lg" onClick={onConfirm} className="shadow-gold-glow px-8 sm:px-12">
                Send into Battle <ChevronRight size={18} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}

// ── Round result ──────────────────────────────────────────────────────────────

function RoundResultContent({ round, playerChar, aiChar, onClose }: {
  round: BattleRound; playerChar: Character; aiChar: Character; onClose: () => void
}) {
  const iWon = round.winner_id === PLAYER_ID
  return (
    <div className="text-center">
      <p className={cn('text-4xl font-black mb-5', iWon ? 'text-gold-400' : 'text-crimson-400')}>
        {iWon ? 'Round won!' : 'Round lost'}
      </p>

      <div className="flex justify-center items-end gap-6 mb-5">
        <div className="text-center">
          <p className="text-xs text-white/40 mb-2">You sent</p>
          <PlayingCard character={playerChar} size="sm" animate={false} />
        </div>
        <Swords size={20} className="text-white/20 mb-12" />
        <div className="text-center">
          <p className="text-xs text-white/40 mb-2">AI sent</p>
          <PlayingCard character={aiChar} size="sm" animate={false} />
        </div>
      </div>

      <div className="flex justify-center gap-8 text-sm font-mono mb-4">
        <div>
          <p className="text-white/30 text-xs mb-0.5">Your score</p>
          <p className="text-white font-bold">{formatPowerLevel(round.effective_score_a)}</p>
        </div>
        <div className="text-white/20">vs</div>
        <div>
          <p className="text-white/30 text-xs mb-0.5">AI score</p>
          <p className="text-white font-bold">{formatPowerLevel(round.effective_score_b)}</p>
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

// ── Result screen ─────────────────────────────────────────────────────────────

function ResultScreen({ winner, playerTeam, aiTeam, aiHiddenSlugs, scores, rounds, difficulty, onPlayAgain, onLobby }: {
  winner: 'player' | 'ai' | null; playerTeam: Character[]; aiTeam: Character[]
  aiHiddenSlugs: Set<string>
  scores: { player: number; ai: number }; rounds: BattleRound[]; difficulty: AiDifficulty
  onPlayAgain: () => void; onLobby: () => void
}) {
  const playerWon = winner === 'player'
  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 16 }}>
        {playerWon ? (
          <>
            <Trophy size={64} className="text-gold-400 mx-auto mb-4" />
            <h2 className="text-4xl font-black text-gold-400 mb-2">Victory!</h2>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">💀</div>
            <h2 className="text-4xl font-black text-crimson-400 mb-2">Defeated</h2>
          </>
        )}
        <p className="text-white/40 text-sm mb-6">
          {scores.player}–{scores.ai} vs {AI_NAME} · {difficulty}
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {rounds.map(r => (
            <div key={r.round_number}
              className={cn('w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center',
                r.winner_id === PLAYER_ID ? 'bg-gold-500 text-void-950' : 'bg-crimson-600 text-white')}
            >
              {r.winner_id === PLAYER_ID ? '✓' : '✗'}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 text-left">
          <div>
            <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Your Team</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {playerTeam.map(c => <PlayingCard key={c.slug} character={c} size="sm" animate={false} />)}
            </div>
          </div>
          <div>
            <p className="text-xs text-white/30 uppercase tracking-wider mb-2">AI Team</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {aiTeam.map(c =>
                aiHiddenSlugs.has(c.slug)
                  ? <FaceDownCard key={c.slug} size="sm" animate={false} />
                  : <PlayingCard key={c.slug} character={c} size="sm" animate={false} />
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={onLobby}>Lobby</Button>
          <Button variant="gold" fullWidth onClick={onPlayAgain}>
            <RotateCcw size={14} /> Play Again
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
