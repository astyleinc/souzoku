'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'

type UserRole = 'seller' | 'buyer' | 'professional' | 'broker' | 'admin'

type RouteGuardProps = {
  allowedRoles: UserRole[]
  children: React.ReactNode
}

export const RouteGuard = ({ allowedRoles, children }: RouteGuardProps) => {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.replace('/login')
      return
    }

    if (!allowedRoles.includes(user.role)) {
      // ロールに応じたダッシュボードへリダイレクト
      const roleDashboard: Record<string, string> = {
        seller: '/seller',
        buyer: '/buyer',
        professional: '/professional',
        broker: '/broker',
        admin: '/admin',
      }
      router.replace(roleDashboard[user.role] ?? '/')
    }
  }, [user, isLoading, allowedRoles, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          <p className="text-sm text-neutral-400">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
