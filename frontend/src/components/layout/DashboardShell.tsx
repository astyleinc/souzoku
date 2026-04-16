'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, LogOut, Menu, X, Search, ExternalLink, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/providers/AuthProvider'

type NavItem = {
  icon: LucideIcon
  label: string
  href: string
}

type DashboardShellProps = {
  children: React.ReactNode
  title: string
  roleLabel: string
  navItems: NavItem[]
}

export const DashboardShell = ({
  children,
  title,
  roleLabel,
  navItems,
}: DashboardShellProps) => {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()

  const userName = user?.name ?? ''

  const isActive = (href: string) => {
    if (href === pathname) return true
    if (href !== navItems[0]?.href && pathname.startsWith(href)) return true
    return false
  }

  const sidebarContent = (
    <>
      <div className="px-5 py-5">
        <Link href="/" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
          <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">O</span>
          </div>
          <span className="text-xs font-medium text-neutral-400 tracking-wide">{roleLabel}</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item, idx) => {
          const dashboardPrefix = navItems[0]?.href ?? '/'
          const isExternal = !item.href.startsWith(dashboardPrefix) && item.href !== dashboardPrefix
          const prevItem = navItems[idx - 1]
          const prevIsExternal = prevItem
            ? !prevItem.href.startsWith(dashboardPrefix) && prevItem.href !== dashboardPrefix
            : false
          const showDividerBefore = idx > 0 && isExternal !== prevIsExternal

          return (
            <span key={item.href}>
              {showDividerBefore && (
                <div className="border-t border-neutral-100 my-2 mx-1" />
              )}
              <Link
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive(item.href)
                    ? 'bg-primary-500 text-white font-medium shadow-sm'
                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800'
                }`}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                {item.label}
                {isExternal && (
                  <ExternalLink className="w-3 h-3 ml-auto shrink-0 opacity-40" />
                )}
              </Link>
            </span>
          )
        })}
      </nav>

      <div className="px-4 py-4 mx-3 mb-3 bg-neutral-50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-secondary-100 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xs font-medium text-secondary-700">
              {userName.slice(0, 2)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-neutral-400">{roleLabel}</p>
          </div>
          <button
            onClick={logout}
            title="ログアウト"
            className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* モバイルオーバーレイ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* サイドナビ */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white flex flex-col shrink-0
          shadow-[1px_0_0_0_rgba(0,0,0,0.04)] transition-transform duration-200 ease-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-3 p-1.5 text-neutral-400 hover:text-neutral-600 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white/80 backdrop-blur-md border-b border-neutral-100 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/properties"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">物件を探す</span>
              <ExternalLink className="w-3 h-3 opacity-40 hidden sm:block" />
            </Link>
            <button className="relative p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cta-500 rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
