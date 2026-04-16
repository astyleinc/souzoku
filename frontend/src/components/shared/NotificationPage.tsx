'use client'

import { useState, useEffect } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { NotificationList } from '@/components/shared/NotificationList'
import type { NavItem } from '@/config/navigation'
import type { Notification, ApiNotification } from '@/types/dashboard'
import { toNotification } from '@/types/dashboard'
import { api, toItems } from '@/lib/api'

type NotificationPageProps = {
  roleLabel: string
  navItems: NavItem[]
}

export const NotificationPage = ({
  roleLabel,
  navItems,
}: NotificationPageProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const res = await api.get<unknown>('/notifications?limit=50')
    if (res.success) {
      setNotifications(toItems<ApiNotification>(res.data).map(toNotification))
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleMarkAllRead = async () => {
    const res = await api.post('/notifications/read-all')
    if (res.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    }
  }

  return (
    <DashboardShell
      title="通知"
      roleLabel={roleLabel}
      navItems={navItems}
    >
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-400">
          未読: {unreadCount}件
        </p>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm text-primary-500 hover:bg-primary-50 rounded-xl transition-colors"
          >
            <Check className="w-4 h-4" />
            すべて既読にする
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card">
          <NotificationList notifications={notifications} variant="full" />
        </div>
      )}
    </DashboardShell>
  )
}
