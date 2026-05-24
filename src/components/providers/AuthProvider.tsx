'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import type { UserProfile } from '@/types/user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setLoading } = useAuthStore()

  useEffect(() => {
    const supabase = createClient()

    const fetchProfile = async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (data) setProfile(data as unknown as UserProfile)
    }

    // onAuthStateChange fires INITIAL_SESSION immediately (synchronous-ish),
    // then SIGNED_IN / SIGNED_OUT / TOKEN_REFRESHED on subsequent changes.
    // We use try/finally so setLoading(false) is always called even if
    // the profile network request fails (e.g. wrong API key during dev).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        try {
          if (session?.user) {
            await fetchProfile(session.user.id)
          } else {
            setProfile(null)
          }
        } catch {
          // Profile fetch failed (network error, wrong key, etc.)
          // Still unblock the UI so the spinner doesn't spin forever.
        } finally {
          setLoading(false)
        }
      },
    )

    return () => subscription.unsubscribe()
  }, [setUser, setProfile, setLoading])

  return <>{children}</>
}
