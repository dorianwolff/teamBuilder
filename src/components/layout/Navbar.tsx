'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Swords, BookOpen, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useAuth } from '@/hooks/useAuth'
import { formatElo } from '@/lib/utils/format'
import { getEloTier, ELO_TIER_COLORS } from '@/types/user'
import { createClient } from '@/lib/supabase/client'

const NAV_LINKS = [
  { href: '/lobby', label: 'Play',        icon: Swords },
  { href: '/encyclopedia', label: 'Encyclopedia', icon: BookOpen },
]

export function Navbar() {
  const pathname = usePathname()
  const router   = useRouter()
  const { user, profile } = useAuth()

  const tier  = profile ? getEloTier(profile.elo) : null
  const color = tier ? ELO_TIER_COLORS[tier] : '#6b7280'

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
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

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                  active
                    ? 'text-gold-400 bg-gold-500/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5',
                )}
              >
                <Icon size={14} />
                {label}
              </Link>
            )
          })}
        </div>

        {/* Auth / profile */}
        <div className="flex items-center gap-2">
          {user && profile ? (
            <>
              {/* ELO badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-void-800 border border-white/10">
                <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                <span className="text-xs font-mono font-bold" style={{ color }}>
                  {formatElo(profile.elo)}
                </span>
              </div>

              {/* Username */}
              <span className="text-sm text-white/70 hidden sm:block">{profile.username}</span>

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
                className="text-sm text-white/60 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="text-sm text-void-950 font-semibold px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 transition-colors"
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
