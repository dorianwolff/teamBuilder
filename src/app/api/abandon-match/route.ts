import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/abandon-match
 *
 * Called via navigator.sendBeacon when a player navigates away mid-game.
 * Sets the room to 'finished' with the opponent as winner.
 * Body: JSON string { roomId: string; winnerId: string }
 *
 * sendBeacon sends Content-Type: text/plain, so we read the body as text.
 * The request includes same-origin cookies, so Supabase auth works normally.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const { roomId, winnerId } = JSON.parse(body) as { roomId?: string; winnerId?: string }
    if (!roomId || !winnerId) return new Response('bad request', { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Response('unauthorized', { status: 401 })

    // Only mark as finished if game is still actively in progress
    // and the caller is actually in this room
    await supabase
      .from('game_rooms')
      .update({
        status:      'finished',
        winner_id:   winnerId,
        finished_at: new Date().toISOString(),
      })
      .eq('id', roomId)
      .in('status', ['battling', 'drafting'])
      .or(`player_a_id.eq.${user.id},player_b_id.eq.${user.id}`)

    return new Response('ok')
  } catch {
    return new Response('error', { status: 500 })
  }
}
