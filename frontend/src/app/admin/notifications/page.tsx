'use client'

import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Check,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { adminNav } from '@/config/navigation'

const typeConfig = {
  info: { icon: Info, iconColor: 'text-info-500', bgColor: 'bg-info-50' },
  success: { icon: CheckCircle, iconColor: 'text-success-500', bgColor: 'bg-success-50' },
  warning: { icon: AlertTriangle, iconColor: 'text-warning-500', bgColor: 'bg-warning-50' },
  error: { icon: AlertCircle, iconColor: 'text-error-500', bgColor: 'bg-error-50' },
}

const adminNotifications = [
  { id: 'an1', message: '新しい物件が審査待ちです: 港区 タワーマンション', type: 'info' as const, isRead: false, createdAt: '2026-04-16 09:00' },
  { id: 'an2', message: '売主が入札者を選択しました（最高額以外）: 練馬区 駅近マンション', type: 'warning' as const, isRead: false, createdAt: '2026-04-15 16:30' },
  { id: 'an3', message: '即決価格に到達しました: 杉並区 閑静な住宅地の土地', type: 'warning' as const, isRead: false, createdAt: '2026-04-15 14:00' },
  { id: 'an4', message: '新規士業パートナーの認証申請: 木村 美紀（行政書士）', type: 'info' as const, isRead: false, createdAt: '2026-04-15 10:00' },
  { id: 'an5', message: '決済完了: 大田区 商業地の一戸建て（収益配分を確認してください）', type: 'success' as const, isRead: true, createdAt: '2026-04-14 16:00' },
  { id: 'an6', message: '登記未完了の物件が2ヶ月経過: 板橋区 リノベ向きマンション', type: 'error' as const, isRead: true, createdAt: '2026-04-14 09:00' },
  { id: 'an7', message: '新しい物件が代理登録されました: 新宿区 投資用マンション', type: 'info' as const, isRead: true, createdAt: '2026-04-13 15:00' },
]

export default function AdminNotificationsPage() {
  const unreadCount = adminNotifications.filter((n) => !n.isRead).length

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
        {unreadCount > 0 && (
          <button className="inline-flex items-center gap-1.5 text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors">
            <Check className="w-3.5 h-3.5" />
            すべて既読にする
          </button>
        )}
      </div>

      {adminNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="通知はありません"
          description="新しい通知があるとここに表示されます"
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-card divide-y divide-neutral-100">
          {adminNotifications.map((notification) => {
            const config = typeConfig[notification.type]
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
