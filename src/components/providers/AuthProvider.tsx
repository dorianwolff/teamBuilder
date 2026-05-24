'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import type { UserProfile } from '@/types/user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setLoading } = useAuthStore()

  useEffect(() => {
    const supabase = createClient()

    async function fetchProfile(userId: string) {
      console.log('[Auth] fetchProfile →', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('[Auth] profile fetch error:', error.message, '| code:', error.code)
        return
      }
      if (!data) {
        console.warn('[Auth] no profile row found for', userId)
        return
      }
      console.log('[Auth] profile loaded → username:', data.username, '| elo:', data.elo)
      setProfile(data as unknown as UserProfile)
    }

    async function initAuth() {
      console.log('[Auth] initializing...')
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) console.error('[Auth] getSession error:', error.message)
        console.log('[Auth] initial session:', session ? `uid=${session.user.id}` : 'null')

        setUser(session?.user ?? null)
        if (session?.user) await fetchProfile(session.user.id)
      } catch (err) {
        console.error('[Auth] unexpected error in initAuth:', err)
      } finally {
        setLoading(false)
        console.log('[Auth] loading = false')
      }
    }

    initAuth()

    // Handle sign-in / sign-out / token refresh AFTER the initial load
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // INITIAL_SESSION is already handled by initAuth above — skip to avoid double fetch
      if (event === 'INITIAL_SESSION') return

      console.log('[Auth] state change:', event, session ? `uid=${session.user.id}` : 'null')
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, setProfile, setLoading])

  return <>{children}</>
}
