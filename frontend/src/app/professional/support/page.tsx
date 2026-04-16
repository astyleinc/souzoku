'use client'

import { DashboardShell } from '@/components/layout/DashboardShell'
import { SupportTicketList } from '@/components/shared/SupportTicketList'
import { professionalNav } from '@/config/navigation'

export default function ProfessionalSupportPage() {
  return (
    <DashboardShell
      title="サポート"
      roleLabel="士業パートナー"
      navItems={professionalNav}
    >
      <SupportTicketList contactHref="/contact" />
    </DashboardShell>
  )
}
