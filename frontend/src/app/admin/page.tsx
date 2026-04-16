'use client'

import Link from 'next/link'
import {
  Building2,
  Gavel,
  Briefcase,
  Handshake,
  DollarSign,
  LayoutDashboard,
  Settings,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { mockProperties, mockKpis } from '@/data/mock'

const navItems = [
  { icon: LayoutDashboard, label: 'ダッシュボード', href: '/admin' },
  { icon: Building2, label: '物件管理', href: '/admin/properties' },
  { icon: Gavel, label: '入札管理', href: '/admin/bids' },
  { icon: Briefcase, label: '士業管理', href: '/admin/professionals' },
  { icon: Handshake, label: '業者管理', href: '/admin/brokers' },
  { icon: DollarSign, label: '収益管理', href: '/admin/revenue' },
  { icon: Users, label: 'ユーザー', href: '/admin/users' },
  { icon: Settings, label: '設定', href: '/admin/settings' },
]

const recentActivities = [
  { icon: CheckCircle, color: 'text-success-500', message: '世田谷区 二世帯住宅が成約しました', time: '2時間前' },
  { icon: Gavel, color: 'text-cta-500', message: '杉並区 土地に新しい入札（4,500万円）', time: '3時間前' },
  { icon: AlertCircle, color: 'text-warning-500', message: '板橋区 マンションの即決価格に到達', time: '5時間前' },
  { icon: Clock, color: 'text-info-500', message: '新規士業登録（税理士・山田太郎）認証待ち', time: '6時間前' },
  { icon: Building2, color: 'text-primary-500', message: '横浜市 マンションの書類審査が完了', time: '8時間前' },
]

export default function AdminDashboardPage() {
  const propertiesForReview = mockProperties.filter(
    (p) => p.status === 'reviewing' || p.status === 'pending_approval'
  )
  const activeProperties = mockProperties.filter(
    (p) => p.status === 'bidding' || p.status === 'published'
  )

  return (
    <DashboardShell
      title="ダッシュボード"
      roleLabel="管理画面"
      userName="田中 太郎"
      navItems={navItems}
    >
      {/* KPIカード */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {mockKpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl shadow-card p-4">
            <p className="text-xs text-neutral-400 mb-1">{kpi.label}</p>
            <p className="price text-xl text-foreground">{kpi.value}</p>
            <div className="flex items-center gap-1 mt-1.5">
              {kpi.trend === 'up' ? (
                <TrendingUp className="w-3.5 h-3.5 text-success-500" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-error-500" />
              )}
              <span className={`text-xs font-medium ${
                kpi.trend === 'up' ? 'text-success-500' : 'text-error-500'
              }`}>
                {kpi.change}
              </span>
            </div>
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
                  {[...propertiesForReview, ...activeProperties].slice(0, 6).map((p) => (
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
              {[...propertiesForReview, ...activeProperties].slice(0, 6).map((p) => (
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
          </div>
        </div>

        {/* 最近のアクティビティ + 士業パフォーマンス */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card">
            <div className="px-5 py-4">
              <h2 className="text-base font-semibold">最近のアクティビティ</h2>
            </div>
            <div className="px-5 pb-5 space-y-4">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <activity.icon className={`w-4 h-4 mt-0.5 shrink-0 ${activity.color}`} />
                  <div>
                    <p className="text-sm leading-snug">{activity.message}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card">
            <div className="px-5 py-4">
              <h2 className="text-base font-semibold">士業別 紹介件数</h2>
            </div>
            <div className="px-5 pb-5 space-y-3">
              {[
                { name: '山田 太郎（税理士）', count: 8, rate: '75%' },
                { name: '佐藤 花子（司法書士）', count: 5, rate: '60%' },
                { name: '田中 一郎（税理士）', count: 4, rate: '50%' },
                { name: '鈴木 次郎（司法書士）', count: 3, rate: '67%' },
              ].map((pro) => (
                <div key={pro.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{pro.name}</p>
                    <p className="text-xs text-neutral-400">成約率 {pro.rate}</p>
                  </div>
                  <span className="price text-sm text-foreground">{pro.count}件</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
