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
  Search,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { mockBids, BID_STATUS_LABEL } from '@/data/mock-dashboard'

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

const bidStatusStyle: Record<string, string> = {
  active: 'bg-cta-50 text-cta-700 ',
  superseded: 'bg-neutral-50 text-neutral-500 ',
  selected: 'bg-success-50 text-success-700 ',
  rejected: 'bg-error-50 text-error-700 ',
  cancelled: 'bg-neutral-50 text-neutral-400 border border-neutral-200',
}

export default function AdminBidsPage() {
  return (
    <DashboardShell
      title="入札管理"
      roleLabel="管理画面"
      userName="田中 太郎"
      navItems={navItems}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="物件名・入札者名で検索..."
              className="pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-xl w-72 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <select className="px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
            <option value="">すべてのステータス</option>
            {Object.entries(BID_STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <p className="text-sm text-neutral-400">{mockBids.length}件</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">物件名</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">入札者</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">種別</th>
                <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">入札額</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">入札日</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">更新日</th>
              </tr>
            </thead>
            <tbody>
              {mockBids.map((bid) => (
                <tr key={bid.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                  <td className="py-3 px-5">
                    <p className="font-medium truncate max-w-[200px]">{bid.propertyTitle}</p>
                  </td>
                  <td className="py-3 px-5">{bid.bidderName}</td>
                  <td className="py-3 px-5 text-neutral-400">{bid.bidderType}</td>
                  <td className="py-3 px-5 text-right">
                    <span className="price">{bid.amount.toLocaleString()}</span>
                    <span className="text-xs text-neutral-400 ml-1">万円</span>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium ${bidStatusStyle[bid.status]}`}>
                      {BID_STATUS_LABEL[bid.status]}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-neutral-400">{bid.createdAt}</td>
                  <td className="py-3 px-5 text-neutral-400">{bid.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  )
}
