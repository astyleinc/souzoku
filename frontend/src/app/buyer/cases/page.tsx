'use client'

import {
  CheckCircle,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { buyerNav } from '@/config/navigation'
import { mockCases, CASE_STATUS_LABEL } from '@/data/mock-dashboard'

const statusSteps = ['broker_assigned', 'seller_contacted', 'buyer_contacted', 'explanation_done', 'contract_signed', 'settlement_done']

const caseStatusStyle: Record<string, string> = {
  broker_assigned: 'bg-info-50 text-info-700',
  seller_contacted: 'bg-info-50 text-info-700',
  buyer_contacted: 'bg-warning-50 text-warning-700',
  explanation_done: 'bg-warning-50 text-warning-700',
  contract_signed: 'bg-success-50 text-success-700',
  settlement_done: 'bg-success-50 text-success-700',
  cancelled: 'bg-error-50 text-error-700',
}

export default function BuyerCasesPage() {
  const buyerCases = mockCases.filter((c) => c.buyerName === '株式会社アーバン' || c.buyerName === '株式会社山本不動産')

  return (
    <DashboardShell
      title="案件進捗"
      roleLabel="買い手"
      userName="株式会社山本不動産"
      navItems={buyerNav}
    >
      <p className="text-sm text-neutral-400 mb-6">
        落札後の売買手続きの進捗を確認できます
      </p>

      {buyerCases.length === 0 ? (
        <EmptyState
          icon={CheckCircle}
          title="進行中の案件はありません"
          description="入札が承認されると、ここで売買手続きの進捗を確認できます"
        />
      ) : (
        <div className="space-y-4">
          {buyerCases.map((c) => {
            const stepIndex = statusSteps.indexOf(c.status)
            const progress = c.status === 'cancelled' ? 0 : Math.round(((stepIndex + 1) / statusSteps.length) * 100)
            return (
              <Link key={c.id} href={`/buyer/cases/${c.id}`} className="block bg-white rounded-2xl shadow-card p-5 hover:shadow-dropdown transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-semibold">{c.propertyTitle}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{c.propertyAddress}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${caseStatusStyle[c.status] || 'bg-neutral-100 text-neutral-600'}`}>
                      {CASE_STATUS_LABEL[c.status]}
                    </span>
                    <ChevronRight className="w-4 h-4 text-neutral-300" />
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-neutral-400 mb-3">
                  <span>成約額: <span className="price text-neutral-600">{c.amount.toLocaleString()}</span>万円</span>
                  <span>更新: {c.updatedAt}</span>
                </div>

                {c.status !== 'cancelled' && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-neutral-400 shrink-0">{progress}%</span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </DashboardShell>
  )
}
