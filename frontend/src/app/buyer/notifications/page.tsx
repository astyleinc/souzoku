'use client'

import { NotificationPage } from '@/components/shared/NotificationPage'
import { buyerNav } from '@/config/navigation'
import { mockNotifications } from '@/data/mock-dashboard'

export default function BuyerNotificationsPage() {
  return (
    <NotificationPage
      roleLabel="買い手"
      userName="株式会社山本不動産"
      navItems={buyerNav}
      notifications={mockNotifications}
    />
  )
}
