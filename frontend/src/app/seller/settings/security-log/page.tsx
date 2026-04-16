'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SecurityLog } from '@/components/shared/SecurityLog'
import { sellerNav } from '@/config/navigation'

export default function SellerSecurityLogPage() {
  return (
    <DashboardShell
      title="ログイン履歴"
      roleLabel="売主"
      navItems={sellerNav}
    >
      <Link href="/seller/settings" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        設定に戻る
      </Link>
      <SecurityLog />
    </DashboardShell>
  )
}
