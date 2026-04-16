'use client'

import {
  Search,
  Gavel,
  LayoutDashboard,
  Bell,
  Heart,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { mockProperties, PROPERTY_TYPE_LABEL } from '@/data/mock'

const navItems = [
  { icon: LayoutDashboard, label: 'ダッシュボード', href: '/buyer' },
  { icon: Search, label: '物件を探す', href: '/properties' },
  { icon: Gavel, label: '入札履歴', href: '/buyer/bids' },
  { icon: Heart, label: 'お気に入り', href: '/buyer/favorites' },
  { icon: Bell, label: '通知', href: '/buyer/notifications' },
]

export default function BuyerFavoritesPage() {
  const favorites = mockProperties.filter((p) =>
    p.status === 'bidding' || p.status === 'published'
  ).slice(0, 5)

  return (
    <DashboardShell
      title="お気に入り"
      roleLabel="買い手"
      userName="株式会社山本不動産"
      navItems={navItems}
    >
      <p className="text-sm text-neutral-400 mb-6">
        {favorites.length}件のお気に入り物件
      </p>

      <div className="space-y-3">
        {favorites.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl shadow-card p-4 sm:p-5 hover:shadow-dropdown transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              {/* サムネイル */}
              <div className="hidden sm:flex w-20 h-16 bg-neutral-100 rounded-xl items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-error-400" />
              </div>

              {/* 情報 */}
              <div className="flex-1 min-w-0">
                <Link href={`/properties/${p.id}`} className="hover:text-primary-500">
                  <p className="text-sm font-medium truncate">{p.title}</p>
                </Link>
                <p className="text-xs text-neutral-400 mt-0.5">{p.address}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-neutral-400">{PROPERTY_TYPE_LABEL[p.type]}</span>
                  <span className="text-xs text-neutral-400">{p.area}㎡</span>
                  <StatusBadge status={p.status} />
                </div>
              </div>

              {/* 価格 + アクション */}
              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
                <div className="text-right">
                  <p className="price text-sm">
                    {p.price.toLocaleString()}
                    <span className="text-xs font-normal text-neutral-400 ml-1">万円</span>
                  </p>
                  <p className="text-xs text-neutral-400">入札 {p.bidCount}件</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/properties/${p.id}`}
                    className="px-3.5 py-1.5 text-xs font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
                  >
                    入札する
                  </Link>
                  <button className="p-1.5 text-neutral-400 hover:text-error-500 hover:bg-error-50 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
