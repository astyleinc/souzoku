'use client'

import { NotificationPage } from '@/components/shared/NotificationPage'
import { buyerNav } from '@/config/navigation'

export default function BuyerNotificationsPage() {
  return (
    <NotificationPage
      roleLabel="買い手"
      navItems={buyerNav}
    />
  )
}
