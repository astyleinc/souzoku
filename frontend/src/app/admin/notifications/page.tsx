'use client'

import { useState, useEffect } from 'react'
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Check,
  Send,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { adminNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'
import { toNotification } from '@/types/dashboard'
import type { ApiNotification } from '@/types/dashboard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

const typeConfig = {
  info: { icon: Info, iconColor: 'text-info-500', bgColor: 'bg-info-50' },
  success: { icon: CheckCircle, iconColor: 'text-success-500', bgColor: 'bg-success-50' },
  warning: { icon: AlertTriangle, iconColor: 'text-warning-500', bgColor: 'bg-warning-50' },
  error: { icon: AlertCircle, iconColor: 'text-error-500', bgColor: 'bg-error-50' },
}

type Notification = {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: string
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<unknown>('/notifications?limit=50')
      if (res.success) {
        setNotifications(
          toItems<ApiNotification>(res.data).map((n) => {
            const mapped = toNotification(n)
            return {
              id: mapped.id,
              message: mapped.message,
              type: mapped.type as Notification['type'],
              isRead: mapped.isRead,
              createdAt: mapped.createdAt,
            }
          })
        )
      }
      setLoading(false)
    }
    load()
  }, [])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleReadAll = async () => {
    await api.post('/notifications/read-all')
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  if (loading) {
    return (
      <DashboardShell title="通知" roleLabel="管理画面" navItems={adminNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="通知"
      roleLabel="管理画面"
      navItems={adminNav}
    >
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-400">
          未読 <span className="font-medium text-foreground">{unreadCount}</span> 件
        </p>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleReadAll}
              className="inline-flex items-center gap-1.5 text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              すべて既読にする
            </button>
          )}
          <Link
            href="/admin/notifications/broadcast"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
          >
            <Send className="w-4 h-4" />
            通知を送信
          </Link>
        </div>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="通知はありません"
          description="新しい通知があるとここに表示されます"
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-card divide-y divide-neutral-100">
          {notifications.map((notification) => {
            const config = typeConfig[notification.type] ?? typeConfig.info
            return (
              <div
                key={notification.id}
                className={`flex items-start gap-3 px-5 py-4 ${!notification.isRead ? 'bg-primary-50/30' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.bgColor}`}>
                  <config.icon className={`w-4 h-4 ${config.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${!notification.isRead ? 'font-medium' : 'text-neutral-600'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">{notification.createdAt}</p>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-primary-500 rounded-full shrink-0 mt-2" />
                )}
              </div>
            )
          })}
        </div>
      )}
    </DashboardShell>
  )
}
