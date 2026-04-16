'use client'

import { useState } from 'react'
import { Bug, X, ChevronUp } from 'lucide-react'

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
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<DevUser | null>(null)

  // 本番では表示しない
  if (process.env.NODE_ENV === 'production') return null

  const handleSwitch = (user: DevUser) => {
    setCurrentUser(user)
    // ローカルストレージに保存（他のコンポーネントから参照可能）
    localStorage.setItem('dev-auth-user', JSON.stringify(user))
    window.dispatchEvent(new CustomEvent('dev-auth-change', { detail: user }))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('dev-auth-user')
    window.dispatchEvent(new CustomEvent('dev-auth-change', { detail: null }))
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {/* パネル */}
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
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${roleColor[currentUser.role]}`} />
                  <span className="text-sm font-medium">{currentUser.name}</span>
                  <span className="text-[10px] text-muted-foreground">({currentUser.label})</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-[10px] text-error-500 hover:underline"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">未ログイン</p>
            )}
          </div>

          {/* ユーザー一覧 */}
          <div className="p-2">
            {devUsers.map((user) => {
              const isActive = currentUser?.id === user.id
              return (
                <button
                  key={user.id}
                  onClick={() => handleSwitch(user)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-radius-md text-left transition-colors ${
                    isActive
                      ? 'bg-primary-50 border border-primary-200'
                      : 'hover:bg-neutral-50'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${roleColor[user.role]}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{user.name}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {user.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                  </div>
                  {isActive && (
                    <span className="text-[10px] text-primary-500 font-medium shrink-0">選択中</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* ダッシュボードへのリンク */}
          {currentUser && (
            <div className="px-4 py-2.5 border-t border-border bg-neutral-50">
              <a
                href={roleDashboard[currentUser.role]}
                className="text-xs text-primary-500 hover:underline"
              >
                {currentUser.label}ダッシュボードへ移動 →
              </a>
            </div>
          )}
        </div>
      )}

      {/* トグルボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-dropdown transition-all ${
          currentUser
            ? `${roleColor[currentUser.role]} text-white`
            : 'bg-neutral-900 text-white'
        }`}
      >
        <Bug className="w-4 h-4" />
        <span className="text-xs font-medium">
          {currentUser ? `${currentUser.label}: ${currentUser.name}` : 'DEV'}
        </span>
        <ChevronUp className={`w-3.5 h-3.5 transition-transform ${isOpen ? '' : 'rotate-180'}`} />
      </button>
    </div>
  )
}
