'use client'

import { NotificationPage } from '@/components/shared/NotificationPage'
import { sellerNav } from '@/config/navigation'

export default function SellerNotificationsPage() {
  return (
    <NotificationPage
      roleLabel="売主"
      navItems={sellerNav}
    />
  )
}
