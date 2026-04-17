'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Building2,
  Gavel,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Users,
  DollarSign,
  Briefcase,
  FileText,
  Loader2,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { adminNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'
import { toProperty } from '@/lib/mappers'
import type { ApiProperty } from '@/lib/mappers'

type DashboardData = {
  properties: {
    total: number
    reviewing: number
    published: number
    bidding: number
    closed: number
    returned: number
  }
  bids: {
    total: number
    active: number
  }
  revenue: {
    monthlyTotal: number
    monthlyOuver: number
  }
  professionals: {
    total: number
    verified: number
    pending: number
  }
  brokers: {
    total: number
  }
  pendingPayments: number
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [properties, setProperties] = useState<ReturnType<typeof toProperty>[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [dashRes, propRes] = await Promise.all([
        api.get<DashboardData>('/admin/dashboard'),
        api.get<unknown>('/properties?includeAll=true&limit=6'),
      ])

      if (dashRes.success) {
        setDashboard(dashRes.data)
      }
      if (propRes.success) {
        setProperties(toItems<ApiProperty>(propRes.data).map(toProperty))
      }
      if (!dashRes.success && !propRes.success) {
        setFetchError(true)
      }
      setLoading(false)
    }
    load()
  }, [])

  const reviewProperties = properties.filter(
    (p) => p.status === 'reviewing' || p.status === 'pending_approval'
  )
  const activeProperties = properties.filter(
    (p) => p.status === 'bidding' || p.status === 'published'
  )
  const displayProperties = [...reviewProperties, ...activeProperties].slice(0, 6)

  const kpis = dashboard ? [
    { label: '物件数', value: String(dashboard.properties.total), icon: Building2 },
    { label: '審査待ち', value: String(dashboard.properties.reviewing), icon: Building2 },
    { label: '入札受付中', value: String(dashboard.properties.bidding), icon: Gavel },
    { label: '成約', value: String(dashboard.properties.closed), icon: TrendingUp },
    { label: '士業数', value: String(dashboard.professionals.total), icon: Users },
    { label: '業者数', value: String(dashboard.brokers.total), icon: Briefcase },
  ] : []

  return (
    <DashboardShell
      title="ダッシュボード"
      roleLabel="管理画面"
      navItems={adminNav}
    >
      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-error-700 bg-error-50 rounded-xl">
          <TrendingDown className="w-4 h-4 shrink-0" />
          データの取得に失敗しました。ネットワーク接続を確認し、ページを更新してください。
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      ) : (
        <>
          {/* KPIカード */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-2xl shadow-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon className="w-4 h-4 text-neutral-400" />
                  <p className="text-xs text-neutral-400">{kpi.label}</p>
                </div>
                <p className="price text-xl text-foreground">{kpi.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* 要対応 */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl shadow-card">
                <div className="flex items-center justify-between px-5 py-4">
                  <h2 className="text-base font-semibold">要対応の物件</h2>
                  <Link href="/admin/properties" className="text-sm text-neutral-400 hover:text-neutral-600 flex items-center gap-1">
                    すべて <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {displayProperties.length === 0 ? (
                  <div className="px-5 pb-8 text-center">
                    <Building2 className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
                    <p className="text-sm text-neutral-400">対応が必要な物件はありません</p>
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
                            <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                            <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">対応</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayProperties.map((p) => (
                            <tr key={p.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                              <td className="py-3.5 px-5">
                                <p className="font-medium truncate max-w-[200px]">{p.title}</p>
                                <p className="text-xs text-neutral-400">{p.address}</p>
                              </td>
                              <td className="py-3.5 px-5 text-right">
                                <span className="price">{p.price.toLocaleString()}</span>
                                <span className="text-xs text-neutral-400 ml-1">万円</span>
                              </td>
                              <td className="py-3.5 px-5">
                                <StatusBadge status={p.status} />
                              </td>
                              <td className="py-3.5 px-5">
                                <Link
                                  href={`/admin/properties/${p.id}`}
                                  className="text-sm text-primary-500 hover:text-primary-600"
                                >
                                  詳細
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* モバイル: カード */}
                    <div className="sm:hidden divide-y divide-neutral-100">
                      {displayProperties.map((p) => (
                        <Link key={p.id} href={`/admin/properties/${p.id}`} className="block px-5 py-4 hover:bg-neutral-50/50">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">{p.title}</p>
                              <p className="text-xs text-neutral-400 mt-0.5">{p.address}</p>
                            </div>
                            <StatusBadge status={p.status} />
                          </div>
                          <p className="mt-2 text-sm"><span className="price">{p.price.toLocaleString()}</span><span className="text-xs text-neutral-400 ml-1">万円</span></p>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* クイックリンク */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-card">
                <div className="px-5 py-4">
                  <h2 className="text-base font-semibold">管理メニュー</h2>
                </div>
                <div className="px-3 pb-3 space-y-1">
                  {[
                    { href: '/admin/properties', icon: Building2, label: '物件管理' },
                    { href: '/admin/bids', icon: Gavel, label: '入札管理' },
                    { href: '/admin/cases', icon: Briefcase, label: '案件管理' },
                    { href: '/admin/professionals', icon: Users, label: '士業管理' },
                    { href: '/admin/brokers', icon: Users, label: '業者管理' },
                    { href: '/admin/revenue', icon: DollarSign, label: '収益管理' },
                    { href: '/admin/content', icon: FileText, label: 'コンテンツ管理' },
                    { href: '/admin/users', icon: Users, label: 'ユーザー管理' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors"
                    >
                      <item.icon className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm font-medium">{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-neutral-300 ml-auto" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  )
}
