'use client'

import { useState, useEffect } from 'react'
import {
  DollarSign,
  CheckCircle,
  Clock,
  Loader2,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SummaryCard } from '@/components/shared/SummaryCard'
import { TransactionList } from '@/components/shared/TransactionList'
import { sellerNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'

type Transaction = {
  id: string
  propertyTitle: string
  amount: number
  counterparty: string
  status: 'completed' | 'in_progress'
  date: string
}

const toMan = (yen: number) => Math.round(yen / 10000)

export default function SellerTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    const load = async () => {
      const res = await api.get<unknown>('/transactions/seller')
      if (res.success) {
        setTransactions(toItems<Transaction>(res.data))
      } else {
        setFetchError(true)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <DashboardShell title="取引履歴" roleLabel="売主" navItems={sellerNav}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
      </DashboardShell>
    )
  }

  const completed = transactions.filter((t) => t.status === 'completed')
  const totalAmount = completed.reduce((sum, t) => sum + toMan(t.amount), 0)
  const inProgress = transactions.filter((t) => t.status === 'in_progress')

  return (
    <DashboardShell
      title="取引履歴"
      roleLabel="売主"
      navItems={sellerNav}
    >
      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-error-700 bg-error-50 rounded-xl">
          データの取得に失敗しました。ページを更新してください。
        </div>
      )}

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

      <TransactionList transactions={transactions.map((t) => ({ ...t, amount: toMan(t.amount) }))} />
    </DashboardShell>
  )
}
