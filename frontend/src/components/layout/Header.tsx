import Link from 'next/link'
import { Search, Bell, Menu } from 'lucide-react'

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ（控えめ） */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">O</span>
            </div>
            <span className="text-sm font-semibold text-foreground">相続不動産マッチング</span>
          </Link>

          {/* ナビゲーション（デスクトップ） */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/properties"
              className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              物件を探す
            </Link>
            <Link
              href="/#features"
              className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              サービスについて
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              ご利用の流れ
            </Link>
          </nav>

          {/* 右側アクション */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="hidden md:flex p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cta-500 rounded-full" />
            </button>
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
            <button className="md:hidden p-2 text-neutral-400 hover:bg-neutral-100 rounded-xl">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
