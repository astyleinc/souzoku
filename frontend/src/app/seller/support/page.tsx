'use client'

import { DashboardShell } from '@/components/layout/DashboardShell'
import { SupportTicketList } from '@/components/shared/SupportTicketList'
import { sellerNav } from '@/config/navigation'

export default function SellerSupportPage() {
  return (
    <DashboardShell
      title="サポート"
      roleLabel="売主"
      userName="中村 一郎"
      navItems={sellerNav}
    >
      <SupportTicketList contactHref="/contact" />
    </DashboardShell>
  )
}
