'use client'

import {
  Search,
  Gavel,
  LayoutDashboard,
  Bell,
  Heart,
  Building2,
  TrendingUp,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { mockProperties } from '@/data/mock'
import { mockBids, BID_STATUS_LABEL, mockNotifications } from '@/data/mock-dashboard'

const navItems = [
  { icon: LayoutDashboard, label: 'ダッシュボード', href: '/buyer' },
  { icon: Search, label: '物件を探す', href: '/properties' },
  { icon: Gavel, label: '入札履歴', href: '/buyer/bids' },
  { icon: Heart, label: 'お気に入り', href: '/buyer/favorites' },
  { icon: Bell, label: '通知', href: '/buyer/notifications' },
]

export default function BuyerDashboardPage() {
  const myBids = mockBids.filter((b) => b.bidderId === 'u10')
  const activeBids = myBids.filter((b) => b.status === 'active')

  return (
    <DashboardShell
      title="ダッシュボード"
      roleLabel="買い手"
      userName="株式会社山本不動産"
      navItems={navItems}
    >
      {/* サマリカード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Gavel, color: 'text-cta-500', bg: 'bg-cta-50', label: '入札中', value: String(activeBids.length) },
          { icon: Building2, color: 'text-success-500', bg: 'bg-success-50', label: '落札', value: String(myBids.filter((b) => b.status === 'selected').length) },
          { icon: Heart, color: 'text-error-500', bg: 'bg-error-50', label: 'お気に入り', value: '5' },
          { icon: TrendingUp, color: 'text-primary-500', bg: 'bg-primary-50', label: '新着物件（今週）', value: '3' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl shadow-card p-5">
            <div className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
              <card.icon className={`w-[18px] h-[18px] ${card.color}`} />
            </div>
            <p className="text-xs text-neutral-400 mb-1">{card.label}</p>
            <p className="price text-2xl text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 入札中の物件 + おすすめ */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-card">
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-base font-semibold">入札中の物件</h2>
              <Link href="/buyer/bids" className="text-sm text-neutral-400 hover:text-neutral-600 flex items-center gap-1">
                すべて <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-neutral-100">
              {activeBids.map((bid) => (
                <div key={bid.id} className="px-5 py-4 flex items-center justify-between hover:bg-neutral-50/50">
                  <div>
                    <p className="text-sm font-medium">{bid.propertyTitle}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">入札日: {bid.updatedAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="price text-sm">
                      {bid.amount.toLocaleString()}
                      <span className="text-xs font-normal text-neutral-400 ml-1">万円</span>
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-cta-50 text-cta-700">
                      {BID_STATUS_LABEL[bid.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* おすすめ物件 */}
          <div className="bg-white rounded-2xl shadow-card">
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-base font-semibold">おすすめ物件</h2>
              <Link href="/properties" className="text-sm text-neutral-400 hover:text-neutral-600 flex items-center gap-1">
                もっと見る <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-neutral-100">
              {mockProperties
                .filter((p) => p.status === 'bidding' || p.status === 'published')
                .slice(0, 3)
                .map((p) => (
                  <Link
                    key={p.id}
                    href={`/properties/${p.id}`}
                    className="block px-5 py-4 hover:bg-neutral-50/50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{p.title}</p>
                        <p className="text-xs text-neutral-400">{p.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="price text-sm">
                          {p.price.toLocaleString()}
                          <span className="text-xs font-normal text-neutral-400 ml-1">万円</span>
                        </p>
                        <p className="text-xs text-neutral-400">入札 {p.bidCount}件</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>

        {/* 通知 */}
        <div className="bg-white rounded-2xl shadow-card">
          <div className="px-5 py-4">
            <h2 className="text-base font-semibold">通知</h2>
          </div>
          <div className="px-5 pb-5 space-y-4">
            {mockNotifications.slice(0, 4).map((n) => (
              <div key={n.id} className={`flex items-start gap-3 ${n.isRead ? 'opacity-50' : ''}`}>
                <Bell className={`w-4 h-4 mt-0.5 shrink-0 ${
                  n.type === 'warning' ? 'text-warning-500' :
                  n.type === 'success' ? 'text-success-500' :
                  'text-info-500'
                }`} />
                <div>
                  <p className="text-sm leading-snug">{n.message}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{n.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
