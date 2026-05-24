'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import type { UserProfile } from '@/types/user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setLoading } = useAuthStore()

  useEffect(() => {
    const supabase = createClient()

    // Safety net: if auth never resolves (network issue, bad key, etc.)
    // unblock the UI after 4 seconds so the spinner doesn't hang forever.
    const safetyTimeout = setTimeout(() => setLoading(false), 4000)

    const fetchProfile = async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (data) setProfile(data as unknown as UserProfile)
    }

    // onAuthStateChange fires INITIAL_SESSION immediately when subscribed,
    // then SIGNED_IN / SIGNED_OUT / TOKEN_REFRESHED on subsequent changes.
    // try/finally guarantees setLoading(false) is always called.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        clearTimeout(safetyTimeout)
        setUser(session?.user ?? null)
        try {
          if (session?.user) {
            await fetchProfile(session.user.id)
          } else {
            setProfile(null)
          }
        } catch {
          // Profile fetch failed — still unblock the UI.
        } finally {
          setLoading(false)
        }
      },
    )

    return () => {
      clearTimeout(safetyTimeout)
      subscription.unsubscribe()
    }
  }, [setUser, setProfile, setLoading])

  return <>{children}</>
}
