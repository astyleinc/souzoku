'use client'

import { DashboardShell } from '@/components/layout/DashboardShell'
import { SupportTicketList } from '@/components/shared/SupportTicketList'
import { buyerNav } from '@/config/navigation'

export default function BuyerSupportPage() {
  return (
    <DashboardShell
      title="サポート"
      roleLabel="買い手"
      userName="株式会社山本不動産"
      navItems={buyerNav}
    >
      <SupportTicketList contactHref="/contact" />
    </DashboardShell>
  )
}
