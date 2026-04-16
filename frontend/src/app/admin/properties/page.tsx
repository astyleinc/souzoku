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
  Eye,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { mockProperties, PROPERTY_TYPE_LABEL } from '@/data/mock'

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

export default function AdminPropertiesPage() {
  return (
    <DashboardShell
      title="物件管理"
      roleLabel="管理画面"
      userName="田中 太郎"
      navItems={navItems}
    >
      {/* フィルタ・検索 */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="物件名・住所で検索..."
              className="pl-9 pr-4 py-2.5 text-sm border border-neutral-200 rounded-xl w-full sm:w-72 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors"
            />
          </div>
          <select className="px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
            <option value="">すべてのステータス</option>
            <option value="reviewing">審査待ち</option>
            <option value="published">公開</option>
            <option value="bidding">入札受付中</option>
            <option value="closed">成約</option>
            <option value="returned">差戻し</option>
          </select>
          <select className="px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
            <option value="">すべての種別</option>
            <option value="apartment">マンション</option>
            <option value="house">一戸建て</option>
            <option value="land">土地</option>
            <option value="other">その他</option>
          </select>
        </div>
        <p className="text-sm text-neutral-400">{mockProperties.length}件</p>
      </div>

      {/* PC: テーブル */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">物件名</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">種別</th>
                <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">希望価格</th>
                <th className="text-center py-3 px-5 text-xs text-neutral-400 font-medium">入札</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">登記</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">登録日</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {mockProperties.map((p) => (
                <tr key={p.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                  <td className="py-3.5 px-5">
                    <p className="font-medium truncate max-w-[200px]">{p.title}</p>
                    <p className="text-xs text-neutral-400">{p.address}</p>
                  </td>
                  <td className="py-3.5 px-5 text-neutral-500">{PROPERTY_TYPE_LABEL[p.type]}</td>
                  <td className="py-3.5 px-5 text-right">
                    <span className="price">{p.price.toLocaleString()}</span>
                    <span className="text-xs text-neutral-400 ml-1">万円</span>
                  </td>
                  <td className="py-3.5 px-5 text-center price">{p.bidCount}</td>
                  <td className="py-3.5 px-5"><StatusBadge status={p.status} /></td>
                  <td className="py-3.5 px-5 text-xs text-neutral-400">{p.registrationStatus}</td>
                  <td className="py-3.5 px-5 text-neutral-400">{p.createdAt}</td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/properties/${p.id}`} className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      {p.status === 'reviewing' && (
                        <>
                          <button className="p-1.5 text-success-500 hover:bg-success-50 rounded-lg transition-colors" title="承認">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-error-500 hover:bg-error-50 rounded-lg transition-colors" title="差戻し">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* モバイル: カード */}
      <div className="lg:hidden space-y-3">
        {mockProperties.map((p) => (
          <Link key={p.id} href={`/admin/properties/${p.id}`} className="block bg-white rounded-2xl shadow-card p-4 hover:shadow-dropdown transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{p.title}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{p.address}</p>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
              <span>{PROPERTY_TYPE_LABEL[p.type]}</span>
              <span className="price text-sm text-foreground">{p.price.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></span>
              <span className="ml-auto">入札 {p.bidCount}件</span>
            </div>
          </Link>
        ))}
      </div>
    </DashboardShell>
  )
}
