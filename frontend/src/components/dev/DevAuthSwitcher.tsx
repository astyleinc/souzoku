'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bug, X, ChevronUp, Loader2 } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'

type DevUser = {
  id: string
  name: string
  email: string
  role: 'seller' | 'buyer' | 'professional' | 'broker' | 'admin'
  label: string
}

const devUsers: DevUser[] = [
  { id: 'u1', name: '中村 一郎', email: 'nakamura@example.com', role: 'seller', label: '売主' },
  { id: 'u10', name: '株式会社山本不動産', email: 'yamamoto@example.com', role: 'buyer', label: '買い手' },
  { id: 'u20', name: '山田 太郎', email: 'yamada@example.com', role: 'professional', label: '士業' },
  { id: 'u30', name: '松本 大輝', email: 'matsumoto@example.com', role: 'broker', label: '業者' },
  { id: 'u99', name: '田中 太郎', email: 'admin@ouver.jp', role: 'admin', label: '管理者' },
]

const DEV_PASSWORD = 'password123'

const roleColor: Record<string, string> = {
  seller: 'bg-primary-500',
  buyer: 'bg-cta-500',
  professional: 'bg-secondary-500',
  broker: 'bg-info-500',
  admin: 'bg-neutral-700',
}

const roleDashboard: Record<string, string> = {
  seller: '/seller',
  buyer: '/buyer',
  professional: '/professional',
  broker: '/broker',
  admin: '/admin',
}

export const DevAuthSwitcher = () => {
  const router = useRouter()
  const { user, isLoading, login, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [switching, setSwitching] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted || process.env.NODE_ENV === 'production') return null

  const currentDevUser = user
    ? devUsers.find((u) => u.email === user.email) ?? null
    : null

  const handleSwitch = async (devUser: DevUser) => {
    setError(null)
    setSwitching(devUser.id)
    try {
      // 既にログイン中なら先にログアウト
      if (user) {
        await logout()
      }
      const result = await login(devUser.email, DEV_PASSWORD)
      if (result.success) {
        router.push(roleDashboard[devUser.role])
      } else {
        setError(result.error ?? 'ログイン失敗')
      }
    } finally {
      setSwitching(null)
    }
  }

  const handleLogout = async () => {
    setError(null)
    setSwitching('logout')
    try {
      await logout()
      router.push('/')
    } finally {
      setSwitching(null)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {isOpen && (
        <div className="mb-2 w-72 bg-white rounded-radius-lg border border-border shadow-modal overflow-hidden">
          {/* ヘッダー */}
          <div className="bg-neutral-900 text-white px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide">DEV AUTH SWITCHER</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-0.5 hover:bg-white/10 rounded">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 現在のユーザー */}
          <div className="px-4 py-3 border-b border-border bg-neutral-50">
            <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              ログイン中
            </p>
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                確認中...
              </div>
            ) : currentDevUser ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${roleColor[currentDevUser.role]}`} />
                  <span className="text-sm font-medium">{currentDevUser.name}</span>
                  <span className="text-[10px] text-muted-foreground">({currentDevUser.label})</span>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={switching !== null}
                  className="text-[10px] text-error-500 hover:underline disabled:opacity-50"
                >
                  ログアウト
                </button>
              </div>
            ) : user ? (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{user.name}</span>
                <button
                  onClick={handleLogout}
                  disabled={switching !== null}
                  className="text-[10px] text-error-500 hover:underline disabled:opacity-50"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">未ログイン</p>
            )}
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="px-4 py-2 bg-error-50 text-error-600 text-xs">
              {error}
            </div>
          )}

          {/* ユーザー一覧 */}
          <div className="p-2">
            {devUsers.map((devUser) => {
              const isActive = user?.email === devUser.email
              const isSwitching = switching === devUser.id
              return (
                <button
                  key={devUser.id}
                  onClick={() => handleSwitch(devUser)}
                  disabled={switching !== null}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-radius-md text-left transition-colors disabled:opacity-60 ${
                    isActive
                      ? 'bg-primary-50 border border-primary-200'
                      : 'hover:bg-neutral-50'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${roleColor[devUser.role]}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{devUser.name}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {devUser.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{devUser.email}</p>
                  </div>
                  {isSwitching ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400 shrink-0" />
                  ) : isActive ? (
                    <span className="text-[10px] text-primary-500 font-medium shrink-0">選択中</span>
                  ) : null}
                </button>
              )
            })}
          </div>

          {/* ダッシュボードへのリンク */}
          {currentDevUser && (
            <div className="px-4 py-2.5 border-t border-border bg-neutral-50">
              <a
                href={roleDashboard[currentDevUser.role]}
                className="text-xs text-primary-500 hover:underline"
              >
                {currentDevUser.label}ダッシュボードへ移動 →
              </a>
            </div>
          )}
        </div>
      )}

      {/* トグルボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-dropdown transition-all ${
          currentDevUser
            ? `${roleColor[currentDevUser.role]} text-white`
            : 'bg-neutral-900 text-white'
        }`}
      >
        <Bug className="w-4 h-4" />
        <span className="text-xs font-medium">
          {currentDevUser ? `${currentDevUser.label}: ${currentDevUser.name}` : user ? user.name : 'DEV'}
        </span>
        <ChevronUp className={`w-3.5 h-3.5 transition-transform ${isOpen ? '' : 'rotate-180'}`} />
      </button>
    </div>
  )
}
