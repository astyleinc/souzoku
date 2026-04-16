'use client'

import { SettingsPage } from '@/components/shared/SettingsPage'
import { adminNav } from '@/config/navigation'

export default function AdminSettingsPage() {
  return <SettingsPage roleLabel="管理画面" navItems={adminNav} />
}
