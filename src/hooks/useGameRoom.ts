'use client'

import { useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useGameStore } from '@/store/gameStore'
import type { GameRoom } from '@/types/game'

export function useGameRoom(roomId: string) {
  const { room, setRoom, setDraftState, setBattleState, setConnected } = useGameStore()

  const fetchRoom = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('game_rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (error || !data) return
    const r = data as unknown as GameRoom
    setRoom(r)
    if (r.draft_state)  setDraftState(r.draft_state)
    if (r.battle_state) setBattleState(r.battle_state)
  }, [roomId, setRoom, setDraftState, setBattleState])

  useEffect(() => {
    fetchRoom()

    const supabase = createClient()
    const channel = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'game_rooms',
        filter: `id=eq.${roomId}`,
      }, (payload) => {
        const r = payload.new as unknown as GameRoom
        setRoom(r)
        if (r.draft_state)  setDraftState(r.draft_state)
        if (r.battle_state) setBattleState(r.battle_state)
      })
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, fetchRoom, setRoom, setDraftState, setBattleState, setConnected])

  return { room, refetch: fetchRoom }
}
