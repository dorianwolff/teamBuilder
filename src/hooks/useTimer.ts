'use client'

import { useEffect, useState } from 'react'

export function useCountdown(endsAt: string | null): number {
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    if (!endsAt) { setRemaining(0); return }

    const tick = () => {
      const diff = Math.max(0, new Date(endsAt).getTime() - Date.now())
      setRemaining(Math.ceil(diff / 1000))
    }
    tick()
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [endsAt])

  return remaining
}
