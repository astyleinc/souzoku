'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

type UserRole = 'seller' | 'buyer' | 'professional' | 'broker' | 'admin'

type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
}

type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refresh: () => Promise<AuthUser | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth は AuthProvider 内で使用してください')
  return ctx
}

const setRoleCookie = (role: string | null) => {
  if (role) {
    document.cookie = `user-role=${role};path=/;max-age=${60 * 60 * 24 * 30};SameSite=Lax`
  } else {
    document.cookie = 'user-role=;path=/;max-age=0'
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const res = await fetch('/api/auth/get-session', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        if (data?.user) {
          const authUser: AuthUser = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role ?? 'buyer',
          }
          setUser(authUser)
          setRoleCookie(authUser.role)
          return authUser
        }
      }
    } catch {
      // APIが到達不能の場合
    }
    // セッション取得失敗時は未認証として扱う
    setUser(null)
    setRoleCookie(null)
    return null
  }, [])

  useEffect(() => {
    refresh().finally(() => setIsLoading(false))
  }, [refresh])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        return { success: false, error: data?.message ?? 'ログインに失敗しました' }
      }
      if (data?.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role ?? 'buyer',
        }
        setUser(authUser)
        setRoleCookie(authUser.role)
        window.dispatchEvent(new CustomEvent('dev-auth-change', { detail: authUser }))
      } else {
        await refresh()
      }
      return { success: true }
    } catch {
      return { success: false, error: 'ネットワークエラー' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/sign-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
    } catch {
      // 無視
    }
    setUser(null)
    setRoleCookie(null)
    window.dispatchEvent(new CustomEvent('dev-auth-change', { detail: null }))
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}
