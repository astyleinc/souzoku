'use client'

import { useState, useEffect } from 'react'
import {
  Building2,
  Gavel,
  FileText,
  Bell,
  Plus,
  TrendingUp,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { NotificationList } from '@/components/shared/NotificationList'
import { SummaryCard } from '@/components/shared/SummaryCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { OnboardingChecklist } from '@/components/shared/OnboardingChecklist'
import { sellerNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'
import { useAuth } from '@/providers/AuthProvider'
import { toProperty } from '@/lib/mappers'
import type { ApiProperty } from '@/lib/mappers'
import type { Notification, ApiNotification } from '@/types/dashboard'
import { toNotification } from '@/types/dashboard'

export default function SellerDashboardPage() {
  const { user } = useAuth()
  const [properties, setProperties] = useState<ReturnType<typeof toProperty>[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [propRes, notifRes] = await Promise.all([
        api.get<unknown>(`/properties?includeAll=true&limit=4`),
        api.get<unknown>('/notifications?limit=5'),
      ])

      if (propRes.success) {
        setProperties(toItems<ApiProperty>(propRes.data).map(toProperty))
      }
      if (notifRes.success) {
        setNotifications(toItems<ApiNotification>(notifRes.data).map(toNotification))
      }
      if (!propRes.success && !notifRes.success) {
        setFetchError(true)
      }
      setLoading(false)
    }
    load()
  }, [])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <DashboardShell
      title="ダッシュボード"
      roleLabel="売主"
      navItems={sellerNav}
    >
      <OnboardingChecklist
        items={[
          { label: 'プロフィールを完成させる', href: '/seller/settings', completed: true },
          { label: '本人確認書類をアップロード', href: '/seller/documents', completed: true },
          { label: '最初の物件を登録する', href: '/seller/properties/new', completed: properties.length > 0 },
          { label: '通知設定を確認する', href: '/seller/settings', completed: false },
        ]}
      />

      {/* サマリカード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard icon={Building2} iconColor="text-primary-500" iconBg="bg-primary-50" label="出品物件" value={String(properties.length)} sub={`公開中 ${properties.filter((p) => p.status === 'published' || p.status === 'bidding').length}`} />
        <SummaryCard icon={Gavel} iconColor="text-cta-500" iconBg="bg-cta-50" label="受付中の入札" value={String(properties.reduce((s, p) => s + p.bidCount, 0))} />
        <SummaryCard icon={Building2} iconColor="text-success-500" iconBg="bg-success-50" label="成約済み" value={String(properties.filter((p) => p.status === 'closed').length)} />
        <SummaryCard icon={Bell} iconColor="text-warning-500" iconBg="bg-warning-50" label="未読通知" value={String(unreadCount)} />
      </div>

      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-error-700 bg-error-50 rounded-xl">
          <Building2 className="w-4 h-4 shrink-0" />
          データの取得に失敗しました。ネットワーク接続を確認し、ページを更新してください。
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* 出品物件 */}
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-card">
              <div className="flex items-center justify-between px-5 py-4">
                <h2 className="text-base font-semibold">出品物件</h2>
                <div className="flex items-center gap-3">
                  <Link href="/seller/properties" className="text-sm text-neutral-400 hover:text-neutral-600 flex items-center gap-1">
                    すべて <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/seller/properties/new"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    新規出品
                  </Link>
                </div>
              </div>

              {properties.length === 0 ? (
                <div className="px-5 pb-8 text-center">
                  <Building2 className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
                  <p className="text-sm text-neutral-400">まだ物件がありません</p>
                </div>
              ) : (
                <>
                  {/* PC: テーブル */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-t border-neutral-100">
                          <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">物件名</th>
                          <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">価格</th>
                          <th className="text-center py-3 px-5 text-xs text-neutral-400 font-medium">入札数</th>
                          <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                        </tr>
                      </thead>
                      <tbody>
                        {properties.map((p) => (
                          <tr key={p.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                            <td className="py-3.5 px-5">
                              <Link href={`/seller/properties/${p.id}`} className="hover:text-primary-500">
                                <p className="font-medium truncate max-w-[240px]">{p.title}</p>
                                <p className="text-xs text-neutral-400">{p.address}</p>
                              </Link>
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              <span className="price">{p.price.toLocaleString()}</span>
                              <span className="text-xs text-neutral-400 ml-1">万円</span>
                            </td>
                            <td className="py-3.5 px-5 text-center">
                              <span className="price">{p.bidCount}</span>
                            </td>
                            <td className="py-3.5 px-5">
                              <StatusBadge status={p.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* モバイル向けカードリスト */}
                  <div className="sm:hidden divide-y divide-neutral-100">
                    {properties.map((p) => (
                      <Link key={p.id} href={`/seller/properties/${p.id}`} className="block px-5 py-4 hover:bg-neutral-50/50">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{p.title}</p>
                            <p className="text-xs text-neutral-400 mt-0.5">{p.address}</p>
                          </div>
                          <StatusBadge status={p.status} />
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm"><span className="price">{p.price.toLocaleString()}</span><span className="text-xs text-neutral-400 ml-1">万円</span></span>
                          <span className="text-xs text-neutral-400">入札 {p.bidCount}件</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 右カラム */}
          <div className="space-y-6">
            {/* 通知 */}
            <div className="bg-white rounded-2xl shadow-card">
              <div className="flex items-center justify-between px-5 py-4">
                <h2 className="text-base font-semibold">通知</h2>
                <Link href="/seller/notifications" className="text-sm text-neutral-400 hover:text-neutral-600">
                  すべて
                </Link>
              </div>
              <div className="px-5 pb-5">
                <NotificationList notifications={notifications.slice(0, 5)} variant="compact" />
              </div>
            </div>

            {/* クイックアクション */}
            <div className="bg-white rounded-2xl shadow-card">
              <div className="px-5 py-4">
                <h2 className="text-base font-semibold">クイックアクション</h2>
              </div>
              <div className="px-3 pb-3 space-y-1">
                {[
                  { href: '/seller/properties/new', icon: Plus, bg: 'bg-cta-50', color: 'text-cta-600', title: '新しい物件を出品', sub: '物件情報・書類をアップロード' },
                  { href: '/seller/bids', icon: Gavel, bg: 'bg-primary-50', color: 'text-primary-600', title: '入札を確認', sub: '受付中の入札を確認・選択' },
                  { href: '/seller/documents', icon: FileText, bg: 'bg-secondary-50', color: 'text-secondary-600', title: '書類を管理', sub: '書類のアップロード・閲覧許可' },
                ].map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors"
                  >
                    <div className={`w-9 h-9 ${action.bg} rounded-xl flex items-center justify-center shrink-0`}>
                      <action.icon className={`w-[18px] h-[18px] ${action.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{action.title}</p>
                      <p className="text-xs text-neutral-400">{action.sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
