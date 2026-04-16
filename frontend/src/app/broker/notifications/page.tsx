'use client'

import { NotificationPage } from '@/components/shared/NotificationPage'
import { brokerNav } from '@/config/navigation'
import { mockNotifications } from '@/data/mock-dashboard'

export default function BrokerNotificationsPage() {
  return (
    <NotificationPage
      roleLabel="提携業者"
      userName="松本 大輝"
      navItems={brokerNav}
      notifications={mockNotifications}
    />
  )
}
