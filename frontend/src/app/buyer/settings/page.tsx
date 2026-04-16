'use client'

import { SettingsPage } from '@/components/shared/SettingsPage'
import { buyerNav } from '@/config/navigation'

export default function BuyerSettingsPage() {
  return <SettingsPage roleLabel="買い手" navItems={buyerNav} />
}
