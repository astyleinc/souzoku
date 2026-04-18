'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Briefcase } from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { CaseStatusBadge } from '@/components/shared/CaseStatusBadge'
import { brokerNav } from '@/config/navigation'
import { CASE_STATUS_LABEL } from '@/data/mock-dashboard'
import { api, toItems } from '@/lib/api'
import type { Case } from '@/types/dashboard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function BrokerCasesPage() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await api.get<unknown>('/cases?role=broker')
      if (res.success) {
        setCases(toItems<Case>(res.data))
      }
      setLoading(false)
    }
    load()
  }, [])

  const filtered = filter ? cases.filter((c) => c.status === filter) : cases

  if (loading) {
    return (
      <DashboardShell title="案件管理" roleLabel="提携業者" navItems={brokerNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="案件管理"
      roleLabel="提携業者"
      navItems={brokerNav}
    >
      {/* フィルタ */}
      <div className="flex items-center gap-3 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
        >
          <option value="">すべてのステータス</option>
          {Object.entries(CASE_STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center">
          <Briefcase className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
          <p className="text-sm text-neutral-400">案件はありません</p>
        </div>
      ) : (
        <>
          {/* PC: テーブル */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">物件名</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">売主</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">買い手</th>
                    <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">成約額</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">更新日</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                      <td className="py-3.5 px-5">
                        <p className="font-medium truncate max-w-[180px]">{c.propertyTitle}</p>
                        <p className="text-xs text-neutral-400">{c.propertyAddress}</p>
                      </td>
                      <td className="py-3.5 px-5 text-neutral-500">{c.sellerName}</td>
                      <td className="py-3.5 px-5 text-neutral-500">{c.buyerName}</td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="price">{Math.round(c.amount / 10000).toLocaleString()}</span>
                        <span className="text-xs text-neutral-400 ml-1">万円</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <CaseStatusBadge status={c.status} />
                      </td>
                      <td className="py-3.5 px-5 text-neutral-400">{c.updatedAt?.slice(0, 10)}</td>
                      <td className="py-3.5 px-5">
                        <Link href={`/broker/cases/${c.id}`} className="text-sm text-primary-500 hover:text-primary-600">
                          詳細
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* モバイル: カード */}
          <div className="lg:hidden space-y-3">
            {filtered.map((c) => (
              <Link key={c.id} href={`/broker/cases/${c.id}`} className="block bg-white rounded-2xl shadow-card p-4 hover:shadow-dropdown transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{c.propertyTitle}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{c.propertyAddress}</p>
                  </div>
                  <CaseStatusBadge status={c.status} />
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
                  <span>売主: {c.sellerName}</span>
                  <span>買い手: {c.buyerName}</span>
                  <span className="ml-auto price text-sm text-foreground">{Math.round(c.amount / 10000).toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  )
}
