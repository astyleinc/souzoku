'use client'

import {
  Building2,
  Gavel,
  FileText,
  LayoutDashboard,
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  Check,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { mockNotifications } from '@/data/mock-dashboard'

const navItems = [
  { icon: LayoutDashboard, label: 'ダッシュボード', href: '/seller' },
  { icon: Building2, label: '出品物件', href: '/seller/properties' },
  { icon: Gavel, label: '入札一覧', href: '/seller/bids' },
  { icon: FileText, label: '書類管理', href: '/seller/documents' },
  { icon: Bell, label: '通知', href: '/seller/notifications' },
]

const typeIcon = {
  info: Clock,
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
}

const typeColor = {
  info: 'text-info-500',
  success: 'text-success-500',
  warning: 'text-warning-500',
  error: 'text-error-500',
}

export default function SellerNotificationsPage() {
  return (
    <DashboardShell
      title="通知"
      roleLabel="売主"
      userName="中村 一郎"
      navItems={navItems}
    >
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-400">
          未読: {mockNotifications.filter((n) => !n.isRead).length}件
        </p>
        <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm text-primary-500 hover:bg-primary-50 rounded-xl transition-colors">
          <Check className="w-4 h-4" />
          すべて既読にする
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card divide-y divide-neutral-100">
        {mockNotifications.map((n) => {
          const Icon = typeIcon[n.type]
          return (
            <div
              key={n.id}
              className={`px-5 py-4 flex items-start gap-3 hover:bg-neutral-50/50 transition-colors ${
                n.isRead ? 'opacity-50' : ''
              }`}
            >
              <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${typeColor[n.type]}`} />
              <div className="flex-1">
                <p className={`text-sm leading-snug ${n.isRead ? '' : 'font-medium'}`}>{n.message}</p>
                <p className="text-xs text-neutral-400 mt-1">{n.createdAt}</p>
              </div>
              {!n.isRead && (
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 shrink-0" />
              )}
            </div>
          )
        })}
      </div>
    </DashboardShell>
  )
}
