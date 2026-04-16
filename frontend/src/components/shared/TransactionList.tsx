'use client'

import {
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react'

type Transaction = {
  id: string
  propertyTitle: string
  amount: number
  counterparty: string
  status: 'completed' | 'in_progress' | 'cancelled'
  date: string
}

const statusConfig = {
  completed: { label: '完了', icon: CheckCircle, className: 'bg-success-50 text-success-700' },
  in_progress: { label: '進行中', icon: Clock, className: 'bg-info-50 text-info-700' },
  cancelled: { label: '中止', icon: AlertTriangle, className: 'bg-neutral-100 text-neutral-600' },
}

type TransactionListProps = {
  transactions: Transaction[]
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  return (
    <>
      {/* PC: テーブル */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">物件名</th>
                <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">金額</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">取引相手</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">日付</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const sc = statusConfig[tx.status]
                return (
                  <tr key={tx.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                    <td className="py-3.5 px-5 font-medium">{tx.propertyTitle}</td>
                    <td className="py-3.5 px-5 text-right price">{tx.amount.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></td>
                    <td className="py-3.5 px-5 text-neutral-500">{tx.counterparty}</td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${sc.className}`}>
                        <sc.icon className="w-3 h-3" />
                        {sc.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-neutral-400">{tx.date}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* モバイル: カード */}
      <div className="lg:hidden space-y-3">
        {transactions.map((tx) => {
          const sc = statusConfig[tx.status]
          return (
            <div key={tx.id} className="bg-white rounded-2xl shadow-card p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium">{tx.propertyTitle}</p>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${sc.className}`}>
                  <sc.icon className="w-3 h-3" />
                  {sc.label}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-neutral-400">{tx.counterparty}</span>
                <span className="price text-sm font-medium">{tx.amount.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">{tx.date}</p>
            </div>
          )
        })}
      </div>
    </>
  )
}
