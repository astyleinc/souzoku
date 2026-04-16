'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { AccountDeletionForm } from '@/components/shared/AccountDeletionForm'
import { professionalNav } from '@/config/navigation'

export default function ProfessionalAccountDeletionPage() {
  return (
    <DashboardShell
      title="アカウント削除"
      roleLabel="士業パートナー"
      navItems={professionalNav}
    >
      <Link href="/professional/settings" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        設定に戻る
      </Link>
      <AccountDeletionForm
        roleName="士業パートナー"
      />
    </DashboardShell>
  )
}
