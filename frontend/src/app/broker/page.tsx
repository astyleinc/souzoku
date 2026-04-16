'use client'

import { useState, useEffect } from 'react'
import {
  Briefcase,
  ChevronRight,
  TrendingUp,
  Star,
  MessageSquare,
  Bell,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { CaseStatusBadge } from '@/components/shared/CaseStatusBadge'
import { brokerNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'
import type { Notification, ApiNotification, Case } from '@/types/dashboard'
import { toNotification } from '@/types/dashboard'

type ApiCase = {
  id: string
  propertyId: string
  sellerId: string
  buyerId: string
  brokerId: string
  status: string
  salePrice: number
  createdAt: string
  updatedAt: string
}

export default function BrokerDashboardPage() {
  const [cases, setCases] = useState<ApiCase[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [caseRes, notifRes] = await Promise.all([
        api.get<unknown>('/cases?limit=10'),
        api.get<unknown>('/notifications?limit=5'),
      ])

      if (caseRes.success) {
        setCases(toItems<ApiCase>(caseRes.data))
      }
      if (notifRes.success) {
        setNotifications(toItems<ApiNotification>(notifRes.data).map(toNotification))
      }
      if (!caseRes.success && !notifRes.success) {
        setFetchError(true)
      }
      setLoading(false)
    }
    load()
  }, [])

  const activeCases = cases.filter((c) => c.status !== 'settlement_done' && c.status !== 'cancelled')
  const completedCount = cases.filter((c) => c.status === 'settlement_done').length

  return (
    <DashboardShell
      title="ダッシュボード"
      roleLabel="提携業者"
      navItems={brokerNav}
    >
      {/* サマリカード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Briefcase, color: 'text-primary-500', bg: 'bg-primary-50', label: '進行中の案件', value: String(activeCases.length) },
          { icon: TrendingUp, color: 'text-success-500', bg: 'bg-success-50', label: '累計成約件数', value: String(completedCount) },
          { icon: Star, color: 'text-warning-500', bg: 'bg-warning-50', label: '平均評価', value: '—' },
          { icon: MessageSquare, color: 'text-info-500', bg: 'bg-info-50', label: '未読通知', value: String(notifications.filter((n) => !n.isRead).length) },
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
          <Briefcase className="w-4 h-4 shrink-0" />
          データの取得に失敗しました。ネットワーク接続を確認し、ページを更新してください。
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* 案件一覧 */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-card">
              <div className="flex items-center justify-between px-5 py-4">
                <h2 className="text-base font-semibold">進行中の案件</h2>
                <Link href="/broker/cases" className="text-sm text-neutral-400 hover:text-neutral-600 flex items-center gap-1">
                  すべて <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {cases.length === 0 ? (
                <div className="px-5 pb-8 text-center">
                  <Briefcase className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
                  <p className="text-sm text-neutral-400">担当案件はありません</p>
                </div>
              ) : (
                <>
                  {/* PC: テーブル */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-t border-neutral-100">
                          <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">案件ID</th>
                          <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">売買価格</th>
                          <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                          <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">更新日</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cases.slice(0, 5).map((c) => (
                          <tr key={c.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                            <td className="py-3.5 px-5">
                              <Link href={`/broker/cases/${c.id}`} className="hover:text-primary-500 font-medium">
                                {c.id.slice(0, 8)}...
                              </Link>
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              <span className="price">{(c.salePrice / 10000).toLocaleString()}</span>
                              <span className="text-xs text-neutral-400 ml-1">万円</span>
                            </td>
                            <td className="py-3.5 px-5">
                              <CaseStatusBadge status={c.status as Case['status']} />
                            </td>
                            <td className="py-3.5 px-5 text-neutral-400 text-xs">
                              {new Date(c.updatedAt).toLocaleDateString('ja-JP')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* モバイル: カード */}
                  <div className="lg:hidden divide-y divide-neutral-100">
                    {cases.slice(0, 5).map((c) => (
                      <Link key={c.id} href={`/broker/cases/${c.id}`} className="block px-5 py-4 hover:bg-neutral-50/50">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-sm">{c.id.slice(0, 8)}...</p>
                            <p className="text-xs text-neutral-400 mt-0.5">{new Date(c.updatedAt).toLocaleDateString('ja-JP')}</p>
                          </div>
                          <CaseStatusBadge status={c.status as Case['status']} />
                        </div>
                        <p className="mt-2 text-sm">
                          <span className="price">{(c.salePrice / 10000).toLocaleString()}</span>
                          <span className="text-xs text-neutral-400 ml-1">万円</span>
                        </p>
                      </Link>
                    ))}
                  </div>
                </>
              )}
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
                notifications.slice(0, 5).map((n) => (
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
