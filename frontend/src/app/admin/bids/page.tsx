'use client'

import { useState, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { BidStatusBadge } from '@/components/shared/BidStatusBadge'
import { adminNav } from '@/config/navigation'
import { BID_STATUS_LABEL } from '@/data/mock-dashboard'
import { api, toItems } from '@/lib/api'

type BidItem = {
  id: string
  propertyId: string
  propertyTitle: string
  bidderName: string
  bidderType: string
  amount: number
  status: string
  createdAt: string
  updatedAt: string
}

export default function AdminBidsPage() {
  const [bids, setBids] = useState<BidItem[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchBids = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (statusFilter) params.set('status', statusFilter)
    // 管理者用入札一覧のAPIが存在する前提
    const res = await api.get<unknown>(`/bids?role=admin&${params.toString()}`)
    if (res.success) {
      setBids(toItems<BidItem>(res.data))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchBids()
  }, [])

  const toMan = (yen: number) => Math.round(yen / 10000)

  return (
    <DashboardShell
      title="入札管理"
      roleLabel="管理画面"
      navItems={adminNav}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchBids()}
              placeholder="物件名・入札者名で検索..."
              className="pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-xl w-72 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
          >
            <option value="">すべてのステータス</option>
            {Object.entries(BID_STATUS_LABEL).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            onClick={fetchBids}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors"
          >
            検索
          </button>
        </div>
        <p className="text-sm text-neutral-400">{bids.length}件</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">物件名</th>
                  <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">入札者</th>
                  <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">種別</th>
                  <th className="text-right py-3 px-5 text-xs text-neutral-400 font-medium">入札額</th>
                  <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                  <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">入札日</th>
                  <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((bid) => (
                  <tr key={bid.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                    <td className="py-3 px-5">
                      <p className="font-medium truncate max-w-[200px]">{bid.propertyTitle}</p>
                    </td>
                    <td className="py-3 px-5">{bid.bidderName}</td>
                    <td className="py-3 px-5 text-neutral-400">{bid.bidderType}</td>
                    <td className="py-3 px-5 text-right">
                      <span className="price">{toMan(bid.amount).toLocaleString()}</span>
                      <span className="text-xs text-neutral-400 ml-1">万円</span>
                    </td>
                    <td className="py-3 px-5">
                      <BidStatusBadge status={bid.status} />
                    </td>
                    <td className="py-3 px-5 text-neutral-400">{bid.createdAt?.slice(0, 10)}</td>
                    <td className="py-3 px-5">
                      <Link href={`/admin/bids/${bid.id}`} className="text-xs text-primary-500 hover:underline font-medium">
                        詳細
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
