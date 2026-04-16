'use client'

import { SettingsPage } from '@/components/shared/SettingsPage'
import { brokerNav } from '@/config/navigation'

export default function BrokerSettingsPage() {
  return <SettingsPage roleLabel="提携業者" navItems={brokerNav} />
}
