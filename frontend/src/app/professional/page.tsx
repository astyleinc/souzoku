'use client'

import {
  LayoutDashboard,
  Users,
  DollarSign,
  Link2,
  Bell,
  FileText,
  ChevronRight,
  TrendingUp,
  Copy,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { mockProperties } from '@/data/mock'
import { mockNotifications } from '@/data/mock-dashboard'

const navItems = [
  { icon: LayoutDashboard, label: 'ダッシュボード', href: '/professional' },
  { icon: Users, label: '紹介案件', href: '/professional/referrals' },
  { icon: DollarSign, label: '紹介料実績', href: '/professional/earnings' },
  { icon: Link2, label: '紹介リンク', href: '/professional/referral-link' },
  { icon: FileText, label: '書類閲覧', href: '/professional/documents' },
  { icon: Bell, label: '通知', href: '/professional/notifications' },
]

export default function ProfessionalDashboardPage() {
  const referredProperties = mockProperties.slice(0, 3)

  return (
    <DashboardShell
      title="ダッシュボード"
      roleLabel="士業パートナー"
      userName="山田 太郎"
      navItems={navItems}
    >
      {/* サマリカード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, color: 'text-primary-500', bg: 'bg-primary-50', label: '紹介件数', value: '8', sub: '今月 +2件', subIcon: TrendingUp, subColor: 'text-success-500' },
          { icon: CheckCircle, color: 'text-success-500', bg: 'bg-success-50', label: '成約件数', value: '6', sub: '成約率 75%' },
          { icon: DollarSign, color: 'text-cta-500', bg: 'bg-cta-50', label: '累計紹介料', value: '128.4', sub: '万円' },
          { icon: DollarSign, color: 'text-warning-500', bg: 'bg-warning-50', label: '未入金', value: '15.3', sub: '万円（1件）' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl shadow-card p-5">
            <div className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
              <card.icon className={`w-[18px] h-[18px] ${card.color}`} />
            </div>
            <p className="text-xs text-neutral-400 mb-1">{card.label}</p>
            <p className="price text-2xl text-foreground">{card.value}</p>
            {card.subIcon ? (
              <p className={`text-xs ${card.subColor} flex items-center gap-1 mt-1`}>
                <card.subIcon className="w-3 h-3" />
                {card.sub}
              </p>
            ) : (
              <p className="text-xs text-neutral-400 mt-1">{card.sub}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 紹介案件一覧 */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-card">
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-base font-semibold">紹介案件</h2>
              <Link href="/professional/referrals" className="text-sm text-neutral-400 hover:text-neutral-600 flex items-center gap-1">
                すべて <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* PC: テーブル */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-neutral-100">
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">物件名</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">売主</th>
                    <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">価格</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {referredProperties.map((p) => (
                    <tr key={p.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                      <td className="py-3.5 px-5">
                        <p className="font-medium truncate max-w-[200px]">{p.title}</p>
                        <p className="text-xs text-neutral-400">{p.address}</p>
                      </td>
                      <td className="py-3.5 px-5 text-neutral-500">中村 一郎</td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="price">{p.price.toLocaleString()}</span>
                        <span className="text-xs text-neutral-400 ml-1">万円</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* モバイル: カード */}
            <div className="sm:hidden divide-y divide-neutral-100">
              {referredProperties.map((p) => (
                <div key={p.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{p.title}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{p.address}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
                    <span>売主: 中村 一郎</span>
                    <span className="price text-sm text-foreground">{p.price.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 紹介リンク + 通知 */}
        <div className="space-y-6">
          {/* 紹介リンク */}
          <div className="bg-white rounded-2xl shadow-card">
            <div className="px-5 py-4">
              <h2 className="text-base font-semibold">紹介リンク</h2>
            </div>
            <div className="px-5 pb-5">
              <p className="text-xs text-neutral-400 mb-3">
                このリンクを売主に共有すると、紹介案件として自動的に紐づけられます
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://ouver.jp/register?ref=TAX_YAMADA_001"
                  className="flex-1 px-3 py-2.5 text-xs border border-neutral-200 rounded-xl bg-neutral-50 text-neutral-500"
                />
                <button className="p-2.5 text-primary-500 hover:bg-primary-50 rounded-xl transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4">
                <p className="text-xs text-neutral-400 mb-2">NW経由の場合:</p>
                <select className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
                  <option value="">NW経由ではない（直接紹介）</option>
                  <option value="awaka">awaka cross</option>
                </select>
              </div>
            </div>
          </div>

          {/* 通知 */}
          <div className="bg-white rounded-2xl shadow-card">
            <div className="px-5 py-4">
              <h2 className="text-base font-semibold">通知</h2>
            </div>
            <div className="px-5 pb-5 space-y-4">
              {mockNotifications.slice(0, 3).map((n) => (
                <div key={n.id} className={`flex items-start gap-3 ${n.isRead ? 'opacity-50' : ''}`}>
                  <Bell className="w-4 h-4 mt-0.5 shrink-0 text-info-500" />
                  <div>
                    <p className="text-sm leading-snug">{n.message}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{n.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
