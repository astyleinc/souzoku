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
  Plus,
  Star,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { mockBrokers } from '@/data/mock-dashboard'

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

export default function AdminBrokersPage() {
  return (
    <DashboardShell
      title="業者管理"
      roleLabel="管理画面"
      userName="田中 太郎"
      navItems={navItems}
    >
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-400">{mockBrokers.length}社</p>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors">
          <Plus className="w-4 h-4" />
          業者を追加
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockBrokers.map((broker) => (
          <div key={broker.id} className="bg-white rounded-2xl shadow-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold">{broker.companyName}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">{broker.representativeName}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-warning-500" />
                <span className="price text-sm">{broker.averageRating}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">免許番号</span>
                <span className="text-xs">{broker.licenseNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">累計成約</span>
                <span className="price">{broker.totalDeals}件</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">メール</span>
                <span className="text-xs truncate max-w-[160px]">{broker.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">電話</span>
                <span className="text-xs">{broker.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">登録日</span>
                <span className="text-xs">{broker.createdAt}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-2">
              <button className="flex-1 py-1.5 text-xs font-medium text-primary-500 border border-primary-200 rounded-xl hover:bg-primary-50 transition-all duration-200">
                詳細
              </button>
              <button className="flex-1 py-1.5 text-xs font-medium text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-all duration-200">
                編集
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  )
}
