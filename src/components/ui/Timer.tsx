'use client'

import { cn } from '@/lib/utils/cn'
import { useCountdown } from '@/hooks/useTimer'

interface TimerProps {
  endsAt: string | null
  totalSeconds: number
  className?: string
  showBar?: boolean
  urgentThreshold?: number  // seconds below which it goes red
}

export function Timer({
  endsAt,
  totalSeconds,
  className,
  showBar = true,
  urgentThreshold = 10,
}: TimerProps) {
  const remaining = useCountdown(endsAt)
  const pct = totalSeconds > 0 ? (remaining / totalSeconds) * 100 : 0
  const isUrgent = remaining <= urgentThreshold && remaining > 0

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div className={cn(
        'font-mono text-2xl font-bold tabular-nums transition-colors',
        isUrgent ? 'text-crimson-400 animate-pulse' : 'text-gold-400',
      )}>
        {remaining}
      </div>

      {showBar && (
        <div className="w-full h-1.5 bg-void-800 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-200',
              isUrgent ? 'bg-crimson-500' : 'bg-gold-500',
            )}
            style={{ width: `${Math.max(0, pct)}%` }}
          />
        </div>
      )}
    </div>
  )
}
