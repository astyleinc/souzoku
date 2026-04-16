'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SecurityLog } from '@/components/shared/SecurityLog'
import { brokerNav } from '@/config/navigation'

export default function BrokerSecurityLogPage() {
  return (
    <DashboardShell
      title="ログイン履歴"
      roleLabel="提携業者"
      userName="エリア不動産株式会社"
      navItems={brokerNav}
    >
      <Link href="/broker/settings" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        設定に戻る
      </Link>
      <SecurityLog />
    </DashboardShell>
  )
}
