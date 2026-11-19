// Mock session: who is logged in, and whether they're a student or an alum.
//
//   const { user, isStudent, isAlumni, login, logout } = useSession()
//
// `user` is null when logged out. `loading` is true only during the first
// check on page load.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as api from '../api'
import { ROLES } from '../constants'

const SessionContext = createContext(null)

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const current = await api.getCurrentUser()
    setUser(current)
    return current
  }, [])

  useEffect(() => {
    let active = true
    api.getCurrentUser().then((current) => {
      if (!active) return
      setUser(current)
      setLoading(false)
    })
    // Keep `user` fresh when anything edits it (profile edits, onboarding, reset).
    const unsubscribe = api.subscribe(() => {
      api.getCurrentUser().then((current) => active && setUser(current))
    })
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isLoggedIn: Boolean(user),
      isStudent: user?.role === ROLES.STUDENT,
      isAlumni: user?.role === ROLES.ALUMNI,
      refreshUser,
      login: async (email, password) => {
        const u = await api.login(email, password)
        setUser(u)
        return u
      },
      signup: async (input) => {
        const u = await api.signup(input)
        setUser(u)
        return u
      },
      logout: async () => {
        await api.logout()
        setUser(null)
      },
      /** DEV ONLY: switch to any user without a password. */
      switchUser: async (userId) => {
        const u = await api.devLoginAs(userId)
        setUser(u)
        return u
      },
    }),
    [user, loading, refreshUser],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>')
  return ctx
}
