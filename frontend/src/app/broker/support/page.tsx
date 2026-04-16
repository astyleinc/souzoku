'use client'

import { DashboardShell } from '@/components/layout/DashboardShell'
import { SupportTicketList } from '@/components/shared/SupportTicketList'
import { brokerNav } from '@/config/navigation'

export default function BrokerSupportPage() {
  return (
    <DashboardShell
      title="サポート"
      roleLabel="提携業者"
      userName="エリア不動産株式会社"
      navItems={brokerNav}
    >
      <SupportTicketList contactHref="/contact" />
    </DashboardShell>
  )
}
