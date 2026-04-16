'use client'

import { NotificationPage } from '@/components/shared/NotificationPage'
import { brokerNav } from '@/config/navigation'

export default function BrokerNotificationsPage() {
  return (
    <NotificationPage
      roleLabel="提携業者"
      navItems={brokerNav}
    />
  )
}
