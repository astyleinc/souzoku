'use client'

import {
  DollarSign,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SummaryCard } from '@/components/shared/SummaryCard'
import { TransactionList } from '@/components/shared/TransactionList'
import { buyerNav } from '@/config/navigation'

const mockTransactions = [
  { id: 'tx1', propertyTitle: '中野区 投資用ワンルーム', amount: 1800, counterparty: '佐藤 太郎', status: 'completed' as const, date: '2026-03-20' },
  { id: 'tx2', propertyTitle: '練馬区 駅近マンション 3LDK', amount: 3600, counterparty: '中村 一郎', status: 'in_progress' as const, date: '2026-04-14' },
]

export default function BuyerTransactionsPage() {
  const completed = mockTransactions.filter((t) => t.status === 'completed')
  const totalAmount = completed.reduce((sum, t) => sum + t.amount, 0)
  const inProgress = mockTransactions.filter((t) => t.status === 'in_progress')

  return (
    <DashboardShell
      title="取引履歴"
      roleLabel="買い手"
      userName="株式会社山本不動産"
      navItems={buyerNav}
    >
      {/* サマリカード */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          icon={DollarSign}
          iconColor="text-success-500"
          iconBg="bg-success-50"
          label="総購入額"
          value={`${totalAmount.toLocaleString()}万`}
        />
        <SummaryCard
          icon={CheckCircle}
          iconColor="text-primary-500"
          iconBg="bg-primary-50"
          label="落札件数"
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
