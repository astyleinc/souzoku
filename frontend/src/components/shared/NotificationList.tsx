import { CheckCircle, AlertCircle, Clock, Bell } from 'lucide-react'
import type { Notification } from '@/data/mock-dashboard'

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

type NotificationListProps = {
  notifications: Notification[]
  variant?: 'full' | 'compact'
}

export const NotificationList = ({
  notifications,
  variant = 'full',
}: NotificationListProps) => {
  if (notifications.length === 0) {
    return (
      <div className="py-8 text-center">
        <Bell className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
        <p className="text-sm text-neutral-400">通知はありません</p>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        {notifications.map((n) => {
          const Icon = typeIcon[n.type]
          return (
            <div key={n.id} className={`flex items-start gap-3 ${n.isRead ? 'opacity-50' : ''}`}>
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${typeColor[n.type]}`} />
              <div>
                <p className="text-sm leading-snug">{n.message}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{n.createdAt}</p>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="divide-y divide-neutral-100">
      {notifications.map((n) => {
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
  )
}
