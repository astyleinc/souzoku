'use client'

import { NotificationPage } from '@/components/shared/NotificationPage'
import { professionalNav } from '@/config/navigation'

export default function ProfessionalNotificationsPage() {
  return (
    <NotificationPage
      roleLabel="士業パートナー"
      navItems={professionalNav}
    />
  )
}
