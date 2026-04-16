'use client'

import { SettingsPage } from '@/components/shared/SettingsPage'
import { professionalNav } from '@/config/navigation'

export default function ProfessionalSettingsPage() {
  return <SettingsPage roleLabel="士業パートナー" navItems={professionalNav} />
}
