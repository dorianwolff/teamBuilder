'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Swords, User, AlertCircle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

export default function UsernamePage() {
  const router = useRouter()
  const { user, setProfile } = useAuth()
  const [username, setUsername] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (username.trim().length < 3) { setError('Username must be at least 3 characters'); return }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) { setError('Only letters, numbers and underscores'); return }

    setLoading(true)
    setError('')
    const supabase = createClient()

    const { data, error: err } = await supabase
      .from('profiles')
      .update({ username: username.trim() })
      .eq('id', user!.id)
      .select()
      .single()

    if (err) {
      setError(err.code === '23505' ? 'Username already taken' : err.message)
      setLoading(false)
    } else {
      if (data) setProfile(data as never)
      setSuccess(true)
      setTimeout(() => router.push('/lobby'), 1000)
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gold-glow mb-4">
            <Swords size={26} className="text-void-950" />
          </div>
          <h1 className="text-2xl font-bold text-white">Pick your name</h1>
          <p className="text-sm text-white/40 mt-1">This is how opponents will see you</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-crimson-600/10 border border-crimson-600/20 text-crimson-400 text-sm">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              <CheckCircle size={14} className="shrink-0" />
              Username set! Redirecting…
            </div>
          )}
          <div className="relative">
            <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              type="text"
              placeholder="LegendaryPicker"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
              maxLength={20}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-void-800 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-gold-500/50 transition-colors"
            />
          </div>
          <p className="text-xs text-white/30">3–20 characters · letters, numbers, underscores only</p>
          <Button type="submit" variant="gold" size="lg" fullWidth loading={loading} disabled={success}>
            Set Username
          </Button>
        </form>

        <button
          onClick={() => router.push('/lobby')}
          className="w-full text-center text-sm text-white/30 hover:text-white/50 mt-4 transition-colors"
        >
          Skip for now
        </button>
      </motion.div>
    </div>
  )
}
