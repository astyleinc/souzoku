'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { AccountDeletionForm } from '@/components/shared/AccountDeletionForm'
import { sellerNav } from '@/config/navigation'

export default function SellerAccountDeletionPage() {
  return (
    <DashboardShell
      title="アカウント削除"
      roleLabel="売主"
      userName="中村 一郎"
      navItems={sellerNav}
    >
      <Link href="/seller/settings" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        設定に戻る
      </Link>
      <AccountDeletionForm
        roleName="売主"
        userName="中村 一郎"
        hasPendingTransactions={true}
      />
    </DashboardShell>
  )
}
