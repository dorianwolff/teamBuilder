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

    // Use onAuthStateChange exclusively — it fires INITIAL_SESSION synchronously
    // from cookie storage without any network call, avoiding hangs.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth] event:', event, session ? `uid=${session.user.id}` : 'null')
      setUser(session?.user ?? null)

      try {
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
      } catch (err) {
        console.error('[Auth] unexpected error:', err)
      } finally {
        if (event === 'INITIAL_SESSION') {
          setLoading(false)
          console.log('[Auth] loading = false')
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, setProfile, setLoading])

  return <>{children}</>
}
