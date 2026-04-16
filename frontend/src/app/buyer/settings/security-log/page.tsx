'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SecurityLog } from '@/components/shared/SecurityLog'
import { buyerNav } from '@/config/navigation'

export default function BuyerSecurityLogPage() {
  return (
    <DashboardShell
      title="ログイン履歴"
      roleLabel="買い手"
      userName="株式会社山本不動産"
      navItems={buyerNav}
    >
      <Link href="/buyer/settings" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        設定に戻る
      </Link>
      <SecurityLog />
    </DashboardShell>
  )
}
