'use client'

import { NotificationPage } from '@/components/shared/NotificationPage'
import { professionalNav } from '@/config/navigation'
import { mockNotifications } from '@/data/mock-dashboard'

export default function ProfessionalNotificationsPage() {
  return (
    <NotificationPage
      roleLabel="士業パートナー"
      userName="山田 太郎"
      navItems={professionalNav}
      notifications={mockNotifications}
    />
  )
}
