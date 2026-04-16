'use client'

import {
  LayoutDashboard,
  Users,
  DollarSign,
  Link2,
  Bell,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { mockRevenue } from '@/data/mock-dashboard'

const navItems = [
  { icon: LayoutDashboard, label: 'ダッシュボード', href: '/professional' },
  { icon: Users, label: '紹介案件', href: '/professional/referrals' },
  { icon: DollarSign, label: '紹介料実績', href: '/professional/earnings' },
  { icon: Link2, label: '紹介リンク', href: '/professional/referral-link' },
  { icon: FileText, label: '書類閲覧', href: '/professional/documents' },
  { icon: Bell, label: '通知', href: '/professional/notifications' },
]

const paymentStatusConfig = {
  paid: { label: '入金済み', icon: CheckCircle, color: 'text-success-500', bg: 'bg-success-50 text-success-700' },
  invoiced: { label: '請求済み', icon: Clock, color: 'text-warning-500', bg: 'bg-warning-50 text-warning-700' },
  unpaid: { label: '未請求', icon: AlertCircle, color: 'text-neutral-400', bg: 'bg-neutral-100 text-neutral-500' },
}

export default function ProfessionalEarningsPage() {
  const totalEarnings = mockRevenue.reduce((sum, r) => sum + r.professionalAmount, 0)
  const paidAmount = mockRevenue.filter((r) => r.paymentStatus === 'paid').reduce((sum, r) => sum + r.professionalAmount, 0)
  const pendingAmount = totalEarnings - paidAmount

  return (
    <DashboardShell
      title="紹介料実績"
      roleLabel="士業パートナー"
      userName="山田 太郎"
      navItems={navItems}
    >
      {/* サマリ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: '累計紹介料', value: totalEarnings.toFixed(1), color: 'text-foreground' },
          { label: '入金済み', value: paidAmount.toFixed(1), color: 'text-success-500' },
          { label: '未入金', value: pendingAmount.toFixed(1), color: 'text-warning-500' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl shadow-card p-5">
            <p className="text-xs text-neutral-400 mb-1">{item.label}</p>
            <p className={`price text-2xl ${item.color}`}>{item.value}<span className="text-sm font-normal text-neutral-400 ml-1">万円</span></p>
          </div>
        ))}
      </div>

      {/* PC: テーブル */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-card">
        <div className="px-5 py-4">
          <h2 className="text-base font-semibold">紹介料明細</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-neutral-100">
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">物件名</th>
                <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">成約価格</th>
                <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">紹介料（15%）</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">NW</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">支払状況</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">成約日</th>
              </tr>
            </thead>
            <tbody>
              {mockRevenue.map((r) => {
                const status = paymentStatusConfig[r.paymentStatus]
                return (
                  <tr key={r.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                    <td className="py-3.5 px-5 font-medium">{r.propertyTitle}</td>
                    <td className="py-3.5 px-5 text-right">
                      <span className="price">{r.salePrice.toLocaleString()}</span>
                      <span className="text-xs text-neutral-400 ml-1">万円</span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span className="price">{r.professionalAmount.toFixed(1)}</span>
                      <span className="text-xs text-neutral-400 ml-1">万円</span>
                    </td>
                    <td className="py-3.5 px-5 text-xs text-neutral-400">
                      {r.isNwReferral ? 'NW経由' : '直接紹介'}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${status.bg}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-neutral-400">{r.closedAt}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* モバイル: カード */}
      <div className="lg:hidden space-y-3">
        <h2 className="text-base font-semibold mb-3">紹介料明細</h2>
        {mockRevenue.map((r) => {
          const status = paymentStatusConfig[r.paymentStatus]
          return (
            <div key={r.id} className="bg-white rounded-2xl shadow-card p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium">{r.propertyTitle}</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium shrink-0 ${status.bg}`}>
                  {status.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div>
                  <span className="text-neutral-400">成約価格</span>
                  <p className="price text-sm mt-0.5">{r.salePrice.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></p>
                </div>
                <div>
                  <span className="text-neutral-400">紹介料</span>
                  <p className="price text-sm mt-0.5">{r.professionalAmount.toFixed(1)}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </DashboardShell>
  )
}
