'use client'

import { Check } from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { NotificationList } from '@/components/shared/NotificationList'
import type { NavItem } from '@/config/navigation'
import type { Notification } from '@/data/mock-dashboard'

type NotificationPageProps = {
  roleLabel: string
  userName: string
  navItems: NavItem[]
  notifications: Notification[]
}

export const NotificationPage = ({
  roleLabel,
  userName,
  navItems,
  notifications,
}: NotificationPageProps) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <DashboardShell
      title="通知"
      roleLabel={roleLabel}
      userName={userName}
      navItems={navItems}
    >
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-400">
          未読: {unreadCount}件
        </p>
        <button className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm text-primary-500 hover:bg-primary-50 rounded-xl transition-colors">
          <Check className="w-4 h-4" />
          すべて既読にする
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card">
        <NotificationList notifications={notifications} variant="full" />
      </div>
    </DashboardShell>
  )
}
