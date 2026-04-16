'use client'

import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Bell,
  ChevronRight,
  TrendingUp,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { mockCases, CASE_STATUS_LABEL, mockNotifications } from '@/data/mock-dashboard'

const navItems = [
  { icon: LayoutDashboard, label: 'ダッシュボード', href: '/broker' },
  { icon: Briefcase, label: '案件管理', href: '/broker/cases' },
  { icon: MessageSquare, label: 'メッセージ', href: '/broker/messages' },
  { icon: Bell, label: '通知', href: '/broker/notifications' },
]

const caseStatusStyle: Record<string, string> = {
  broker_assigned: 'bg-info-50 text-info-700',
  seller_contacted: 'bg-primary-50 text-primary-700',
  buyer_contacted: 'bg-primary-50 text-primary-700',
  explanation_done: 'bg-warning-50 text-warning-700',
  contract_signed: 'bg-cta-50 text-cta-700',
  settlement_done: 'bg-success-50 text-success-700',
  cancelled: 'bg-error-50 text-error-700',
}

export default function BrokerDashboardPage() {
  const activeCases = mockCases.filter((c) => c.status !== 'settlement_done' && c.status !== 'cancelled')

  return (
    <DashboardShell
      title="ダッシュボード"
      roleLabel="提携業者"
      userName="松本 大輝"
      navItems={navItems}
    >
      {/* サマリカード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Briefcase, color: 'text-primary-500', bg: 'bg-primary-50', label: '進行中の案件', value: String(activeCases.length) },
          { icon: TrendingUp, color: 'text-success-500', bg: 'bg-success-50', label: '累計成約件数', value: '15' },
          { icon: Star, color: 'text-warning-500', bg: 'bg-warning-50', label: '平均評価', value: '4.2', sub: '/ 5.0' },
          { icon: MessageSquare, color: 'text-info-500', bg: 'bg-info-50', label: '未対応メッセージ', value: '2' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl shadow-card p-5">
            <div className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
              <card.icon className={`w-[18px] h-[18px] ${card.color}`} />
            </div>
            <p className="text-xs text-neutral-400 mb-1">{card.label}</p>
            <p className="price text-2xl text-foreground">{card.value}</p>
            {card.sub && <p className="text-xs text-neutral-400 mt-1">{card.sub}</p>}
          </div>
        ))}
      </div>

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

            {/* PC: テーブル */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-neutral-100">
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">物件名</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">売主</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">買い手</th>
                    <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">成約額</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCases.map((c) => (
                    <tr key={c.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                      <td className="py-3.5 px-5">
                        <Link href={`/broker/cases/${c.id}`} className="hover:text-primary-500">
                          <p className="font-medium truncate max-w-[180px]">{c.propertyTitle}</p>
                          <p className="text-xs text-neutral-400">{c.propertyAddress}</p>
                        </Link>
                      </td>
                      <td className="py-3.5 px-5 text-neutral-500">{c.sellerName}</td>
                      <td className="py-3.5 px-5 text-neutral-500">{c.buyerName}</td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="price">{c.amount.toLocaleString()}</span>
                        <span className="text-xs text-neutral-400 ml-1">万円</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${caseStatusStyle[c.status]}`}>
                          {CASE_STATUS_LABEL[c.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* モバイル: カード */}
            <div className="lg:hidden divide-y divide-neutral-100">
              {mockCases.map((c) => (
                <Link key={c.id} href={`/broker/cases/${c.id}`} className="block px-5 py-4 hover:bg-neutral-50/50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{c.propertyTitle}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{c.propertyAddress}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium shrink-0 ${caseStatusStyle[c.status]}`}>
                      {CASE_STATUS_LABEL[c.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
                    <span>売主: {c.sellerName}</span>
                    <span>買い手: {c.buyerName}</span>
                    <span className="ml-auto price text-sm text-foreground">{c.amount.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></span>
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
            {mockNotifications.slice(0, 5).map((n) => (
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
