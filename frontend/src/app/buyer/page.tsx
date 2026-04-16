'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Gavel,
  Heart,
  Building2,
  Bell,
  TrendingUp,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { OnboardingChecklist } from '@/components/shared/OnboardingChecklist'
import { buyerNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'
import { toProperty } from '@/lib/mappers'
import type { ApiProperty } from '@/lib/mappers'
import type { Notification, ApiNotification } from '@/types/dashboard'
import { toNotification } from '@/types/dashboard'
import { BID_STATUS_LABEL } from '@/data/mock-dashboard'
import type { BidStatus } from '@/data/mock-dashboard'

type ApiBid = {
  id: string
  propertyId: string
  amount: number
  status: string
  createdAt: string
  updatedAt: string
}

export default function BuyerDashboardPage() {
  const [properties, setProperties] = useState<ReturnType<typeof toProperty>[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [favCount, setFavCount] = useState(0)
  const [biddingCount, setBiddingCount] = useState(0)
  const [wonCount, setWonCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [propRes, notifRes, favRes, bidRes] = await Promise.all([
        api.get<unknown>('/properties?limit=6'),
        api.get<unknown>('/notifications?limit=5'),
        api.get<{ items?: unknown[]; total?: number }>('/users/me/favorites?limit=1'),
        api.get<unknown>('/bids/me'),
      ])

      if (propRes.success) {
        setProperties(toItems<ApiProperty>(propRes.data).map(toProperty))
      }
      if (notifRes.success) {
        setNotifications(toItems<ApiNotification>(notifRes.data).map(toNotification))
      }
      if (favRes.success) {
        setFavCount(favRes.data.total ?? 0)
      }
      if (bidRes.success) {
        const bids = toItems<ApiBid>(bidRes.data)
        setBiddingCount(bids.filter((b) => b.status === 'active').length)
        setWonCount(bids.filter((b) => b.status === 'accepted' || b.status === 'won').length)
      }
      if (!propRes.success && !notifRes.success) {
        setFetchError(true)
      }
      setLoading(false)
    }
    load()
  }, [])

  const recommendedProps = properties.filter((p) => p.status === 'bidding' || p.status === 'published').slice(0, 3)

  return (
    <DashboardShell
      title="ダッシュボード"
      roleLabel="買い手"
      navItems={buyerNav}
    >
      <OnboardingChecklist
        items={[
          { label: 'プロフィールを完成させる', href: '/buyer/settings', completed: true },
          { label: '物件を検索してみる', href: '/properties', completed: true },
          { label: 'お気に入りに登録する', href: '/properties', completed: favCount > 0 },
          { label: '最初の入札をする', href: '/properties', completed: false },
        ]}
      />

      {/* サマリカード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Gavel, color: 'text-cta-500', bg: 'bg-cta-50', label: '入札中', value: String(biddingCount) },
          { icon: Building2, color: 'text-success-500', bg: 'bg-success-50', label: '落札', value: String(wonCount) },
          { icon: Heart, color: 'text-error-500', bg: 'bg-error-50', label: 'お気に入り', value: String(favCount) },
          { icon: TrendingUp, color: 'text-primary-500', bg: 'bg-primary-50', label: '公開中の物件', value: String(properties.length) },
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

      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-error-700 bg-error-50 rounded-xl">
          <Search className="w-4 h-4 shrink-0" />
          データの取得に失敗しました。ネットワーク接続を確認し、ページを更新してください。
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {/* おすすめ物件 */}
            <div className="bg-white rounded-2xl shadow-card">
              <div className="flex items-center justify-between px-5 py-4">
                <h2 className="text-base font-semibold">おすすめ物件</h2>
                <Link href="/properties" className="text-sm text-neutral-400 hover:text-neutral-600 flex items-center gap-1">
                  もっと見る <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-neutral-100">
                {recommendedProps.length === 0 ? (
                  <div className="px-5 pb-8 text-center">
                    <Building2 className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
                    <p className="text-sm text-neutral-400">現在公開中の物件はありません</p>
                  </div>
                ) : (
                  recommendedProps.map((p) => (
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
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 通知 */}
          <div className="bg-white rounded-2xl shadow-card">
            <div className="px-5 py-4">
              <h2 className="text-base font-semibold">通知</h2>
            </div>
            <div className="px-5 pb-5 space-y-4">
              {notifications.length === 0 ? (
                <div className="py-4 text-center">
                  <Bell className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
                  <p className="text-sm text-neutral-400">通知はありません</p>
                </div>
              ) : (
                notifications.slice(0, 4).map((n) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
