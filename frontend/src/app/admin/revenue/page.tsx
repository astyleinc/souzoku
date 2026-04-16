'use client'

import {
  Building2,
  Gavel,
  Briefcase,
  Handshake,
  DollarSign,
  LayoutDashboard,
  Settings,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { mockRevenue } from '@/data/mock-dashboard'

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

const paymentStatusConfig = {
  paid: { label: '入金確認済み', icon: CheckCircle, bg: 'bg-success-50 text-success-700' },
  invoiced: { label: '請求済み', icon: Clock, bg: 'bg-warning-50 text-warning-700' },
  unpaid: { label: '未請求', icon: AlertCircle, bg: 'bg-neutral-50 text-neutral-500' },
}

export default function AdminRevenuePage() {
  const totalBrokerage = mockRevenue.reduce((sum, r) => sum + r.brokerageFee, 0)
  const totalOuver = mockRevenue.reduce((sum, r) => sum + r.ouverAmount, 0)
  const pendingAmount = mockRevenue
    .filter((r) => r.paymentStatus !== 'paid')
    .reduce((sum, r) => sum + r.ouverAmount, 0)

  return (
    <DashboardShell
      title="収益管理"
      roleLabel="管理画面"
      userName="田中 太郎"
      navItems={navItems}
    >
      {/* サマリ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-card p-4">
          <p className="text-xs text-neutral-400 mb-1">累計仲介手数料</p>
          <p className="price text-2xl text-foreground">{totalBrokerage.toFixed(1)}<span className="text-sm font-normal text-neutral-400 ml-1">万円</span></p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4">
          <p className="text-xs text-neutral-400 mb-1">Ouver収益</p>
          <p className="price text-2xl text-primary-500">{totalOuver.toFixed(1)}<span className="text-sm font-normal text-neutral-400 ml-1">万円</span></p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4">
          <p className="text-xs text-neutral-400 mb-1">未入金・未請求</p>
          <p className="price text-2xl text-warning-500">{pendingAmount.toFixed(1)}<span className="text-sm font-normal text-neutral-400 ml-1">万円</span></p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-4">
          <p className="text-xs text-neutral-400 mb-1">成約件数</p>
          <p className="price text-2xl text-foreground">{mockRevenue.length}<span className="text-sm font-normal text-neutral-400 ml-1">件</span></p>
        </div>
      </div>

      {/* 収益明細 */}
      <div className="bg-white rounded-2xl shadow-card">
        <div className="px-5 py-4">
          <h2 className="text-2xl font-semibold">収益明細</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">物件名</th>
                <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">成約価格</th>
                <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">手数料</th>
                <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">業者</th>
                <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">Ouver</th>
                <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">士業</th>
                <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">NW</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">NW経由</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">支払状況</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {mockRevenue.map((r) => {
                const status = paymentStatusConfig[r.paymentStatus]
                return (
                  <tr key={r.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50">
                    <td className="py-3.5 px-5 font-medium">{r.propertyTitle}</td>
                    <td className="py-3.5 px-5 text-right price">{r.salePrice.toLocaleString()}</td>
                    <td className="py-3.5 px-5 text-right price">{r.brokerageFee.toFixed(0)}</td>
                    <td className="py-3.5 px-5 text-right price">{r.brokerAmount.toFixed(1)}</td>
                    <td className="py-3.5 px-5 text-right price text-primary-500">{r.ouverAmount.toFixed(1)}</td>
                    <td className="py-3.5 px-5 text-right price">{r.professionalAmount.toFixed(1)}</td>
                    <td className="py-3.5 px-5 text-right price">{r.nwAmount.toFixed(1)}</td>
                    <td className="py-3.5 px-5 text-xs text-neutral-400">{r.isNwReferral ? 'NW経由' : '直接'}</td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      {r.paymentStatus === 'unpaid' && (
                        <button className="text-xs text-cta-500 hover:underline font-medium">請求書発行</button>
                      )}
                      {r.paymentStatus === 'invoiced' && (
                        <button className="text-xs text-success-500 hover:underline font-medium">入金確認</button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-neutral-100 text-xs text-neutral-400">
          ※ 金額はすべて万円（税別）
        </div>
      </div>
    </DashboardShell>
  )
}
