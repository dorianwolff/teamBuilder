import Link from 'next/link'
import { Swords, Users, Trophy, BookOpen, ChevronRight, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">

      {/* ── Background ─────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Radial glow top-center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gold-500/5 rounded-full blur-3xl" />
        {/* Bottom right glow */}
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-crimson-600/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-4 pt-24 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 text-xs font-medium mb-8">
          <Zap size={12} />
          Ranked Season 1 · Now Live
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6">
          Draft. Strategize.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
            Dominate.
          </span>
        </h1>

        <p className="text-lg text-white/50 max-w-xl mx-auto mb-10">
          Pick anime characters from a hidden pool, build the ultimate team, and battle your opponent
          head-to-head in a clash of power levels, strengths, and weaknesses.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-400 text-void-950 font-bold text-base hover:from-gold-500 hover:to-gold-300 transition-all shadow-gold-glow hover:shadow-gold-glow active:scale-[0.98]"
          >
            Play Now
            <ChevronRight size={18} />
          </Link>
          <Link
            href="/encyclopedia"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-base"
          >
            <BookOpen size={16} />
            Encyclopedia
          </Link>
        </div>

        {/* Verse badges */}
        <div className="flex items-center justify-center gap-3 mt-12 flex-wrap">
          {[
            { label: 'One Piece',     color: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/10' },
            { label: 'Naruto',        color: 'text-amber-400',  border: 'border-amber-500/30',  bg: 'bg-amber-500/10' },
            { label: 'Dragon Ball',   color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
            { label: 'Hunter x Hunter', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
          ].map(({ label, color, border, bg }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${color} ${border} ${bg}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* ── How it Works ───────────────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-center text-2xl font-bold text-white mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Draft Phase',
              desc: 'Take turns picking 5 characters from a pool of revealed and masked cards. Hidden picks are revealed only to their new owner — intel warfare.',
              icon: Swords,
              color: 'text-gold-400',
            },
            {
              step: '02',
              title: 'Battle Phase',
              desc: 'Each round, simultaneously pick one of your remaining characters to fight. Power levels, elemental strengths, and weaknesses all factor in.',
              icon: Zap,
              color: 'text-crimson-400',
            },
            {
              step: '03',
              title: 'Win the Match',
              desc: 'First player to win 3 rounds takes the match. Climb the ELO ladder and unlock higher-stakes verses as you dominate the rankings.',
              icon: Trophy,
              color: 'text-amber-400',
            },
          ].map(({ step, title, desc, icon: Icon, color }) => (
            <div
              key={step}
              className="relative p-6 rounded-2xl bg-void-800 border border-white/8 hover:border-white/15 transition-colors group"
            >
              <div className="text-[10px] font-mono text-white/20 mb-3 tracking-widest">STEP {step}</div>
              <div className={`mb-3 ${color}`}>
                <Icon size={24} />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
              {/* Hover shimmer */}
              <div className="absolute inset-0 rounded-2xl bg-shimmer-gradient bg-[length:200%_100%] group-hover:animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Game Mode CTA ──────────────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Ranked */}
          <div className="relative p-8 rounded-2xl bg-gradient-to-br from-gold-500/10 to-void-800 border border-gold-500/20 overflow-hidden group">
            <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] group-hover:animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <Trophy size={28} className="text-gold-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Ranked</h3>
            <p className="text-sm text-white/50 mb-6 leading-relaxed">
              Compete for ELO. The verse is assigned — no cherry-picking. Unlock harder verses
              as you climb and face opponents who&apos;ve mastered the meta.
            </p>
            <Link
              href="/lobby?mode=ranked"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-void-950 font-semibold text-sm transition-colors"
            >
              Find Match <ChevronRight size={16} />
            </Link>
          </div>

          {/* Casual */}
          <div className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-void-800 border border-blue-500/20 overflow-hidden group">
            <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] group-hover:animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <Users size={28} className="text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">With Friends</h3>
            <p className="text-sm text-white/50 mb-6 leading-relaxed">
              Create a private room, share a 6-character code with a friend, choose any verse
              including All Verses mode. No ELO on the line — pure fun.
            </p>
            <Link
              href="/lobby?mode=casual"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
            >
              Create Room <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ────────────────────────────────────────────────────── */}
      <section className="relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: '84+',    label: 'Characters' },
            { value: '4',      label: 'Verses' },
            { value: '1v1',    label: 'Format' },
            { value: '∞',      label: 'Combinations' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-black text-gold-400 mb-1">{value}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
