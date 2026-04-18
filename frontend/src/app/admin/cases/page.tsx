'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { CaseStatusBadge } from '@/components/shared/CaseStatusBadge'
import { adminNav } from '@/config/navigation'
import { CASE_STATUS_LABEL } from '@/data/mock-dashboard'
import { api, toItems } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type CaseItem = {
  id: string
  propertyTitle: string
  propertyAddress: string
  sellerName: string
  buyerName: string
  brokerName: string
  status: string
  salePrice: number
  createdAt: string
  updatedAt: string
}

const statusStepCount: Record<string, number> = {
  broker_assigned: 1,
  seller_contacted: 2,
  buyer_contacted: 3,
  explanation_done: 4,
  contract_signed: 5,
  settlement_done: 6,
  cancelled: 0,
}

export default function AdminCasesPage() {
  const [cases, setCases] = useState<CaseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchCases = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (statusFilter) params.set('status', statusFilter)
    const res = await api.get<unknown>(`/cases?${params.toString()}`)
    if (res.success) {
      setCases(toItems<CaseItem>(res.data))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCases()
  }, [])

  const toMan = (yen: number) => Math.round(yen / 10000)

  const inProgress = cases.filter((c) => !['settlement_done', 'cancelled'].includes(c.status)).length
  const settled = cases.filter((c) => c.status === 'settlement_done').length
  const cancelled = cases.filter((c) => c.status === 'cancelled').length

  const summaryCards = [
    { label: '全案件', value: cases.length, icon: Clock, color: 'text-foreground' },
    { label: '進行中', value: inProgress, icon: AlertCircle, color: 'text-info-500' },
    { label: '決済完了', value: settled, icon: CheckCircle, color: 'text-success-500' },
    { label: '中止', value: cancelled, icon: XCircle, color: 'text-error-500' },
  ]

  return (
    <DashboardShell
      title="案件管理"
      roleLabel="管理画面"
      navItems={adminNav}
    >
      {/* サマリ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl shadow-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <card.icon className={`w-4 h-4 ${card.color}`} />
              <p className="text-xs text-neutral-400">{card.label}</p>
            </div>
            <p className={`price text-2xl ${card.color}`}>{card.value}<span className="text-sm font-normal text-neutral-400 ml-1">件</span></p>
          </div>
        ))}
      </div>

      {/* 検索 */}
      <div className="bg-white rounded-2xl shadow-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchCases()}
              placeholder="物件名・売主名・買い手名で検索"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">全ステータス</option>
            {Object.entries(CASE_STATUS_LABEL).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <button
            onClick={fetchCases}
            className="px-5 py-2.5 text-sm font-medium text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors"
          >
            検索
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* テーブル（PC） */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">物件名</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">売主</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">買い手</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">担当業者</th>
                    <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">成約額</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">進捗</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">更新日</th>
                    <th className="py-3 px-5"></th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c) => {
                    const step = statusStepCount[c.status] ?? 0
                    const progressPct = c.status === 'cancelled' ? 0 : (step / 6) * 100
                    return (
                      <tr key={c.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                        <td className="py-3.5 px-5 font-medium">{c.propertyTitle}</td>
                        <td className="py-3.5 px-5 text-neutral-600">{c.sellerName}</td>
                        <td className="py-3.5 px-5 text-neutral-600">{c.buyerName}</td>
                        <td className="py-3.5 px-5 text-neutral-600 text-xs">{c.brokerName}</td>
                        <td className="py-3.5 px-5 text-right price">{toMan(c.salePrice).toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></td>
                        <td className="py-3.5 px-5">
                          <CaseStatusBadge status={c.status} />
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="w-20 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${c.status === 'settlement_done' ? 'bg-success-500' : c.status === 'cancelled' ? 'bg-error-300' : 'bg-primary-400'}`}
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-neutral-400">{c.updatedAt?.slice(0, 10)}</td>
                        <td className="py-3.5 px-5">
                          <Link href={`/admin/cases/${c.id}`} className="text-primary-500 hover:underline text-xs font-medium">
                            詳細
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* カード（モバイル） */}
          <div className="lg:hidden space-y-3">
            {cases.map((c) => {
              const step = statusStepCount[c.status] ?? 0
              const progressPct = c.status === 'cancelled' ? 0 : (step / 6) * 100
              return (
                <Link key={c.id} href={`/admin/cases/${c.id}`} className="block bg-white rounded-2xl shadow-card p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-sm font-medium">{c.propertyTitle}</p>
                    <CaseStatusBadge status={c.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-neutral-400 mb-3">
                    <p>売主: <span className="text-neutral-600">{c.sellerName}</span></p>
                    <p>買い手: <span className="text-neutral-600">{c.buyerName}</span></p>
                    <p>業者: <span className="text-neutral-600">{c.brokerName}</span></p>
                    <p>成約額: <span className="price text-neutral-600">{toMan(c.salePrice).toLocaleString()}</span>万円</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${c.status === 'settlement_done' ? 'bg-success-500' : c.status === 'cancelled' ? 'bg-error-300' : 'bg-primary-400'}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-300 shrink-0" />
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </DashboardShell>
  )
}
