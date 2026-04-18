'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Gavel } from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { BidStatusBadge } from '@/components/shared/BidStatusBadge'
import { buyerNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'
import { formatDate } from '@/lib/format'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type ApiBid = {
  id: string
  propertyId: string
  propertyTitle: string
  amount: number
  status: string
  createdAt: string
  updatedAt: string
}

export default function BuyerBidsPage() {
  const [bids, setBids] = useState<ApiBid[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await api.get<unknown>('/bids/me')
      if (res.success) {
        setBids(toItems<ApiBid>(res.data))
      }
      setLoading(false)
    }
    load()
  }, [])

  const filtered = filter ? bids.filter((b) => b.status === filter) : bids

  if (loading) {
    return (
      <DashboardShell title="入札履歴" roleLabel="買い手" navItems={buyerNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="入札履歴"
      roleLabel="買い手"
      navItems={buyerNav}
    >
      {/* フィルタ */}
      <div className="flex items-center gap-3 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
        >
          <option value="">すべてのステータス</option>
          <option value="active">有効</option>
          <option value="selected">選択済み</option>
          <option value="rejected">不採用</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center">
          <Gavel className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
          <p className="text-sm text-neutral-400">入札履歴はありません</p>
        </div>
      ) : (
        <>
          {/* PC: テーブル */}
          <div className="hidden sm:block bg-white rounded-2xl shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">物件名</th>
                    <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">入札額</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">入札日</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((bid) => (
                    <tr key={bid.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                      <td className="py-3.5 px-5">
                        <Link href={`/properties/${bid.propertyId}`} className="hover:text-primary-500">
                          <p className="font-medium">{bid.propertyTitle}</p>
                        </Link>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="price">{Math.round(bid.amount / 10000).toLocaleString()}</span>
                        <span className="text-xs text-neutral-400 ml-1">万円</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <BidStatusBadge status={bid.status} />
                      </td>
                      <td className="py-3.5 px-5 text-neutral-400">{formatDate(bid.createdAt)}</td>
                      <td className="py-3.5 px-5">
                        {bid.status === 'active' && (
                          <Link href={`/properties/${bid.propertyId}/bid`} className="text-sm text-primary-500 hover:text-primary-600">
                            入札を更新
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* モバイル: カード */}
          <div className="sm:hidden space-y-3">
            {filtered.map((bid) => (
              <Link
                key={bid.id}
                href={`/properties/${bid.propertyId}`}
                className="block bg-white rounded-2xl shadow-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium">{bid.propertyTitle}</p>
                  <BidStatusBadge status={bid.status} />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-neutral-400">
                  <span>入札日: {formatDate(bid.createdAt)}</span>
                  <span className="price text-sm text-foreground">{Math.round(bid.amount / 10000).toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  )
}
