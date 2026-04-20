'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Bell, Menu, User, LogOut, ChevronDown, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'

const roleDashboard: Record<string, { path: string; label: string }> = {
  seller: { path: '/seller', label: '売主ダッシュボード' },
  buyer: { path: '/buyer', label: '買い手ダッシュボード' },
  professional: { path: '/professional', label: '士業ダッシュボード' },
  broker: { path: '/broker', label: '業者ダッシュボード' },
  admin: { path: '/admin', label: '管理画面' },
}

const roleLabel: Record<string, string> = {
  seller: '売主',
  buyer: '買い手',
  professional: '士業',
  broker: '業者',
  admin: '管理者',
}

export const Header = () => {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    setMenuOpen(false)
    setMobileMenuOpen(false)
    await logout()
    router.push('/')
  }

  // メニュー外クリックで閉じる
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const dashboard = user ? roleDashboard[user.role] : null

  return (
    <header className="sticky top-0 z-50 bg-warm/90 backdrop-blur-md border-b border-black/5">
      <div className="max-w-[1260px] mx-auto px-5 md:px-9">
        <div className="flex items-center justify-between h-14">
          {/* ロゴ */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-[30px] h-[30px] bg-sage rounded-[7px] flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <span className="text-[17px] font-bold text-bark tracking-[-0.02em]">
              Ouver
              <span className="font-serif italic font-normal text-sage text-[19px]" aria-hidden>
                .
              </span>
            </span>
          </Link>

          {/* ナビゲーション（デスクトップ） */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/properties"
              className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              物件を探す
            </Link>
            {dashboard && (
              <Link
                href={dashboard.path}
                className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
              >
                {dashboard.label}
              </Link>
            )}
          </nav>

          {/* 右側アクション */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/properties')}
              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {!isLoading && user ? (
              <>
                {/* 通知 */}
                <Link
                  href={`/${user.role}/notifications`}
                  className="hidden md:flex p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cta-500 rounded-full" />
                </Link>

                {/* ユーザーメニュー（デスクトップ） */}
                <div className="hidden md:block relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-neutral-50 transition-colors"
                  >
                    <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-primary-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground leading-none">{user.name}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{roleLabel[user.role]}</p>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl border border-neutral-100 shadow-dropdown py-1 z-50">
                      {dashboard && (
                        <Link
                          href={dashboard.path}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-neutral-400" />
                          {dashboard.label}
                        </Link>
                      )}
                      <Link
                        href={`/${user.role}/notifications`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
                      >
                        <Bell className="w-4 h-4 text-neutral-400" />
                        通知
                      </Link>
                      <div className="border-t border-neutral-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-error-500 hover:bg-error-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        ログアウト
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : !isLoading ? (
              <>
                {/* 未ログイン */}
                <Link
                  href="/login"
                  className="hidden md:inline-flex text-sm text-neutral-500 hover:text-neutral-800 transition-colors px-3 py-2"
                >
                  ログイン
                </Link>
                <Link
                  href="/register"
                  className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
                >
                  無料で始める
                </Link>
              </>
            ) : null}

            {/* モバイルメニューボタン */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-400 hover:bg-neutral-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-100 py-3 space-y-1">
            <Link
              href="/properties"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 rounded-xl"
            >
              物件を探す
            </Link>
            {dashboard && (
              <Link
                href={dashboard.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 rounded-xl"
              >
                {dashboard.label}
              </Link>
            )}

            {!isLoading && user ? (
              <>
                <Link
                  href={`/${user.role}/notifications`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 rounded-xl"
                >
                  通知
                </Link>
                <div className="border-t border-neutral-100 my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 text-sm text-error-500 hover:bg-error-50 rounded-xl"
                >
                  ログアウト
                </button>
              </>
            ) : !isLoading ? (
              <div className="flex gap-3 px-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-sm text-neutral-600 border border-neutral-200 rounded-xl"
                >
                  ログイン
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl"
                >
                  無料で始める
                </Link>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </header>
  )
}
