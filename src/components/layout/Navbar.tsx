'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Swords, BookOpen, LogOut, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useAuth } from '@/hooks/useAuth'
import { formatElo } from '@/lib/utils/format'
import { getEloTier, ELO_TIER_COLORS } from '@/types/user'
import { createClient } from '@/lib/supabase/client'

const NAV_LINKS = [
  { href: '/lobby',        label: 'Play',         icon: Swords   },
  { href: '/leaderboard',  label: 'Leaderboard',  icon: Trophy   },
  { href: '/encyclopedia', label: 'Encyclopedia', icon: BookOpen },
]

export function Navbar() {
  const pathname = usePathname()
  const router   = useRouter()
  const { user, profile } = useAuth()

  const tier  = profile ? getEloTier(profile.elo) : null
  const color = tier ? ELO_TIER_COLORS[tier] : '#6b7280'

  function handleSignOut() {
    const supabase = createClient()
    supabase.auth.signOut() // fire-and-forget — don't await, redirect immediately
    router.push('/')
    router.refresh()
  }

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-white/5 bg-void-950/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-gold-glow">
            <Swords size={16} className="text-void-950" />
          </div>
          <span className="font-bold text-white text-sm hidden sm:block tracking-wide">
            TEAM<span className="text-gold-400">BUILDER</span>
          </span>
        </Link>

        {/* Nav links — icon-only on mobile, icon + label on sm+ */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm transition-colors',
                  active
                    ? 'text-gold-400 bg-gold-500/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5',
                )}
              >
                <Icon size={14} className="shrink-0" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            )
          })}
        </div>

        {/* Auth / profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {user && profile ? (
            <>
              {/* ELO badge — always visible; slightly condensed on mobile */}
              <div className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1 rounded-lg bg-void-800 border border-white/10">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                <span className="text-[10px] sm:text-xs font-mono font-bold" style={{ color }}>
                  {formatElo(profile.elo)}
                </span>
              </div>

              {/* Username — hidden on mobile */}
              <span className="text-sm text-white/70 hidden sm:block truncate max-w-[100px]">
                {profile.username}
              </span>

              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-white/60 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span className="hidden sm:inline">Log in</span>
                <span className="sm:hidden text-xs">Login</span>
              </Link>
              <Link
                href="/register"
                className="text-xs sm:text-sm text-void-950 font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
