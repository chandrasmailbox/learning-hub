import { useState, useEffect } from 'react'
import { blink } from '../lib/blink'
import type { BlinkUser } from '@blinkdotnew/sdk'

export function useAuth() {
  const [user, setUser] = useState<BlinkUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login: (email: string, pass: string) => blink.auth.signInWithEmail(email, pass),
    logout: () => blink.auth.signOut(),
    signUp: (email: string, pass: string, metadata: any) => blink.auth.signUp({ email, password: pass, metadata }),
  }
}
