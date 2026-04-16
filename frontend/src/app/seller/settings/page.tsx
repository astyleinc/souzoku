'use client'

import { SettingsPage } from '@/components/shared/SettingsPage'
import { sellerNav } from '@/config/navigation'

export default function SellerSettingsPage() {
  return <SettingsPage roleLabel="売主" navItems={sellerNav} />
}
