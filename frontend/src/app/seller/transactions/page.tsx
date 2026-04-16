'use client'

import {
  DollarSign,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SummaryCard } from '@/components/shared/SummaryCard'
import { TransactionList } from '@/components/shared/TransactionList'
import { sellerNav } from '@/config/navigation'

const mockTransactions = [
  { id: 'tx1', propertyTitle: '練馬区 駅近マンション 3LDK', amount: 3200, counterparty: '株式会社山本不動産', status: 'completed' as const, date: '2026-03-25' },
  { id: 'tx2', propertyTitle: '杉並区 閑静な住宅地の土地', amount: 4500, counterparty: '田中建設株式会社', status: 'in_progress' as const, date: '2026-04-10' },
  { id: 'tx3', propertyTitle: '世田谷区 二世帯住宅', amount: 6800, counterparty: '（選定中）', status: 'in_progress' as const, date: '2026-04-15' },
]

export default function SellerTransactionsPage() {
  const completed = mockTransactions.filter((t) => t.status === 'completed')
  const totalAmount = completed.reduce((sum, t) => sum + t.amount, 0)
  const inProgress = mockTransactions.filter((t) => t.status === 'in_progress')

  return (
    <DashboardShell
      title="取引履歴"
      roleLabel="売主"
      userName="中村 一郎"
      navItems={sellerNav}
    >
      {/* サマリカード */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          icon={DollarSign}
          iconColor="text-success-500"
          iconBg="bg-success-50"
          label="総売却額"
          value={`${totalAmount.toLocaleString()}万`}
        />
        <SummaryCard
          icon={CheckCircle}
          iconColor="text-primary-500"
          iconBg="bg-primary-50"
          label="成約件数"
          value={String(completed.length)}
        />
        <SummaryCard
          icon={Clock}
          iconColor="text-info-500"
          iconBg="bg-info-50"
          label="進行中"
          value={String(inProgress.length)}
        />
      </div>

      <TransactionList transactions={mockTransactions} />
    </DashboardShell>
  )
}
