export function formatPowerLevel(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(3)}B`
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(3)}M`
  if (n >= 1_000)         return `${(n / 1_000).toFixed(3)}K`
  return n.toFixed(2)
}

export function formatElo(elo: number): string {
  return elo.toLocaleString()
}

export function formatEloDelta(delta: number): string {
  return delta >= 0 ? `+${delta}` : `${delta}`
}

export function formatWinRate(won: number, played: number): string {
  if (played === 0) return '—'
  return `${Math.round((won / played) * 100)}%`
}

export function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1)  return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24)   return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
